
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { analyzeImage } from '../services/geminiService';
import { AnalysisResponse, HazardType, ThreatLevel } from '../types';

// Fonctions utilitaires pour le décodage audio PCM
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

export const DemoSection: React.FC = () => {
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
    if (mode === 'camera') return; // Bloqué par le message d'abonnement
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
        borderColor: risk.threatLevel === ThreatLevel.HIGH ? '#ef4444' : risk.threatLevel === ThreatLevel.MEDIUM ? '#FFB81C' : '#ffffff',
      };
      return (
        <div 
          key={index} 
          className={`absolute border-2 rounded pointer-events-none transition-all duration-1000 ease-in-out ${risk.threatLevel === ThreatLevel.HIGH ? 'animate-pulse' : ''}`}
          style={style}
        >
          <div className={`absolute top-0 left-0 -translate-y-full px-2 py-0.5 text-[8px] font-black text-white uppercase rounded-t flex items-center gap-1 ${risk.threatLevel === ThreatLevel.HIGH ? 'bg-red-500' : risk.threatLevel === ThreatLevel.MEDIUM ? 'bg-[#FFB81C]' : 'bg-blue-600'}`}>
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
    <section id="demo" className="py-24 bg-[#0000FF] text-white relative overflow-hidden">
      {/* Halos lumineux pour le dynamisme */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-400/10 blur-[100px] rounded-full -ml-24 -mb-24"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>
            Laboratoire de Vision
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">Démonstrateur Interactif</h2>
          <p className="text-blue-100/70 max-w-2xl mx-auto text-lg">Testez l'analyse en temps réel sur vos propres vidéos ou passez au mode Live Cam.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-white/10 group">
              {mode === 'camera' ? (
                <div className="absolute inset-0 z-50 bg-blue-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-[#FFB81C] rounded-[2rem] flex items-center justify-center text-white text-4xl shadow-2xl mb-8 animate-pulse">
                    <i className="fas fa-crown"></i>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-4 text-[#FFB81C]">Débloquez la Sécurité Active</h3>
                  <p className="text-blue-100 max-w-md mb-8 leading-relaxed font-medium">
                    La détection en temps réel par caméra est réservée à nos membres Premium. Anticipez les dangers sur la route avec une précision inégalée.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => {
                        const pricingSection = document.getElementById('pricing');
                        if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-[#FFB81C] text-blue-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-xl shadow-black/20"
                    >
                      Voir les Plans Premium
                    </button>
                    <button 
                      onClick={() => handleModeChange('upload')}
                      className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20"
                    >
                      Rester en mode Import
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-8">
                    <div className="flex justify-between items-start">
                        <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#FFB81C] animate-pulse' : 'bg-white/40'}`}></span>
                          <span className="text-[10px] font-mono font-bold text-[#FFB81C]">AI_CORE: ACTIVE_v3</span>
                        </div>
                        <div className="text-[10px] font-mono text-white/50">PROCESSED // 1080p</div>
                    </div>
                  </div>

                  <div className="absolute inset-0 z-0 flex items-center justify-center">
                    {mode === 'upload' && videoFileUrl && <video key={videoFileUrl} ref={uploadVideoRef} src={videoFileUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90" />}
                    {image && <img src={image} className="w-full h-full object-cover opacity-90" />}
                    {!videoFileUrl && !image && <div className="text-white text-center"><i className="fas fa-eye-slash text-6xl mb-4 opacity-20"></i><p className="font-black opacity-30 uppercase tracking-[0.3em] text-[10px]">Importez une vidéo pour tester avec DzSafeDrive</p></div>}
                  </div>

                  <div className="absolute inset-0 z-10 pointer-events-none">
                    {drawOverlays()}
                  </div>

                  {isLive && <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden"><div className="w-full h-[1px] bg-white/60 shadow-[0_0_15px_rgba(255,255,255,0.8)] absolute animate-[scan_5s_linear_infinite]"></div></div>}
                </>
              )}
            </div>

            {result?.alertNeeded && (
              <div className="mt-4 bg-red-600/90 backdrop-blur-xl border border-red-500/50 p-4 rounded-2xl flex items-center justify-between animate-pulse shadow-lg shadow-red-900/40">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-white text-xl"></i>
                  </div>
                  <div>
                    <div className="text-white font-black text-sm uppercase tracking-tighter leading-none">ALERTE CRITIQUE</div>
                    <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">Freinage immédiat requis</div>
                  </div>
                </div>
                <div className="hidden sm:block text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">DzSafeDrive Active Protection</div>
              </div>
            )}

            {result && mode === 'upload' && (
              <div className="mt-4 p-6 bg-white/10 backdrop-blur-md border-l-4 border-[#FFB81C] rounded-3xl shadow-lg flex gap-5 items-center animate-fade-in border border-white/10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${loading ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' : 'bg-white/20 text-white border-white/30'}`}>
                  <i className={`fas ${loading ? 'fa-circle-notch fa-spin' : 'fa-brain'} text-xl`}></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#FFB81C] mb-1 uppercase tracking-widest opacity-90">Diagnostic Vocal & Intelligence</p>
                  <p className="text-white leading-relaxed italic text-sm font-medium">"{result.summary}"</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-xl">
              <h3 className="text-sm font-black mb-6 flex items-center gap-2 text-white/80 uppercase tracking-widest"><i className="fas fa-sliders text-[#FFB81C]"></i> Paramètres</h3>
              <div className="flex gap-2 p-1 bg-black/20 rounded-2xl mb-6 border border-white/10">
                <button onClick={() => handleModeChange('upload')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${mode === 'upload' ? 'bg-white text-blue-900 shadow-md' : 'text-white/60 hover:text-white'}`}>IMPORT</button>
                <button onClick={() => handleModeChange('camera')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${mode === 'camera' ? 'bg-white text-blue-900 shadow-md' : 'text-white/60 hover:text-white'}`}>LIVE CAM</button>
              </div>

              {mode === 'upload' && (
                <>
                  {(videoFileUrl || image) && (
                    <button onClick={toggleLive} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isLive ? 'bg-red-600 border-transparent' : 'bg-[#FFB81C] text-blue-900 border-transparent hover:bg-yellow-400 shadow-lg shadow-black/20'}`}>
                      <i className={`fas ${isLive ? 'fa-stop-circle' : 'fa-play-circle'}`}></i> {isLive ? 'Scanner Off' : 'Lancer Scan'}
                    </button>
                  )}
                  <div onClick={() => fileInputRef.current?.click()} className="mt-4 border-2 border-dashed border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:border-[#FFB81C] hover:bg-white/5 transition-all group">
                    <i className="fas fa-cloud-arrow-up text-3xl text-white/40 group-hover:text-[#FFB81C] mb-3"></i>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white">{videoFileUrl || image ? 'Modifier' : 'Importer'}</p>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="video/*,image/*" />
                  </div>
                </>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-xl overflow-hidden">
              <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Flux d'événements</h3>
              <div className="space-y-3">
                {history.length > 0 ? history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] p-3 bg-white/5 rounded-xl border border-white/10 animate-slide-in">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${h.level === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : h.level === 'medium' ? 'bg-[#FFB81C]' : 'bg-blue-400'}`}></div>
                      <span className="font-black text-white capitalize">{h.type}</span>
                    </div>
                    <span className="text-white/40 font-mono tracking-tighter">{h.time}</span>
                  </div>
                )) : (
                  <p className="text-[10px] text-white/30 text-center italic py-4">En attente de détection...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <style>{`
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        @keyframes slide-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </section>
  );
};
