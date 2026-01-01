import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { DemoSection } from './components/DemoSection';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { Legal, Privacy } from './components/Legal';

export type PagePath = 'home' | 'features' | 'demo' | 'pricing' | 'contact' | 'about' | 'legal' | 'privacy';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<PagePath>('home');

  // Remonter en haut de page lors d'un changement de route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  const renderPage = () => {
    switch (currentPath) {
      case 'home':
        return (
          <div className="animate-fade-in">
            <Hero onNavigate={setCurrentPath} />
            <div className="py-20 bg-[#0000FF]">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold mb-8 text-white/60 uppercase tracking-widest text-xs">Partenaires de Sécurité</h2>
                <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale contrast-200 invert">
                  <i className="fab fa-uber text-4xl"></i>
                  <i className="fab fa-ups text-4xl"></i>
                  <i className="fab fa-fedex text-4xl"></i>
                  <i className="fab fa-dhl text-4xl"></i>
                </div>
              </div>
            </div>
          </div>
        );
      case 'features':
        return <div className="animate-fade-in pt-20"><Features /></div>;
      case 'demo':
        return <div className="animate-fade-in pt-20"><DemoSection /></div>;
      case 'pricing':
        return (
          <div className="animate-fade-in pt-20">
            <Pricing />
            <FAQ />
          </div>
        );
      case 'about':
        return <div className="animate-fade-in pt-20"><About /></div>;
      case 'contact':
        return <div className="animate-fade-in pt-20"><Contact /></div>;
      case 'legal':
        return <div className="animate-fade-in pt-20"><Legal onNavigate={setCurrentPath} /></div>;
      case 'privacy':
        return <div className="animate-fade-in pt-20"><Privacy onNavigate={setCurrentPath} /></div>;
      default:
        return <Hero onNavigate={setCurrentPath} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0000FF]">
      <Navbar currentPath={currentPath} onNavigate={setCurrentPath} />
      <main>
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPath} />
      
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;