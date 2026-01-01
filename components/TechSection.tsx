
import React from 'react';

const ALERT_CARDS = [
  {
    title: "Collision Frontale",
    desc: "Détection laser virtuelle des véhicules ralentissant brusquement.",
    icon: "fa-car-side"
  },
  {
    title: "Lignes de Route",
    desc: "Analyse des marquages pour prévenir les dérives.",
    icon: "fa-road"
  },
  {
    title: "Piétons & Cyclistes",
    desc: "Identification des usagers vulnérables en zone urbaine.",
    icon: "fa-person-walking"
  },
  {
    title: "Distance Sécurité",
    desc: "Calcul précis de l'intervalle entre véhicules.",
    icon: "fa-arrows-left-right"
  },
  {
    title: "Limites Vitesse",
    desc: "Lecture automatique des panneaux routiers.",
    icon: "fa-gauge-high"
  }
];

export const TechSection: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Section 1: Intelligence Artificielle */}
      <section className="py-10 lg:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          <div className="lg:w-1/2 w-full flex justify-center">
            <div className="relative rounded-[1.5rem] lg:rounded-[1.8rem] overflow-hidden shadow-lg ring-1 ring-slate-100 group w-[70%] lg:w-full max-w-[460px] mx-auto">
              <img
                src="/images/ai-tech.jpg"
                alt="Intelligence Artificielle DzSafeDrive"
                className="w-full h-[200px] lg:h-[280px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity"></div>
            </div>
          </div>
          <div className="lg:w-1/2 space-y-5 flex flex-col items-center text-center">
            <div className="text-[#DC2626] font-black text-[8px] uppercase tracking-[0.3em]">Technologie de Pointe</div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] leading-[1.1]">Intelligence Artificielle</h2>
            <p className="text-sm text-[#475569] leading-relaxed font-medium max-w-sm px-4">
              Leader de la vision par ordinateur pour l'automobile. Système basé sur l'IA et l'apprentissage profond (Deep Learning).
            </p>
            <div className="pt-1 flex justify-center w-full">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0F172A] bg-slate-50 px-4 py-2 rounded-full">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#DC2626] text-[10px]"><i className="fas fa-microchip"></i></div>
                Processeurs optimisés IA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Vision par Ordinateur */}
      <section className="py-10 lg:py-14 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-14">
          <div className="lg:w-1/2 w-full flex justify-center">
            <div className="relative rounded-[1.5rem] lg:rounded-[1.8rem] overflow-hidden shadow-lg ring-1 ring-slate-100 group w-[70%] lg:w-full max-w-[460px] mx-auto">
              <img
                src="/images/vision-tech.jpg"
                alt="Vision par Ordinateur DzSafeDrive"
                className="w-full h-[200px] lg:h-[280px] object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>
          </div>
          <div className="lg:w-1/2 space-y-5 flex flex-col items-center text-center">
            <div className="text-[#2563EB] font-black text-[8px] uppercase tracking-[0.3em]">Analyse de Scène</div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] leading-[1.1]">Vision par Ordinateur</h2>
            <p className="text-sm text-[#475569] leading-relaxed font-medium max-w-sm px-4">
              Base de notre compétence ADAS avancée. Analyse complète de l'environnement routier.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-2.5 py-1 bg-white rounded-full text-[7px] font-black text-[#475569] border border-slate-200 uppercase tracking-widest shadow-sm">Segmentation</span>
              <span className="px-2.5 py-1 bg-white rounded-full text-[7px] font-black text-[#475569] border border-slate-200 uppercase tracking-widest shadow-sm">Détection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Summary: Comment ça marche - Grille 2 colonnes mobile */}
      <section className="py-14 lg:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-[#2563EB] font-black text-[8px] uppercase tracking-[0.4em] mb-2 text-center">Fonctionnement</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] mb-5 leading-tight text-center">Comment ça marche</h2>
          <p className="max-w-2xl mx-auto text-sm text-[#475569] mb-10 leading-relaxed font-medium px-4 text-center">
            DzSafeDrive® surveille la route. Dès qu'une menace est détectée, le système vous avertit par une alerte visuelle et sonore.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 justify-items-center">
            {ALERT_CARDS.map((card, idx) => (
              <div key={idx} className="w-full bg-[#F8FAFC] p-4 lg:p-5 rounded-[1.2rem] lg:rounded-[1.8rem] border border-slate-50 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#2563EB] rounded-lg lg:rounded-xl flex items-center justify-center text-white text-base lg:text-lg mb-3 lg:mb-5 group-hover:bg-[#DC2626] transition-colors shadow-lg">
                  <i className={`fas ${card.icon}`}></i>
                </div>
                <h3 className="text-[7px] lg:text-[9px] font-black text-[#0F172A] uppercase tracking-wider mb-1 lg:mb-1.5 flex items-center justify-center h-6 lg:h-7 text-center">
                  {card.title}
                </h3>
                <p className="text-[6px] lg:text-[8px] font-bold text-[#475569] leading-relaxed line-clamp-2 lg:line-clamp-none text-center">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
