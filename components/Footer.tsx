
import React from 'react';
import { PagePath } from '../App';

interface FooterProps {
  onNavigate: (path: PagePath) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid md:grid-cols-3 gap-12 mb-16 items-start">
          <div className="flex flex-col items-center">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-6 group">
              <div className="w-12 h-12 bg-[#8B735B] rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-stone-900 tracking-tight">DzSafeDrive</span>
            </button>
            <p className="text-stone-500 max-w-xs leading-relaxed text-sm">
              Leader de la vision artificielle en Algérie. Nous sécurisons les routes algériennes en connectant l'intelligence artificielle à votre trajet quotidien depuis M'Sila.
            </p>
            <div className="mt-6 text-sm text-[#8B735B] font-bold flex items-center gap-2">
              <i className="fas fa-location-dot"></i>
              M'Sila, Algérie
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-widest border-b-2 border-amber-100 pb-1 inline-block">Navigation</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('home')} className="text-stone-500 hover:text-[#8B735B] transition-colors text-sm font-semibold">Accueil</button></li>
              <li><button onClick={() => onNavigate('features')} className="text-stone-500 hover:text-[#8B735B] transition-colors text-sm font-semibold">IA & Risques</button></li>
              <li><button onClick={() => onNavigate('about')} className="text-stone-500 hover:text-[#8B735B] transition-colors text-sm font-semibold">À Propos</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="text-stone-500 hover:text-[#8B735B] transition-colors text-sm font-semibold">Abonnements</button></li>
              <li><button onClick={() => onNavigate('demo')} className="text-stone-500 hover:text-[#8B735B] transition-colors text-sm font-semibold">Espace Démo</button></li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-widest border-b-2 border-amber-100 pb-1 inline-block">Légal</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('legal')} className="text-stone-500 hover:text-[#8B735B] transition-colors text-sm font-semibold">Mentions Légales</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="text-stone-500 hover:text-[#8B735B] transition-colors text-sm font-semibold">Politique RGPD</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stone-100 pt-10 flex flex-col items-center gap-6">
          <div className="flex gap-8">
            <a href="#" className="text-stone-300 hover:text-[#8B735B] text-2xl transition-all hover:scale-125"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="text-stone-300 hover:text-[#8B735B] text-2xl transition-all hover:scale-125"><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-stone-300 hover:text-[#8B735B] text-2xl transition-all hover:scale-125"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-stone-300 hover:text-[#8B735B] text-2xl transition-all hover:scale-125"><i className="fab fa-twitter"></i></a>
          </div>
          <p className="text-stone-400 text-sm italic font-medium">© 2024 DzSafeDrive - M'Sila. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
