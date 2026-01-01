
import React from 'react';
import { PagePath } from '../App';

export const Hero: React.FC<{ onNavigate: (path: PagePath) => void }> = ({ onNavigate }) => {
  return (
    <div className="relative pt-20 pb-10 lg:pt-28 lg:pb-14 overflow-hidden bg-[#0F172A]">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14">

          {/* Texte centré dans sa colonne */}
          <div className="lg:w-1/2 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-red-600/10 border border-red-600/20 text-[#DC2626] text-[9px] font-black uppercase tracking-[0.25em]">
              <span className="w-1 h-1 bg-[#DC2626] rounded-full animate-pulse"></span>
              L'Innovation au service de votre sécurité
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white mb-5 leading-[1.1]">
              Conduisez tranquille,<br />
              <span className="text-[#DC2626]">on veille sur vous.</span>
            </h1>

            <p className="max-w-lg text-lg text-slate-300 mb-8 leading-relaxed font-bold italic border-l-4 lg:border-l-4 border-[#DC2626] lg:pl-6 py-2 bg-white/5 rounded-r-xl px-4 lg:px-0 lg:pr-4">
              Notre mission, anticipez le danger pour vous.
            </p>

            <p className="max-w-lg text-sm text-slate-400 mb-8 leading-relaxed font-medium">
              DzSafeDrive transforme votre véhicule en une forteresse de sérénité grâce à la vision artificielle haute performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center mb-10 w-full justify-center">
              <button
                onClick={() => onNavigate('demo')}
                className="w-[80%] sm:w-auto bg-[#DC2626] text-white px-7 py-3 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-[#B91C1C] transition-all shadow-xl shadow-red-600/20 active:scale-95"
              >
                Découvrir la démo
              </button>
              <button
                onClick={() => onNavigate('privacy')}
                className="w-[80%] sm:w-auto bg-[#1E293B] backdrop-blur-md text-white border border-white/10 px-7 py-3 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
              >
                Nos Engagements
              </button>
            </div>

            {/* Statistiques clés centrées */}
            <div className="grid grid-cols-2 gap-5 max-w-sm w-full mx-auto">
              <div className="text-center">
                <div className="text-lg font-black text-white mb-0.5">99.2%</div>
                <div className="text-[6px] text-slate-500 font-black uppercase tracking-[0.15em]">Fiabilité</div>
              </div>
              <div className="text-center border-l border-white/5">
                <div className="text-lg font-black text-[#DC2626] mb-0.5">-85%</div>
                <div className="text-[6px] text-slate-500 font-black uppercase tracking-[0.15em]">Risques Collision</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-white mb-0.5">&lt; 0.1s</div>
                <div className="text-[6px] text-slate-500 font-black uppercase tracking-[0.15em]">Réaction</div>
              </div>
              <div className="text-center border-l border-white/5">
                <div className="text-lg font-black text-[#2563EB] mb-0.5">24/7</div>
                <div className="text-[6px] text-slate-500 font-black uppercase tracking-[0.15em]">Vigilance</div>
              </div>
            </div>
          </div>

          {/* Photo de la route - Réduite de 30% sur mobile */}
          <div className="lg:w-1/2 w-full relative flex justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-blue-600/20 rounded-[1.8rem] blur-2xl opacity-20"></div>
            <div className="relative rounded-[1.8rem] overflow-hidden border border-white/10 shadow-2xl bg-black group aspect-square mx-auto w-[70%] lg:w-full max-w-[360px]">
              <img
                src="/images/hero-bg.jpg"
                alt="Vue route vision IA"
                className="w-full h-full object-cover transition-all duration-1000 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-red-900/10"></div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute top-[35%] left-[20%] w-12 h-12 border-l-2 border-t-2 border-[#DC2626] rounded-tl-lg opacity-60"></div>
                <div className="absolute bottom-[35%] right-[20%] w-10 h-10 border-r-2 border-b-2 border-[#DC2626] rounded-br-lg opacity-60"></div>

                <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-2xl">
                  <div className="w-1 h-1 rounded-full bg-[#DC2626] animate-pulse"></div>
                  <span className="text-[6px] font-black text-white uppercase tracking-[0.15em]">Scan 99%</span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-white p-2 lg:p-3 rounded-[0.8rem] lg:rounded-[1rem] shadow-2xl border border-white max-w-[100px] lg:max-w-[140px] text-left animate-float pointer-events-none">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1 h-1 rounded-full bg-[#DC2626] animate-pulse"></div>
                  <span className="text-[5px] lg:text-[6px] font-black text-[#64748B] uppercase tracking-[0.1em]">Assistant IA</span>
                </div>
                <p className="text-[7px] lg:text-[9px] font-bold text-[#0F172A] leading-[1.2]">
                  Obstacle anticipé.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-4px) translateX(-1.5px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
