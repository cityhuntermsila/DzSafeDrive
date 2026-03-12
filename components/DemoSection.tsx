
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
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
  const modelRef = useRef<tf.GraphModel | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const loadedModel = await tf.loadGraphModel('./yolov8n_web_model/model.json');
        modelRef.current = loadedModel;
        setModelLoading(false);
      } catch (err) {
        console.error("Failed to load YOLOv8 model:", err);
        setError("Erreur chargement IA YOLO local.");
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
    if (analysisIntervalRef.current) {
      window.clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  }, []);

  const handleModeChange = (newMode: 'camera' | 'upload') => {
    setMode(newMode);
    setImage(null);
    setIsVideo(false);
    setResult(null);
    setHistory([]);
    setError(null);
    setIsLive(false);
    if (analysisIntervalRef.current) {
      window.clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    stopCamera();

    if (newMode === 'camera') {
      startCamera();
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      setIsLive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setTimeout(() => {
        stopCamera();
        handleModeChange('upload');
      }, 30000);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Impossible d'accéder à la caméra.");
    }
  };


  /**
   * Preprocess a video/image frame with contrast, brightness, and sharpening
   * boosts before passing it to the YOLO model.
   * This improves detection quality on low-quality or dark footage.
   */
  const preprocessWithCanvas = useCallback((source: HTMLVideoElement | HTMLImageElement): HTMLCanvasElement => {
    const srcW = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
    const srcH = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
    const w = srcW || 640;
    const h = srcH || 640;

    // Step 1 — Draw with CSS filters (contrast + brightness + saturation)
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = w;
    tmpCanvas.height = h;
    const tmpCtx = tmpCanvas.getContext('2d')!;
    tmpCtx.filter = 'contrast(1.35) brightness(1.15) saturate(1.2)';
    tmpCtx.drawImage(source, 0, 0, w, h);

    // Step 2 — Apply a software sharpen convolution (unsharp-mask style)
    const outCanvas = document.createElement('canvas');
    outCanvas.width = w;
    outCanvas.height = h;
    const outCtx = outCanvas.getContext('2d')!;

    const imgData = tmpCtx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const result = new Uint8ClampedArray(data.length);

    // Sharpen kernel: emphasises centre pixel, subtracts neighbours
    const kernel = [
       0, -1,  0,
      -1,  5, -1,
       0, -1,  0,
    ];

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) {
          let val = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const ki = (ky + 1) * 3 + (kx + 1);
              const si = ((y + ky) * w + (x + kx)) * 4 + c;
              val += data[si] * kernel[ki];
            }
          }
          result[idx + c] = Math.min(255, Math.max(0, val));
        }
        result[idx + 3] = data[idx + 3]; // alpha unchanged
      }
    }
    outCtx.putImageData(new ImageData(result, w, h), 0, 0);
    return outCanvas;
  }, []);

  const performAnalysis = useCallback(async (videoElement: HTMLVideoElement | HTMLImageElement) => {
    if (isAnalysingRef.current || !modelRef.current) return;
    isAnalysingRef.current = true;

    try {
      // Preprocess for low-quality footage before YOLO inference
      const processedCanvas = preprocessWithCanvas(videoElement);

      const tensor = tf.browser.fromPixels(processedCanvas)
        .resizeBilinear([640, 640]) // YOLOv8 standard input size
        .div(255.0)                 // Normalize input
        .expandDims(0);             // Add batch dimension
        
      const predictions = await modelRef.current.executeAsync(tensor) as tf.Tensor;
      
      // YOLOv8 output tensor shape is usually [1, 84, 8400]
      // 84 components -> 4 bounding box coords (xc, yc, w, h) + 80 class scores
      // 8400 -> Number of predicted boxes
      const transRes = predictions.transpose([0, 2, 1]); // Shape [1, 8400, 84]
      const [boxesTensor, scoresTensor] = tf.split(transRes, [4, 80], 2);
      
      const boxes = boxesTensor.squeeze(); // [8400, 4]
      const scores = scoresTensor.squeeze(); // [8400, 80]
      
      // Get the max class probability for each box
      const maxScores = scores.max(1);
      const classes = scores.argMax(1);
      
      // Apply Non-Maximum Suppression — lower score threshold (0.18) to catch
      // objects that appear blurry or partially obscured in degraded footage
      const nmsIndices = await tf.image.nonMaxSuppressionAsync(
          boxes as tf.Tensor2D,
          maxScores as tf.Tensor1D,
          50, // max boxes
          0.45, // iou threshold
          0.18  // score threshold (lowered from 0.3 for low-quality video)
      );
      
      const boxesArr = await boxes.array() as number[][];
      const scoresArr = await maxScores.array() as number[];
      const classesArr = await classes.array() as number[];
      const indicesArr = await nmsIndices.array() as number[];
      
      tensor.dispose();
      predictions.dispose();
      transRes.dispose();
      boxesTensor.dispose();
      scoresTensor.dispose();
      maxScores.dispose();
      classes.dispose();
      nmsIndices.dispose();
      
      const risks: DetectionResult[] = [];
      let maxThreat: ThreatLevel = ThreatLevel.LOW;
      
      indicesArr.forEach(i => {
        const score = scoresArr[i];
        const classId = classesArr[i];
        
        let riskType = HazardType.OBSTACLE;
        let className = 'obstacle';
        
        // COCO Mapping for relevant objects (0=person, 1=bicycle, 2=car, 3=motorcycle, 5=bus, 7=truck, 15=cat, 16=dog, 17=horse, 18=sheep, 19=cow)
        if (classId === 0) { riskType = HazardType.PERSON; className = 'person'; }
        else if (classId >= 15 && classId <= 24) { riskType = HazardType.ANIMAL; className = 'animal'; }
        else if ([1, 2, 3, 5, 7].includes(classId)) { riskType = HazardType.VEHICLE; className = 'vehicle'; }
        else return; // Ignore irrelevant detections

        // YOLOv8 box format relative to 640x640 input: [x_center, y_center, width, height]
        const [xc, yc, w, h] = boxesArr[i];
        
        // Convert to percentage (0 - 1000) for UI mapping
        const ymin = Math.max(0, ((yc - h / 2) / 640) * 1000);
        const xmin = Math.max(0, ((xc - w / 2) / 640) * 1000);
        const ymax = Math.min(1000, ((yc + h / 2) / 640) * 1000);
        const xmax = Math.min(1000, ((xc + w / 2) / 640) * 1000);

        // Calculated size impact vs screen
        const areaPct = (h / 640) * (w / 640);
        let threat: ThreatLevel = ThreatLevel.LOW;
        if (areaPct > 0.15) threat = ThreatLevel.HIGH;
        else if (areaPct > 0.04) threat = ThreatLevel.MEDIUM;

        // Discard low threat vehicles on edges as per initial logic
        if (riskType === HazardType.VEHICLE && threat === ThreatLevel.LOW && (xmin < 250 || xmax > 750)) {
            return; 
        }

        if (threat === ThreatLevel.HIGH) maxThreat = ThreatLevel.HIGH as ThreatLevel;
        else if (threat === ThreatLevel.MEDIUM && maxThreat !== ThreatLevel.HIGH) maxThreat = ThreatLevel.MEDIUM as ThreatLevel;

        risks.push({
          type: riskType,
          confidence: score,
          box: [ymin, xmin, ymax, xmax],
          threatLevel: threat,
          description: className
        });
      });

      const analysis: AnalysisResponse = {
        risks,
        summary: risks.length > 0 ? `${risks.length} objet(s) détecté(s)` : "Voie libre",
        alertNeeded: (maxThreat as string) === (ThreatLevel.HIGH as string) && risks.some(r => r.type === HazardType.PERSON || r.type === HazardType.ANIMAL || r.type === HazardType.VEHICLE)
      };

      setResult(analysis);

      if (analysis.risks.length > 0) {
        const newHistory = analysis.risks.map(r => ({
          type: r.type,
          level: r.threatLevel,
          time: new Date().toLocaleTimeString('fr-FR', { hour12: false })
        }));
        if (newHistory.length > 0) {
            setHistory(prev => [...newHistory, ...prev].slice(0, 5));
        }

        if (maxThreat !== ThreatLevel.LOW) playAlert(maxThreat);
        if (analysis.alertNeeded) speakSummary("Alerte, faites attention");
      }
    } catch (err) {
      console.error("TFJS Detection Error:", err);
    } finally {
      // setLoading(false);
      isAnalysingRef.current = false;
    }
  }, [playAlert]);

  const toggleLive = () => {
    // Only used for Camera mode (Premium)
    if (mode === 'camera') return;
    initAudio();
    // Reset states if needed
    setResult(null);
    setHistory([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      initAudio();
      setResult(null);
      setImage(null);
      setIsVideo(false);
      setHistory([]);
      setIsLive(false);
      if (analysisIntervalRef.current) {
        window.clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
      
      if (file.type.startsWith('video/')) {
        const objectUrl = URL.createObjectURL(file);
        setImage(objectUrl);
        setIsVideo(true);
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setIsVideo(false);
          setImage(base64);
          
          // Allow React to re-render the <img> element, then wait for its content to load before analyzing
          setTimeout(() => {
              const imgEl = document.getElementById('staticImageObj') as HTMLImageElement;
              if (imgEl) {
                  // To be completely safe, we only analyze when the image is fully decoded
                  if (imgEl.complete) {
                      performAnalysis(imgEl);
                  } else {
                      imgEl.onload = () => performAnalysis(imgEl);
                  }
              }
          }, 50);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Seuls les images et vidéos sont acceptés.");
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
          className={`absolute pointer-events-none transition-all duration-[300ms] ease-out ${risk.threatLevel === ThreatLevel.HIGH ? 'animate-pulse' : ''}`}
          style={style}
        >
          <div className={`absolute top-0 left-0 -translate-y-full px-2.5 py-1 text-[9px] font-black text-white uppercase rounded-t-md flex items-center gap-1.5 shadow-lg ${risk.threatLevel === ThreatLevel.HIGH ? 'bg-[#DC2626]' : risk.threatLevel === ThreatLevel.MEDIUM ? 'bg-[#F59E0B]' : 'bg-slate-600'}`}>
            <i className={`fas ${risk.type === 'person' ? 'fa-person' : risk.type === 'animal' ? 'fa-paw' : risk.type === 'vehicle' ? 'fa-car' : 'fa-triangle-exclamation'}`}></i>
            <span className="tracking-wider">{risk.type}</span>
            {risk.threatLevel === ThreatLevel.HIGH && <i className="fas fa-exclamation-circle ml-1 animate-ping"></i>}
          </div>
        </div>
      );
    });
  };

  const captureAndAnalyze = useCallback(() => {
    if (isAnalysingRef.current || !videoRef.current) return;
    const video = videoRef.current;
    if (video.readyState < 2) return;
    
    performAnalysis(video);
  }, [performAnalysis]);

  useEffect(() => {
    if (isLive || isVideo) {
      const timer = setTimeout(() => captureAndAnalyze(), 50);
      const intervalId = window.setInterval(() => {
        captureAndAnalyze();
      }, 100); // Détection en quasi temps-réel, le goulot d'étranglement sera la réponse réseau de l'IA (env. 500ms-1s).
      analysisIntervalRef.current = intervalId;
      return () => {
        clearTimeout(timer);
        window.clearInterval(intervalId);
        analysisIntervalRef.current = null;
      };
    }
  }, [isLive, isVideo, captureAndAnalyze]);

  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) window.clearInterval(analysisIntervalRef.current);
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <section id="demo" className="pt-4 pb-10 bg-[#0F172A] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[8px] font-black mb-1.5 uppercase tracking-[0.2em]">
            <span className={`relative flex h-1 w-1 ${modelLoading ? '' : 'animate-ping inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75'}`}>
              <span className={`relative inline-flex rounded-full h-1 w-1 ${modelLoading ? 'bg-yellow-400' : 'bg-[#DC2626]'}`}></span>
            </span>
            {modelLoading ? 'Chargement IA (YOLOv8)...' : 'Laboratoire de Vision IA (YOLOv8)'}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1 leading-tight">Démonstrateur Interactif</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">Analysez vos flux en temps réel avec la puissance de l'IA.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-3 order-1 lg:order-2 flex flex-col items-center">
            {/* Zone d'affichage réduite de 20% (max-w-[80%] sur desktop) */}
            <div className="w-full lg:w-[80%] mx-auto relative aspect-video bg-black rounded-[1.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group">
              {mode === 'camera' ? (
                <>
                  <video ref={videoRef} className="w-full h-full object-cover opacity-80" autoPlay playsInline muted />
                  {!isLive && (
                     <div className="absolute inset-0 flex items-center justify-center text-white">
                        <i className="fas fa-spinner fa-spin text-4xl"></i>
                     </div>
                  )}
                  {isLive && (
                     <div className="absolute top-4 right-4 bg-red-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse border border-red-500 z-50 shadow-lg flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                        LIVE (30s)
                     </div>
                  )}
                  <div className="absolute inset-0 z-10 pointer-events-none">{drawOverlays()}</div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 z-0 flex items-center justify-center">
                    {image && (
                      isVideo ? (
                        <video ref={videoRef} src={image} controls autoPlay loop muted crossOrigin="anonymous" className="w-full h-full object-contain bg-black" />
                      ) : (
                        <img id="staticImageObj" src={image} className="w-full h-full object-cover opacity-80" />
                      )
                    )}
                    {!image && <div className="text-white text-center opacity-20"><i className="fas fa-eye-slash text-4xl mb-2"></i><p className="font-black uppercase tracking-widest text-[8px]">Importez une photo ou vidéo</p></div>}
                  </div>
                  <div className="absolute inset-0 z-10 pointer-events-none">{drawOverlays()}</div>
                </>
              )}
            </div>

            {result && (
              <div className={`w-full lg:w-[80%] mt-4 p-4 backdrop-blur-md rounded-xl border flex gap-4 items-center animate-fade-in shadow-xl mx-auto transition-colors duration-500 ${result.alertNeeded ? 'bg-red-900/60 border-red-500/80 animate-pulse' : 'bg-white/5 border-white/10'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${loading ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/30' : result.alertNeeded ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/20'}`}>
                  <i className={`fas ${loading ? 'fa-circle-notch fa-spin' : result.alertNeeded ? 'fa-exclamation-triangle' : 'fa-brain'} text-base`}></i>
                </div>
                <div>
                  <p className={`text-[9px] font-black mb-0.5 uppercase tracking-widest opacity-90 ${result.alertNeeded ? 'text-red-400' : 'text-[#DC2626]'}`}>
                    {result.alertNeeded ? '⚠️ ALERTE DÉTECTION IMMÉDIATE' : 'Assistant Vocal SafeDrive'}
                  </p>
                  <p className={`leading-relaxed italic text-[12px] font-bold ${result.alertNeeded ? 'text-white' : 'text-slate-200'}`}>"{result.summary}"</p>
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
                  <div onClick={() => {
                      // Reset everything immediately when user wants to load a new file
                      setResult(null);
                      setImage(null);
                      setIsVideo(false);
                      setHistory([]);
                      setError(null);
                      isAnalysingRef.current = false;
                      if (analysisIntervalRef.current) {
                        window.clearInterval(analysisIntervalRef.current);
                        analysisIntervalRef.current = null;
                      }
                      // Reset the input value so the same file can be re-selected
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      fileInputRef.current?.click();
                    }} className="border border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-[#DC2626] transition-all group">
                    <i className="fas fa-image text-lg text-slate-600 group-hover:text-[#DC2626] mb-1.5"></i>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{image ? 'Remplacer' : 'Charger Photo/Vidéo'}</p>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
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
