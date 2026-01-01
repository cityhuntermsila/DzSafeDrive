import React from 'react';

const TEAM = [
  {
    name: "Belmokhtar Dounia",
    role: "CEO & Founder",
    desc: "Visionnaire passionnée par l'innovation technologique et la sécurité publique.",
    image: "/images/team-ceo.jpg",
    color: "red"
  },
  {
    name: "Boutaleb Wiam",
    role: "Expert Routier",
    desc: "Garantit que nos algorithmes répondent aux défis réels du terrain.",
    image: "/images/team-expert.jpg",
    color: "blue"
  },
  {
    name: "Tabbakh Mostefa",
    role: "CTO",
    desc: "Architecte système supervisant le développement des modèles d'IA.",
    image: "/images/team-cto.jpg",
    color: "navy"
  },
  {
    name: "Bendaoud Nessrine",
    role: "Frontend Engineer",
    desc: "Transforme des données complexes en interfaces intuitives et réactives.",
    image: "/images/team-frontend.jpg",
    color: "blue"
  },
  {
    name: "Bensghir Salsabil",
    role: "UI/UX Designer",
    desc: "Veille à ce que chaque interaction soit fluide et efficace.",
    image: "/images/team-uiux.jpg",
    color: "red"
  }
];

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="text-[#2563EB] font-black uppercase tracking-[0.3em] text-[10px] mb-4">L'équipe Digitale</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-[#0F172A]">Derrière chaque trajet sécurisé</h2>
          <p className="text-[#475569] max-w-3xl mx-auto text-lg leading-relaxed font-medium px-4">
            Une synergie d'experts passionnés, unis pour révolutionner la mobilité.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-8 mb-24">
          {TEAM.map((member, i) => (
            <div key={i} className="group p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-[#F8FAFC] border border-slate-100 hover:shadow-2xl transition-all duration-500 text-center w-[47%] sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)] max-w-sm flex flex-col items-center">
              <div className="relative mb-4 md:mb-6 w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40">
                <div className={`absolute -inset-1 rounded-[1rem] md:rounded-3xl blur-md opacity-20 group-hover:opacity-40 transition-opacity
                  ${member.color === 'red' ? 'bg-[#DC2626]' : member.color === 'blue' ? 'bg-[#2563EB]' : 'bg-[#0F172A]'}`}></div>
                <img
                  src={member.image}
                  alt={member.name}
                  className="relative w-full h-full object-cover rounded-[1rem] md:rounded-[2rem] grayscale group-hover:grayscale-0 transition-all duration-700 shadow-lg"
                />
              </div>
              <h3 className="text-sm md:text-2xl font-extrabold mb-0.5 md:mb-1 text-[#0F172A] leading-tight">{member.name}</h3>
              <p className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-[#DC2626] mb-2 md:mb-4">{member.role}</p>
              <p className="text-[#475569] text-[8px] md:text-sm leading-relaxed mb-3 md:mb-6 italic line-clamp-2 md:line-clamp-none">"{member.desc}"</p>
              <div className="flex justify-center gap-2 md:gap-4 mt-auto">
                <a href="#" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#DC2626] hover:border-[#DC2626] transition-all"><i className="fab fa-linkedin-in text-[10px] md:text-xs"></i></a>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0F172A] p-10 md:p-20 rounded-[2rem] md:rounded-[3rem] text-white text-center relative overflow-hidden shadow-2xl shadow-blue-900/20 mx-2 md:mx-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] -ml-32 -mt-32"></div>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6">Rejoignez la révolution</h3>
          <p className="text-slate-400 mb-8 md:mb-10 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed px-4">
            Nous recrutons continuellement des talents passionnés par l'IA et la sécurité routière pour agrandir notre famille.
          </p>
          <button className="bg-[#DC2626] text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-[#B91C1C] transition-all shadow-xl shadow-red-600/10">
            Voir les carrières
          </button>
        </div>
      </div>
    </section>
  );
};