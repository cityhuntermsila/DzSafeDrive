
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { TechSection } from './components/TechSection';
import { DemoSection } from './components/DemoSection';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { Legal, Privacy } from './components/Legal';

export type PagePath = 'home' | 'demo' | 'pricing' | 'contact' | 'about' | 'legal' | 'privacy' | 'faq';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<PagePath>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  const [demoKey, setDemoKey] = useState(0);

  const navigateTo = (path: PagePath) => {
    if (path === 'demo' && currentPath === 'demo') {
      setDemoKey(prev => prev + 1);
    }
    setCurrentPath(path);
  };

  const renderPage = () => {
    switch (currentPath) {
      case 'home':
        return (
          <div className="animate-fade-in">
            <Hero onNavigate={navigateTo} />

            <TechSection />
            <Features />
            <Contact />
          </div>
        );
      case 'demo':
        return <div className="animate-fade-in pt-12"><DemoSection key={demoKey} onNavigate={navigateTo} /></div>;
      case 'pricing':
        return (
          <div className="animate-fade-in pt-16">
            <Pricing />
          </div>
        );
      case 'faq':
        return <div className="animate-fade-in pt-16"><FAQ /></div>;
      case 'about':
        return <div className="animate-fade-in pt-16"><About /></div>;
      case 'contact':
        return <div className="animate-fade-in pt-16"><Contact /></div>;
      case 'legal':
        return <div className="animate-fade-in pt-16"><Legal onNavigate={setCurrentPath} /></div>;
      case 'privacy':
        return <div className="animate-fade-in pt-16"><Privacy onNavigate={setCurrentPath} /></div>;
      default:
        return <Hero onNavigate={setCurrentPath} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />
      <main>
        {renderPage()}
      </main>
      <Footer onNavigate={navigateTo} />

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
