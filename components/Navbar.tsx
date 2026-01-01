
import React, { useState } from 'react';
import { PagePath } from '../App';
import { Logo } from './Logo';

interface NavbarProps {
  currentPath: PagePath;
  onNavigate: (path: PagePath) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: { name: string; path: PagePath }[] = [
    { name: 'Abonnements', path: 'pricing' },
    { name: 'FAQ', path: 'faq' },
    { name: 'À Propos', path: 'about' },
    { name: 'Contact', path: 'contact' },
    { name: 'Confidentialité', path: 'privacy' },
  ];

  const handleLinkClick = (path: PagePath) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <button onClick={() => handleLinkClick('home')} className="hover:opacity-90 transition-opacity">
              <Logo />
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button 
                key={link.path}
                onClick={() => handleLinkClick(link.path)} 
                className={`text-[10px] font-bold uppercase tracking-widest transition-all relative py-2 ${
                  currentPath === link.path ? 'text-[#DC2626]' : 'text-[#475569] hover:text-[#DC2626]'
                }`}
              >
                {link.name}
                {currentPath === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#DC2626] rounded-full"></span>
                )}
              </button>
            ))}
            <button 
              onClick={() => handleLinkClick('demo')}
              className="bg-[#DC2626] text-white px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-[#B91C1C] transition-all shadow-lg active:scale-95"
            >
              Essayer
            </button>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 p-2">
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-white border-b border-slate-100 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-8 space-y-2 text-center">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleLinkClick(link.path)}
              className="block w-full py-4 text-[11px] font-bold uppercase tracking-widest text-[#0F172A] border-b border-slate-50 last:border-0"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-6">
            <button
              onClick={() => handleLinkClick('demo')}
              className="w-full bg-[#DC2626] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest"
            >
              Accès Démo
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
