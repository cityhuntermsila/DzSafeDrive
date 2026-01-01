
import React from 'react';
import { PagePath } from '../App';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (path: PagePath) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0F172A] pt-10 md:pt-16 pb-6 md:pb-10 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-6 md:gap-10 mb-8 md:mb-14 items-start text-center md:text-left">
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <button onClick={() => onNavigate('home')} className="mb-3 md:mb-4 hover:opacity-90 transition-opacity">
              <Logo className="scale-90 origin-center md:origin-left" />
            </button>
            <p className="text-slate-400 leading-tight text-[11px] max-w-xs font-medium italic mb-2 md:mb-3">
              "Conduisez tranquille, on veille sur vous."
            </p>
            <p className="text-slate-500 text-[8px] uppercase tracking-widest">
              Pionnier de la vision artificielle en Algérie.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 md:mb-4">Navigation</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li><button onClick={() => onNavigate('home')} className="text-slate-400 hover:text-[#DC2626] transition-colors text-[9px] font-bold uppercase tracking-widest">Accueil</button></li>
              <li><button onClick={() => onNavigate('demo')} className="text-slate-400 hover:text-[#DC2626] transition-colors text-[9px] font-bold uppercase tracking-widest">Démo Live</button></li>
              <li><button onClick={() => onNavigate('faq')} className="text-slate-400 hover:text-[#DC2626] transition-colors text-[9px] font-bold uppercase tracking-widest">FAQ</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="text-slate-400 hover:text-[#DC2626] transition-colors text-[9px] font-bold uppercase tracking-widest">Abonnements</button></li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 md:mb-4">Informations</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li><button onClick={() => onNavigate('about')} className="text-slate-400 hover:text-[#DC2626] transition-colors text-[9px] font-bold uppercase tracking-widest">À propos</button></li>
              <li><button onClick={() => onNavigate('contact')} className="text-slate-400 hover:text-[#DC2626] transition-colors text-[9px] font-bold uppercase tracking-widest">Contact</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="text-slate-400 hover:text-[#DC2626] transition-colors text-[9px] font-bold uppercase tracking-widest">Confidentialité</button></li>
              <li><button onClick={() => onNavigate('legal')} className="text-slate-400 hover:text-[#DC2626] transition-colors text-[9px] font-bold uppercase tracking-widest">Légal</button></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 md:mb-4">Social</h4>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#DC2626] hover:border-[#DC2626] transition-all"><i className="fab fa-linkedin-in text-xs"></i></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#DC2626] hover:border-[#DC2626] transition-all"><i className="fab fa-twitter text-xs"></i></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">© 2024 DzSafeDrive. Sécurité Routière IA.</p>
          <div className="flex gap-4 md:gap-6">
            <button onClick={() => onNavigate('legal')} className="text-slate-500 hover:text-white text-[8px] font-black uppercase tracking-widest transition-all">Mentions Légales</button>
            <button onClick={() => onNavigate('privacy')} className="text-slate-500 hover:text-white text-[8px] font-black uppercase tracking-widest transition-all">Confidentialité</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
