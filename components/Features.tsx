import React from 'react';

const FEATURE_LIST = [
  {
    icon: "fa-person-walking",
    title: "Détection de Piétons",
    desc: "Identification précise des formes humaines même en basse luminosité.",
    bg: "bg-blue-800/40",
    text: "text-white"
  },
  {
    icon: "fa-dog",
    title: "Risques Animaliers",
    desc: "Réaction ultra-rapide face aux animaux traversant la chaussée.",
    bg: "bg-yellow-800/20",
    text: "text-[#FFB81C]"
  },
  {
    icon: "fa-road-barrier",
    title: "Obstacles Mobiles",
    desc: "Détecte les débris et véhicules arrêtés avant qu'ils ne soient visibles.",
    bg: "bg-white/10",
    text: "text-white"
  },
  {
    icon: "fa-bell",
    title: "Alertes Vocales",
    desc: "Synthèse vocale intelligente pour ne pas distraire le conducteur.",
    bg: "bg-blue-600/40",
    text: "text-white"
  }
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-[#0000FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-blue-200 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Fonctionnalités Clés</div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Une Technologie de Pointe</h2>
          <p className="text-blue-100/70 max-w-2xl mx-auto">
            SafeDrive AI utilise le modèle Gemini 3 Flash pour une analyse visuelle et sonore sans précédent.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURE_LIST.map((f, i) => (
            <div key={i} className={`p-8 rounded-[2.5rem] ${f.bg} hover:scale-105 transition-all duration-500 border border-white/10 hover:border-white/30 hover:shadow-2xl group flex flex-col items-center text-center`}>
              <div className={`w-16 h-16 bg-white/20 ${f.text} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:rotate-12 transition-all border border-white/20`}>
                <i className={`fas ${f.icon}`}></i>
              </div>
              <h3 className="text-lg font-black text-white mb-3">{f.title}</h3>
              <p className="text-blue-50 text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};