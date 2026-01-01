import React, { useState } from 'react';
import { PagePath } from '../App';

interface NavbarProps {
  currentPath: PagePath;
  onNavigate: (path: PagePath) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: { name: string; path: PagePath }[] = [
    { name: 'Fonctionnalités', path: 'features' },
    { name: 'Démo Live', path: 'demo' },
    { name: 'À Propos', path: 'about' },
    { name: 'Abonnements', path: 'pricing' },
    { name: 'Contact', path: 'contact' },
  ];

  const handleLinkClick = (path: PagePath) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => handleLinkClick('home')} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#004A99] to-[#003366] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-all">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#004A99] via-[#003366] to-[#FFB81C]">
                DzSafeDrive
              </span>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button 
                key={link.path}
                onClick={() => handleLinkClick(link.path)} 
                className={`text-sm font-semibold transition-all relative py-1 ${
                  currentPath === link.path ? 'text-[#004A99]' : 'text-slate-500 hover:text-[#004A99]'
                }`}
              >
                {link.name}
                {currentPath === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#004A99] to-[#FFB81C] rounded-full"></span>
                )}
              </button>
            ))}
            <button 
              onClick={() => handleLinkClick('demo')}
              className="bg-[#004A99] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#003366] transition-all shadow-md hover:shadow-[#004A99]/20 active:scale-95"
            >
              Essai Gratuit
            </button>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-white border-b border-slate-200 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleLinkClick(link.path)}
              className={`block w-full text-left px-3 py-4 text-base font-bold rounded-xl transition-all ${
                currentPath === link.path ? 'text-[#004A99] bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </button>
          ))}
          <div className="pt-4">
            <button
              onClick={() => handleLinkClick('demo')}
              className="block w-full bg-gradient-to-r from-[#004A99] to-[#FFB81C] text-white text-center py-4 rounded-xl font-bold shadow-lg"
            >
              Commencer l'essai
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};