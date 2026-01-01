import React from 'react';

const TEAM = [
  {
    name: "Belmokhtar Dounia",
    role: "CEO & Founder",
    desc: "Visionnaire passionnée par l'innovation technologique et la sécurité publique, Dounia dirige DzSafeDrive avec l'ambition de transformer la mobilité en Algérie.",
    icon: "fa-rocket",
    color: "amber"
  },
  {
    name: "Boutaleb Wiam",
    role: "Expert Routier",
    desc: "Forte d'une expertise approfondie en infrastructure routière, Wiam garantit que nos algorithmes répondent aux défis réels du terrain algérien.",
    icon: "fa-road",
    color: "stone"
  },
  {
    name: "Tabbakh Mostefa",
    role: "CTO",
    desc: "Architecte système chevronné, Mostefa supervise le développement des modèles d'IA les plus performants pour une analyse en temps réel sans compromis.",
    icon: "fa-microchip",
    color: "orange"
  },
  {
    name: "Bendaoud Nessrine",
    role: "Frontend Engineer",
    desc: "Artiste du code, Nessrine transforme des données complexes en interfaces intuitives et réactives pour nos utilisateurs finaux.",
    icon: "fa-code",
    color: "stone"
  },
  {
    name: "Bensghir Salsabil",
    role: "UI/UX Designer",
    desc: "Spécialiste de l'expérience utilisateur, Salsabil veille à ce que chaque interaction avec DzSafeDrive soit fluide, rassurante et efficace.",
    icon: "fa-pen-nib",
    color: "amber"
  }
];

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-[#0000FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">L'Équipe derrière DzSafeDrive</h2>
          <p className="text-blue-100/70 max-w-3xl mx-auto text-lg leading-relaxed">
            Réunis par une mission commune : réduire les accidents de la route en Algérie grâce à l'intelligence artificielle. Notre équipe multidisciplinaire allie expertise technologique et connaissance du terrain.
          </p>
        </div>

        {/* Liste des membres - 2 colonnes sur mobile, 3 sur desktop */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-20">
          {TEAM.map((member, i) => (
            <div 
              key={i} 
              className={`group p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 bg-white/10 hover:bg-white/20 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 flex flex-col items-center text-center w-[calc(50%-0.5rem)] md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)] max-w-sm`}
            >
              <div className={`w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl shadow-inner transition-transform group-hover:scale-110 mb-4 md:mb-6 mx-auto
                ${member.color === 'amber' ? 'bg-yellow-400 text-blue-900' : 
                  member.color === 'orange' ? 'bg-orange-400 text-blue-900' :
                  'bg-blue-400 text-blue-900'}`}>
                <i className={`fas ${member.icon}`}></i>
              </div>
              
              <h3 className="text-base md:text-2xl font-bold text-white mb-0.5 md:mb-1">{member.name}</h3>
              <p className={`text-[10px] md:text-sm font-bold uppercase tracking-wider mb-2 md:mb-4 
                ${member.color === 'amber' ? 'text-[#FFB81C]' : 
                  member.color === 'orange' ? 'text-orange-300' :
                  'text-blue-200'}`}>
                {member.role}
              </p>
              <p className="text-blue-100 leading-relaxed italic mb-4 md:mb-6 text-[10px] md:text-base hidden xs:block">
                "{member.desc}"
              </p>
              
              <div className="mt-auto">
                <a href="#" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-all mx-auto">
                  <i className="fab fa-linkedin-in text-xs md:text-sm"></i>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Section Nos Valeurs */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-700 to-blue-900 p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] text-white shadow-2xl relative overflow-hidden mb-24 border border-white/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="text-center relative z-10">
            <h4 className="text-2xl md:text-3xl font-bold mb-8 md:mb-10">Nos Valeurs Fondamentales</h4>
            <div className="grid grid-cols-2 gap-3 md:gap-8 text-left">
              <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <i className="fas fa-microchip text-yellow-200 text-lg md:text-2xl mt-1"></i>
                <div>
                  <h5 className="font-bold text-xs md:text-xl mb-1 text-white leading-tight text-yellow-50">Innovation Algérienne</h5>
                  <p className="text-blue-200 text-[9px] md:text-sm leading-tight md:leading-normal">Solutions locales pour défis mondiaux.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <i className="fas fa-shield-heart text-yellow-200 text-lg md:text-2xl mt-1"></i>
                <div>
                  <h5 className="font-bold text-xs md:text-xl mb-1 text-white leading-tight text-yellow-50">Sécurité Prioritaire</h5>
                  <p className="text-blue-200 text-[9px] md:text-sm leading-tight md:leading-normal">La vie humaine au cœur de notre code.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <i className="fas fa-award text-yellow-200 text-lg md:text-2xl mt-1"></i>
                <div>
                  <h5 className="font-bold text-xs md:text-xl mb-1 text-white leading-tight text-yellow-50">Excellence IA</h5>
                  <p className="text-blue-200 text-[9px] md:text-sm leading-tight md:leading-normal">Précision chirurgicale par Gemini.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <i className="fas fa-handshake-angle text-yellow-200 text-lg md:text-2xl mt-1"></i>
                <div>
                  <h5 className="font-bold text-xs md:text-xl mb-1 text-white leading-tight text-yellow-50">Impact Social</h5>
                  <p className="text-blue-200 text-[9px] md:text-sm leading-tight md:leading-normal">Sauver des vies à M'Sila et partout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 bg-blue-900 border border-white/10 rounded-[2rem] md:rounded-[3rem] text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-yellow-400/5 blur-[100px]"></div>
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 relative z-10">Rejoignez l'aventure</h3>
          <p className="text-blue-200 mb-8 md:mb-10 max-w-2xl mx-auto relative z-10 text-sm md:text-lg">
            Nous sommes toujours à la recherche de talents passionnés par l'IA et la sécurité routière pour agrandir notre famille à M'Sila.
          </p>
          <button className="bg-[#FFB81C] text-blue-900 px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-yellow-400 transition-all relative z-10 active:scale-95 shadow-lg text-sm md:text-base">
            Voir les postes ouverts
          </button>
        </div>
      </div>
    </section>
  );
};