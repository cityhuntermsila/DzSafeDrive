import React from 'react';
import { PagePath } from '../App';

export const Hero: React.FC<{ onNavigate: (path: PagePath) => void }> = ({ onNavigate }) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0000FF]">
      {/* Halos de couleurs complémentaires */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[10%] w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-yellow-400 rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute top-[40%] left-[30%] w-72 h-72 bg-white rounded-full blur-[100px] opacity-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-[0.2em] border border-white/20">
          Technologie Vision AI v3.0
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          La Vision Artificielle au Service de <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-[#FFB81C]">
            Votre Sécurité Routière
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100 mb-10 leading-relaxed">
          Anticipez l'imprévisible. Notre IA détecte piétons et obstacles en temps réel pour une sérénité totale au volant.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => onNavigate('demo')}
            className="bg-white text-blue-800 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 group"
          >
            <i className="fas fa-play-circle text-xl group-hover:scale-110 transition-transform"></i> Essayer la Démo
          </button>
          <button 
            onClick={() => onNavigate('contact')}
            className="bg-blue-700/80 backdrop-blur-sm text-white border border-white/20 px-10 py-4 rounded-2xl font-bold text-lg hover:border-[#FFB81C] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Contacter un Expert
          </button>
        </div>
        
        <div className="mt-20 relative max-w-5xl mx-auto group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0000FF] via-transparent to-transparent z-10"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-[#FFB81C] to-blue-400 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069" 
            alt="AI Dashboard" 
            className="relative z-0 rounded-[2rem] shadow-2xl border-4 border-white/20 group-hover:grayscale-0 transition-all duration-1000 w-full"
          />
          <div className="absolute -bottom-6 -right-6 hidden lg:block bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-xs text-left animate-bounce z-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFB81C] animate-pulse"></div>
              <span className="text-[10px] font-black text-[#FFB81C] uppercase tracking-widest">Diagnostic IA</span>
            </div>
            <p className="text-sm font-bold text-slate-800 italic leading-snug">"Piéton détecté à 15m. Ralentissement conseillé."</p>
          </div>
        </div>
      </div>
    </div>
  );
};