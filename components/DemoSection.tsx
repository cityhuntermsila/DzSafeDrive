
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { analyzeImage } from '../services/geminiService';
import { AnalysisResponse, HazardType, ThreatLevel } from '../types';
import { PagePath } from '../App';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface DemoSectionProps {
  onNavigate?: (path: PagePath) => void;
}

export const DemoSection: React.FC<DemoSectionProps> = ({ onNavigate }) => {
  const [mode, setMode] = useState<'camera' | 'upload'>('upload');
  const [isLive, setIsLive] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [history, setHistory] = useState<{ type: string; time: string; level: string }[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const uploadVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);
  const isAnalysingRef = useRef(false);
  const lastSpokenSummaryRef = useRef<string>("");

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const speakSummary = async (text: string) => {
    if (!text || text === lastSpokenSummaryRef.current) return;
    lastSpokenSummaryRef.current = text;
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Alerte DzSafeDrive : ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && audioContextRef.current) {
        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          audioContextRef.current,
          24000,
          1
        );
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      }
    } catch (err) {
      console.warn("TTS Error:", err);
    }
  };

  const playAlert = useCallback((level: ThreatLevel) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (level === ThreatLevel.HIGH) {
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (level === ThreatLevel.MEDIUM) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsLive(false);
    if (analysisIntervalRef.current) {
      window.clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [stream]);

  const handleModeChange = (newMode: 'camera' | 'upload') => {
    setMode(newMode);
    setImage(null);
    setResult(null);
    setError(null);
    setIsLive(false);
    if (analysisIntervalRef.current) {
      window.clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    if (newMode === 'upload') stopCamera();
  };

  const captureFrame = useCallback((targetVideo: HTMLVideoElement | null): string | null => {
    if (!targetVideo || !canvasRef.current || targetVideo.readyState < 2) return null;
    const canvas = canvasRef.current;
    canvas.width = targetVideo.videoWidth;
    canvas.height = targetVideo.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(targetVideo, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  }, []);

  const performAnalysis = useCallback(async (dataUrl: string) => {
    if (isAnalysingRef.current) return;
    isAnalysingRef.current = true;
    setLoading(true);
    
    try {
      const analysis = await analyzeImage(dataUrl);
      setResult(analysis);
      
      if (analysis.risks.length > 0) {
        const newHistory = analysis.risks.map(r => ({
          type: r.type,
          level: r.threatLevel,
          time: new Date().toLocaleTimeString('fr-FR', { hour12: false })
        }));
        setHistory(prev => [...newHistory, ...prev].slice(0, 5));
        
        const maxThreat = analysis.risks.reduce((max, curr) => {
          if (curr.threatLevel === ThreatLevel.HIGH) return ThreatLevel.HIGH;
          if (curr.threatLevel === ThreatLevel.MEDIUM && max !== ThreatLevel.HIGH) return ThreatLevel.MEDIUM;
          return max;
        }, ThreatLevel.LOW);
        
        if (maxThreat !== ThreatLevel.LOW) playAlert(maxThreat);
        if (analysis.alertNeeded) speakSummary(analysis.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      isAnalysingRef.current = false;
    }
  }, [playAlert]);

  const toggleLive = () => {
    if (mode === 'camera') return;
    initAudio();
    if (isLive) {
      setIsLive(false);
      if (analysisIntervalRef.current) {
        window.clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    } else {
      const targetVideo = uploadVideoRef.current;
      if (!videoFileUrl && !image) {
        setError("Veuillez importer un média.");
        return;
      }
      setIsLive(true);
      const frame = captureFrame(targetVideo);
      if (frame) performAnalysis(frame);

      analysisIntervalRef.current = window.setInterval(() => {
        const frame = captureFrame(uploadVideoRef.current);
        if (frame) performAnalysis(frame);
      }, 4000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      initAudio();
      setResult(null);
      setImage(null);
      setVideoFileUrl(null);
      setIsLive(false);
      if (analysisIntervalRef.current) {
        window.clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
      if (file.type.startsWith('video/')) {
        setVideoFileUrl(URL.createObjectURL(file));
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setImage(base64);
          performAnalysis(base64);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const drawOverlays = () => {
    if (!result || mode === 'camera' || !!videoFileUrl) return null;
    return result.risks.map((risk, index) => {
      const [ymin, xmin, ymax, xmax] = risk.box;
      const style: React.CSSProperties = {
        top: `${ymin / 10}%`,
        left: `${xmin / 10}%`,
        width: `${(xmax - xmin) / 10}%`,
        height: `${(ymax - ymin) / 10}%`,
        borderColor: risk.threatLevel === ThreatLevel.HIGH ? '#DC2626' : risk.threatLevel === ThreatLevel.MEDIUM ? '#2563EB' : '#ffffff',
      };
      return (
        <div 
          key={index} 
          className={`absolute border-2 rounded pointer-events-none transition-all duration-1000 ease-in-out ${risk.threatLevel === ThreatLevel.HIGH ? 'animate-pulse' : ''}`}
          style={style}
        >
          <div className={`absolute top-0 left-0 -translate-y-full px-2 py-0.5 text-[8px] font-black text-white uppercase rounded-t flex items-center gap-1 ${risk.threatLevel === ThreatLevel.HIGH ? 'bg-[#DC2626]' : risk.threatLevel === ThreatLevel.MEDIUM ? 'bg-[#2563EB]' : 'bg-slate-600'}`}>
            <i className={`fas ${risk.type === 'person' ? 'fa-person' : risk.type === 'animal' ? 'fa-paw' : 'fa-triangle-exclamation'}`}></i>
            {risk.type}
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) window.clearInterval(analysisIntervalRef.current);
      stopCamera();
      if (videoFileUrl) URL.revokeObjectURL(videoFileUrl);
    };
  }, [videoFileUrl, stopCamera]);

  return (
    <section id="demo" className="pt-4 pb-10 bg-[#0F172A] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[8px] font-black mb-1.5 uppercase tracking-[0.2em]">
            <span className="relative flex h-1 w-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75"></span><span className="relative inline-flex rounded-full h-1 w-1 bg-[#DC2626]"></span></span>
            Laboratoire de Vision IA
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1 leading-tight">Démonstrateur Interactif</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">Analysez vos flux en temps réel avec la puissance de l'IA.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-3 order-1 lg:order-2 flex flex-col items-center">
            {/* Zone d'affichage réduite de 20% (max-w-[80%] sur desktop) */}
            <div className="w-full lg:w-[80%] mx-auto relative aspect-video bg-black rounded-[1.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group">
              {mode === 'camera' ? (
                <div className="absolute inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 bg-[#DC2626] rounded-xl flex items-center justify-center text-white text-xl shadow-2xl mb-4">
                    <i className="fas fa-lock"></i>
                  </div>
                  <h3 className="text-lg font-black mb-2 text-white">Accès Premium Requis</h3>
                  <p className="text-slate-400 max-w-sm mb-5 leading-relaxed font-medium text-[11px]">
                    L'analyse en direct via caméra est une fonctionnalité réservée aux abonnés Advanced Pro.
                  </p>
                  <button 
                    onClick={() => {
                      if (onNavigate) onNavigate('pricing');
                    }} 
                    className="bg-[#DC2626] text-white px-5 py-2.5 rounded-full font-black text-[8px] uppercase tracking-widest hover:bg-[#B91C1C] transition-all"
                  >
                    Découvrir les offres
                  </button>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 z-0 flex items-center justify-center">
                    {mode === 'upload' && videoFileUrl && <video key={videoFileUrl} ref={uploadVideoRef} src={videoFileUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />}
                    {image && <img src={image} className="w-full h-full object-cover opacity-80" />}
                    {!videoFileUrl && !image && <div className="text-white text-center opacity-20"><i className="fas fa-eye-slash text-4xl mb-2"></i><p className="font-black uppercase tracking-widest text-[8px]">Importez un média</p></div>}
                  </div>
                  <div className="absolute inset-0 z-10 pointer-events-none">{drawOverlays()}</div>
                  {isLive && <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden"><div className="w-full h-[1px] bg-[#DC2626]/50 shadow-[0_0_15px_rgba(220,38,38,0.5)] absolute animate-[scan_5s_linear_infinite]"></div></div>}
                </>
              )}
            </div>
            
            {result && mode === 'upload' && (
              <div className="w-full lg:w-[80%] mt-4 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex gap-4 items-center animate-fade-in shadow-xl mx-auto">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${loading ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/30' : 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/20'}`}>
                  <i className={`fas ${loading ? 'fa-circle-notch fa-spin' : 'fa-brain'} text-base`}></i>
                </div>
                <div>
                  <p className="text-[7px] font-black text-[#DC2626] mb-0.5 uppercase tracking-widest opacity-90">Assistant Vocal SafeDrive</p>
                  <p className="text-white leading-relaxed italic text-[11px] font-medium">"{result.summary}"</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl">
              <h3 className="text-[8px] font-black mb-4 text-slate-500 uppercase tracking-widest">Contrôles</h3>
              <div className="flex gap-2 p-1 bg-black/40 rounded-lg mb-4">
                <button onClick={() => handleModeChange('upload')} className={`flex-1 py-1.5 rounded text-[8px] font-black transition-all uppercase tracking-widest ${mode === 'upload' ? 'bg-[#DC2626] text-white' : 'text-slate-400 hover:text-white'}`}>IMPORT</button>
                <button onClick={() => handleModeChange('camera')} className={`flex-1 py-1.5 rounded text-[8px] font-black transition-all uppercase tracking-widest ${mode === 'camera' ? 'bg-[#DC2626] text-white' : 'text-slate-400 hover:text-white'}`}>LIVE</button>
              </div>

              {mode === 'upload' && (
                <>
                  {(videoFileUrl || image) && (
                    <button onClick={toggleLive} className={`w-full py-2.5 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all mb-3 ${isLive ? 'bg-[#0F172A] border border-[#DC2626] text-[#DC2626]' : 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'}`}>
                      {isLive ? 'Arrêter le scan' : 'Lancer le scan'}
                    </button>
                  )}
                  <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-[#DC2626] transition-all group">
                    <i className="fas fa-upload text-lg text-slate-600 group-hover:text-[#DC2626] mb-1.5"></i>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{videoFileUrl || image ? 'Remplacer' : 'Charger'}</p>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="video/*,image/*" />
                  </div>
                </>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl max-h-[200px] overflow-hidden">
              <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Événements</h3>
              <div className="space-y-1.5">
                {history.length > 0 ? history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-[8px] p-2 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1 h-1 rounded-full ${h.level === 'high' ? 'bg-[#DC2626]' : 'bg-[#2563EB]'}`}></div>
                      <span className="font-bold text-white capitalize">{h.type}</span>
                    </div>
                    <span className="text-slate-500 font-mono">{h.time}</span>
                  </div>
                )) : <p className="text-[8px] text-slate-600 text-center py-2 italic">Aucun risque détecté</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <style>{`@keyframes scan { 0% { top: 0% } 100% { top: 100% } }`}</style>
    </section>
  );
};
