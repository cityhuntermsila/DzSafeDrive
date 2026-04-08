
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ObjectDetector, FilesetResolver, Detection } from "@mediapipe/tasks-vision";
import { AnalysisResponse, HazardType, ThreatLevel, DetectionResult } from '../types';
import { PagePath } from '../App';

interface DemoSectionProps {
  onNavigate?: (path: PagePath) => void;
}

export const DemoSection: React.FC<DemoSectionProps> = ({ onNavigate }) => {
  const [mode, setMode] = useState<'camera' | 'upload'>('upload');
  const [isLive, setIsLive] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [history, setHistory] = useState<{ type: string; time: string; level: string }[]>([]);
  const [modelLoading, setModelLoading] = useState(true);
  const [isStartingUp, setIsStartingUp] = useState(false);
  
  const detectorRef = useRef<ObjectDetector | null>(null);
  const modeRef = useRef<'camera' | 'upload'>('upload');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const detector = await ObjectDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite`,
            delegate: "GPU"
          },
          scoreThreshold: 0.3,
          runningMode: "VIDEO"
        });
        detectorRef.current = detector;
        setModelLoading(false);
      } catch (err) {
        console.error("Failed to load MediaPipe model:", err);
        setError("Erreur chargement IA MediaPipe.");
        setModelLoading(false);
      }
    };
    loadModel();
    audioRef.current = new Audio('/alert.mp3');
  }, []);

  const speakSummary = async (text: string) => {
    if (!text || text === lastSpokenSummaryRef.current) return;
    lastSpokenSummaryRef.current = text;

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      }
    } catch (err) {
      console.warn("Audio Play Error:", err);
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
    if (videoRef.current && videoRef.current.srcObject) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
      mediaStream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setIsLive(false);
  }, []);

  const handleModeChange = (newMode: 'camera' | 'upload') => {
    setMode(newMode);
    modeRef.current = newMode;
    setImage(null);
    setIsVideo(false);
    setIsStartingUp(false);
    setResult(null);
    setHistory([]);
    setError(null);
    setIsLive(false);
    stopCamera();

    if (newMode === 'camera') {
      startCamera();
    }
  };

  const startCamera = async () => {
    setIsStartingUp(true);
    try {
      while (!detectorRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (modeRef.current !== 'camera') return;
      
      setIsStartingUp(false);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }, 
        audio: false 
      });
      setStream(mediaStream);
      setIsLive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }

      // Safe auto-stop after 2 minutes instead of 30s
      setTimeout(() => {
        if (modeRef.current === 'camera') {
           stopCamera();
           handleModeChange('upload');
        }
      }, 120000);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Impossible d'accéder à la caméra.");
      setIsStartingUp(false);
    }
  };

  const performAnalysis = useCallback(async (element: HTMLVideoElement | HTMLImageElement) => {
    if (isAnalysingRef.current || !detectorRef.current) return;
    
    // Check if video is actually ready
    if (element instanceof HTMLVideoElement && element.readyState < 2) return;

    isAnalysingRef.current = true;

    try {
      const startTimeMs = performance.now();
      const detections = detectorRef.current.detectForVideo(element, startTimeMs).detections;
      
      const risks: DetectionResult[] = [];
      let maxThreat = ThreatLevel.LOW as ThreatLevel;
      
      detections.forEach((d) => {
        if (!d.categories[0] || d.categories[0].score < 0.25) return;

        const category = d.categories[0].categoryName;
        const score = d.categories[0].score;
        let riskType = HazardType.OBSTACLE;
        
        const animals = ['cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'bird'];
        const vehicles = ['car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'bicycle'];

        if (category === 'person') riskType = HazardType.PERSON;
        else if (animals.includes(category)) riskType = HazardType.ANIMAL;
        else if (vehicles.includes(category)) riskType = HazardType.VEHICLE;
        else riskType = HazardType.OBSTACLE; 

        // Bounding box from MediaPipe is in pixels or proportions depending on mode
        // For detectForVideo it returns boundingBox in pixels
        const { originX, originY, width, height } = d.boundingBox!;
        const elWidth = element instanceof HTMLVideoElement ? element.videoWidth : element.naturalWidth;
        const elHeight = element instanceof HTMLVideoElement ? element.videoHeight : element.naturalHeight;

        // Convert to 0-1000 scale
        const ymin = (originY / elHeight) * 1000;
        const xmin = (originX / elWidth) * 1000;
        const ymax = ((originY + height) / elHeight) * 1000;
        const xmax = ((originX + width) / elWidth) * 1000;

        const areaPct = (width / elWidth) * (height / elHeight);
        let threat = ThreatLevel.LOW as ThreatLevel;
        if (areaPct > 0.08) {
          threat = ThreatLevel.HIGH;
        } else if (areaPct > 0.015) {
          threat = ThreatLevel.MEDIUM;
        }

        if (threat === ThreatLevel.HIGH) maxThreat = ThreatLevel.HIGH;
        else if (threat === ThreatLevel.MEDIUM && maxThreat !== ThreatLevel.HIGH) maxThreat = ThreatLevel.MEDIUM;

        const translations: Record<string, string> = {
          'person': 'Personne',
          'car': 'Véhicule',
          'truck': 'Véhicule',
          'bus': 'Véhicule',
          'motorcycle': 'Véhicule',
          'bicycle': 'Véhicule',
          'dog': 'Animal',
          'cat': 'Animal',
          'cow': 'Animal',
          'horse': 'Animal',
          'sheep': 'Animal',
          'bird': 'Animal'
        };

        let displayDescription = translations[category];
        if (!displayDescription) {
          displayDescription = riskType === HazardType.OBSTACLE ? 'Obstacle' : category;
        }

        risks.push({
          type: riskType,
          confidence: score,
          box: [ymin, xmin, ymax, xmax],
          threatLevel: threat,
          description: displayDescription
        });
      });

      const analysis: AnalysisResponse = {
        risks,
        summary: risks.length > 0 ? `${risks.length} objet(s) détecté(s)` : "Voie libre",
        alertNeeded: risks.length > 0
      };

      setResult(analysis);

      if (risks.length > 0) {
        const newHistory = risks.map(r => ({
          type: r.type,
          level: r.threatLevel,
          time: new Date().toLocaleTimeString('fr-FR', { hour12: false })
        }));
        setHistory(prev => [...newHistory, ...prev].slice(0, 5));

        // Play high alert if ANY high threat, else medium for any risk
        if (maxThreat === ThreatLevel.HIGH) {
          playAlert(ThreatLevel.HIGH);
          speakSummary("Attention, danger immédiat détecté");
        } else {
          playAlert(ThreatLevel.MEDIUM);
          // Only speak for medium risks if there's something significant
          if (risks.some(r => r.threatLevel === ThreatLevel.MEDIUM)) {
            speakSummary("Alerte, obstacle sur la route");
          }
        }
      }
    } catch (err) {
      console.error("MediaPipe Detection Error:", err);
    } finally {
      isAnalysingRef.current = false;
    }
  }, [playAlert]);

  useEffect(() => {
    let animationId: number;
    let lastTime = 0;

    const loop = async (time: number) => {
      if (isLive || isVideo) {
        // Limit to ~15-20 FPS to save battery but stay smooth
        if (time - lastTime > 60) {
          const element = videoRef.current;
          if (element) {
            await performAnalysis(element);
          }
          lastTime = time;
        }
        animationId = requestAnimationFrame(loop);
      }
    };

    if (isLive || isVideo) {
      animationId = requestAnimationFrame(loop);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isLive, isVideo, performAnalysis]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      initAudio();
      setResult(null);
      setImage(null);
      setIsVideo(false);
      setHistory([]);
      setIsLive(false);
      
      if (file.type.startsWith('video/')) {
        const objectUrl = URL.createObjectURL(file);
        setIsStartingUp(true);
        const start = async () => {
          while (!detectorRef.current) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          setIsStartingUp(false);
          setImage(objectUrl);
          setIsVideo(true);
        };
        start();
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setIsVideo(false);
          setImage(base64);
          
          setTimeout(() => {
              const imgEl = document.getElementById('staticImageObj') as HTMLImageElement;
              if (imgEl) {
                  if (imgEl.complete) performAnalysis(imgEl);
                  else imgEl.onload = () => performAnalysis(imgEl);
              }
          }, 100);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Format non supporté.");
      }
    }
  };

  const drawOverlays = () => {
    if (!result || mode === 'camera') return null;
    return result.risks.map((risk, index) => {
      const [ymin, xmin, ymax, xmax] = risk.box;
      const style: React.CSSProperties = {
        top: `${ymin / 10}%`,
        left: `${xmin / 10}%`,
        width: `${(xmax - xmin) / 10}%`,
        height: `${(ymax - ymin) / 10}%`,
      };
      return (
        <div
          key={index}
          className={`absolute pointer-events-none transition-all duration-[200ms] ease-out ${risk.threatLevel === ThreatLevel.HIGH ? 'animate-pulse' : ''}`}
          style={style}
        >
          <div className={`absolute top-0 left-0 -translate-y-full px-2 py-0.5 text-[8px] font-black text-white uppercase rounded-t-md flex items-center gap-1 shadow-lg ${risk.threatLevel === ThreatLevel.HIGH ? 'bg-red-600' : risk.threatLevel === ThreatLevel.MEDIUM ? 'bg-amber-500' : 'bg-slate-600'}`}>
            <i className={`fas ${risk.type === 'person' ? 'fa-person' : risk.type === 'animal' ? 'fa-paw' : risk.type === 'vehicle' ? 'fa-car' : 'fa-triangle-exclamation'}`}></i>
            <span className="tracking-wider">{risk.description}</span>
          </div>
        </div>
      );
    });
  };


  const examples = [
    { url: '/images/vache.jpg', label: 'Vache 1' },
    { url: '/images/vache2.jpg', label: 'Vache 2' },
    { url: '/images/mouton.png', label: 'Mouton 1' },
    { url: '/images/mouton2.png', label: 'Mouton 2' },
    { url: '/images/chameau.png', label: 'Chameau 1' },
    { url: '/images/chameau2.png', label: 'Chameau 2' },
  ];

  const handleExampleClick = (url: string) => {
    initAudio();
    setResult(null);
    setHistory([]);
    setIsVideo(false);
    setIsLive(false);
    setImage(url);
    if (mode !== 'upload') {
      setMode('upload');
      modeRef.current = 'upload';
    }
    
    setTimeout(() => {
      const imgEl = document.getElementById('staticImageObj') as HTMLImageElement;
      if (imgEl) {
        if (imgEl.complete) performAnalysis(imgEl);
        else imgEl.onload = () => performAnalysis(imgEl);
      }
    }, 150);
  };

  return (
    <section id="demo" className="pt-4 pb-10 bg-[#0F172A] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[8px] font-black mb-1.5 uppercase tracking-[0.2em]">
            <span className={`relative flex h-1 w-1 ${modelLoading ? '' : 'animate-ping inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75'}`}>
              <span className={`relative inline-flex rounded-full h-1 w-1 ${modelLoading ? 'bg-yellow-400' : 'bg-[#3B82F6]'}`}></span>
            </span>
            {modelLoading ? 'Initialisation MediaPipe...' : 'Analyseur de Vision IA'}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1 leading-tight">Vision Artificielle Temps Réel</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">Système optimisé pour une détection fluide des obstacles et animaux.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-3 order-1 lg:order-2 flex flex-col items-center">
            <div className="w-full lg:w-[85%] mx-auto relative aspect-video bg-black rounded-[1.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
              {isStartingUp && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 bg-[#0F172A]/90 backdrop-blur-sm">
                   <div className="relative mb-4">
                     <i className="fas fa-microchip text-4xl text-[#3B82F6] relative z-10"></i>
                     <div className="absolute inset-0 bg-[#3B82F6] blur-xl opacity-50 animate-pulse"></div>
                   </div>
                   <p className="font-black tracking-[0.2em] uppercase text-xs text-white animate-pulse">Activation du flux</p>
                </div>
              )}
              {mode === 'camera' ? (
                <>
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                  {isLive && (
                     <div className="absolute top-4 right-4 bg-red-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse border border-red-500 z-50 shadow-lg flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                        DIRECT
                     </div>
                  )}
                  <div className="absolute inset-0 z-10 pointer-events-none">{drawOverlays()}</div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 z-0 flex items-center justify-center">
                    {image ? (
                      isVideo ? (
                        <video ref={videoRef} src={image} controls autoPlay loop muted crossOrigin="anonymous" className="w-full h-full object-contain bg-black" />
                      ) : (
                        <img id="staticImageObj" src={image} className="w-full h-full object-cover opacity-90" alt="Analysis source" />
                      )
                    ) : (
                      <div className="text-white text-center opacity-20">
                        <i className="fas fa-eye-slash text-4xl mb-2"></i>
                        <p className="font-black uppercase tracking-widest text-[8px]">Sélectionnez un média</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 z-10 pointer-events-none">{drawOverlays()}</div>
                </>
              )}
            </div>

            {result && (
              <div className={`w-full lg:w-[85%] mt-4 p-4 backdrop-blur-md rounded-xl border flex gap-4 items-center animate-fade-in shadow-xl mx-auto transition-colors duration-500 ${result.alertNeeded ? 'bg-red-900/40 border-red-500/50 animate-pulse' : 'bg-white/5 border-white/10'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${result.alertNeeded ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-blue-500/20 text-blue-400 border-blue-500/20'}`}>
                  <i className={`fas ${result.alertNeeded ? 'fa-exclamation-triangle' : 'fa-check-circle'} text-base`}></i>
                </div>
                <div>
                  <p className={`text-[9px] font-black mb-0.5 uppercase tracking-widest opacity-90 ${result.alertNeeded ? 'text-red-400' : 'text-blue-400'}`}>
                    {result.alertNeeded ? 'ALERTE DE SÉCURITÉ' : 'Analyse du flux'}
                  </p>
                  <p className="leading-relaxed text-[12px] font-bold text-white tracking-wide">{result.summary}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl">
              <h3 className="text-[8px] font-black mb-4 text-slate-500 uppercase tracking-widest">Contrôles</h3>
              <div className="flex gap-2 p-1 bg-black/40 rounded-lg mb-4">
                <button onClick={() => handleModeChange('upload')} className={`flex-1 py-1.5 rounded text-[8px] font-black transition-all uppercase tracking-widest ${mode === 'upload' ? 'bg-[#3B82F6] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>IMPORT</button>
                <button onClick={() => handleModeChange('camera')} className={`flex-1 py-1.5 rounded text-[8px] font-black transition-all uppercase tracking-widest ${mode === 'camera' ? 'bg-[#3B82F6] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>LIVE</button>
              </div>

              {mode === 'upload' && (
                <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-white/10 rounded-lg p-5 text-center cursor-pointer hover:border-[#3B82F6] transition-all group hover:bg-white/5">
                  <i className="fas fa-cloud-upload-alt text-xl text-slate-600 group-hover:text-[#3B82F6] mb-2"></i>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                    {image ? 'Changer de fichier' : 'Déposer une image ou vidéo'}
                  </p>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl">
              <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Exemples rapides</h3>
              <div className="grid grid-cols-2 gap-2">
                {examples.map((ex, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleExampleClick(ex.url)}
                    className="relative aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-[#3B82F6] transition-all group"
                  >
                    <img src={ex.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={ex.label} />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[6px] font-bold text-white uppercase">{ex.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl max-h-[150px] overflow-hidden">
              <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Historique</h3>
              <div className="space-y-2">
                {history.length > 0 ? history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-[8px] p-2.5 bg-white/5 rounded-lg border border-white/5 animate-slide-in">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${h.level === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500'}`}></div>
                      <span className="font-bold text-white capitalize tracking-wide">{h.type}</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[7px]">{h.time}</span>
                  </div>
                )) : (
                  <div className="flex flex-col items-center py-4 opacity-30">
                     <p className="text-[8px] text-center italic">Surveillance active...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};
