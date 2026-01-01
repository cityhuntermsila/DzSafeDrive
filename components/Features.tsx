
import React from 'react';

const FEATURE_LIST = [
  {
    icon: "fa-shield-heart",
    title: "Sérénité Familiale",
    desc: "Gardez l'esprit léger. Notre système surveille chaque mètre carré pour protéger vos proches.",
    color: "red"
  },
  {
    icon: "fa-eye",
    title: "Vision Augmentée",
    desc: "Voyez à travers la poussière et l'obscurité. Une clarté parfaite en toute circonstance.",
    color: "blue"
  },
  {
    icon: "fa-clock-rotate-left",
    title: "Anticipation Totale",
    desc: "Détecte les dangers bien avant qu'ils ne soient visibles à l'œil nu.",
    color: "red"
  },
  {
    icon: "fa-hand-holding-heart",
    title: "Bienveillance Active",
    desc: "Un compagnon de route infatigable avec une vigilance absolue 24h/24.",
    color: "blue"
  }
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 lg:py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="text-[#2563EB] font-black uppercase tracking-[0.3em] text-[9px] mb-3 text-center">Risques Identifiés par IA</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] leading-tight text-center">
              Analyse préventive <br/> des dangers de la route
            </h2>
          </div>
          <p className="text-[#475569] text-sm md:text-base md:max-w-xl leading-relaxed font-medium text-center">
            Notre technologie de vision artificielle détecte les risques en temps réel pour transformer votre expérience de conduite.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {FEATURE_LIST.map((f, i) => (
            <div key={i} className="group p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] bg-white hover:shadow-xl transition-all duration-500 border border-slate-50 flex flex-col items-center text-center">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-base lg:text-xl mb-4 lg:mb-6 transition-transform group-hover:-rotate-3 shadow-sm
                ${f.color === 'red' ? 'bg-[#DC2626] text-white' : 'bg-[#2563EB] text-white'}`}>
                <i className={`fas ${f.icon}`}></i>
              </div>
              <h3 className="text-[10px] lg:text-[14px] font-black uppercase text-[#0F172A] mb-2 leading-tight h-8 lg:h-auto flex items-center justify-center">{f.title}</h3>
              <p className="text-[#475569] text-[9px] lg:text-[13px] leading-relaxed font-medium line-clamp-3 lg:line-clamp-none">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Rappel des bénéfices en 3 points */}
        <div className="mt-16 pt-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center justify-items-center">
            <div className="flex flex-col items-center max-w-[250px]">
                <h4 className="text-sm font-black text-[#0F172A] mb-2 uppercase tracking-tight">Réaction Instantanée</h4>
                <p className="text-[#475569] text-[11px] font-medium">Réagit 10 fois plus vite qu'un conducteur expert face au risque.</p>
            </div>
            <div className="flex flex-col items-center max-w-[250px]">
                <h4 className="text-sm font-black text-[#0F172A] mb-2 uppercase tracking-tight">Zéro Distraction</h4>
                <p className="text-[#475569] text-[11px] font-medium">Discret et intervient uniquement en cas de menace avérée.</p>
            </div>
            <div className="flex flex-col items-center max-w-[250px]">
                <h4 className="text-sm font-black text-[#0F172A] mb-2 uppercase tracking-tight">Vigilance Native</h4>
                <p className="text-[#475569] text-[11px] font-medium">Optimisé pour identifier les risques spécifiques aux routes d'Algérie.</p>
            </div>
        </div>
      </div>
    </section>
  );
};
