import React, { useState } from 'react';

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Essentiel",
      price: "Gratuit",
      features: [
        "Détection par image",
        "10 images / jour",
        "Mode jour uniquement"
      ],
      notIncluded: [
        "Historique",
        "Alertes Vocales IA"
      ],
      button: "Commencer",
      popular: false,
      dark: false
    },
    {
      name: "Advanced Pro",
      price: billingCycle === 'monthly' ? "2 500 DA" : "1 990 DA",
      period: "par mois",
      features: [
        "Temps Réel Illimité",
        "Synthèse Vocale IA",
        "Vigilance 24/7",
        "Priorité Serveur"
      ],
      button: "S'abonner",
      popular: true,
      dark: true
    },
    {
      name: "Flotte Pro",
      price: "Sur mesure",
      features: [
        "Multi-véhicules",
        "Analytiques Avancés",
        "API Dédiée",
        "Support 1h"
      ],
      button: "Contacter",
      popular: false,
      dark: false
    }
  ];

  return (
    <section id="pricing" className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-[#2563EB] font-black uppercase tracking-[0.3em] text-[8px] mb-2">Nos Offres</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mb-4">La sécurité à votre portée</h2>
          
          <div className="flex items-center justify-center gap-1 mt-4 bg-white p-1 rounded-full w-fit mx-auto border border-slate-200 shadow-sm">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-[#0F172A] text-white' : 'text-[#475569] hover:text-slate-600'}`}>
              Mensuel
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-[#0F172A] text-white' : 'text-[#475569] hover:text-slate-600'}`}>
              Annuel
            </button>
          </div>
        </div>

        {/* Flex container pour centrer et permettre 2 par ligne en mobile */}
        <div className="flex flex-wrap justify-center gap-3 lg:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col justify-between rounded-[1.5rem] lg:rounded-[2rem] p-5 lg:p-8 transition-all duration-300 relative overflow-hidden
                ${plan.dark ? 'bg-[#0F172A] text-white shadow-2xl scale-105 z-10' : 'bg-white text-[#0F172A] border border-slate-100 shadow-sm'}
                w-[47%] md:w-[31%] min-w-[150px] max-w-[320px]`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#DC2626] text-white px-3 py-1 text-[6px] font-black uppercase tracking-widest">Top</div>
              )}
              
              <div className="text-center">
                <h3 className={`text-[7px] lg:text-[9px] font-black mb-3 uppercase tracking-widest ${plan.dark ? 'text-white/50' : 'text-[#475569]'}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <div className="text-sm lg:text-3xl font-black">{plan.price}</div>
                  {plan.period && (
                    <div className={`text-[6px] uppercase tracking-widest mt-0.5 ${plan.dark ? 'text-white/30' : 'text-slate-400'}`}>
                      {plan.period}
                    </div>
                  )}
                </div>
                
                <ul className="space-y-2 mb-6 text-left w-full">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-1.5 text-[7px] lg:text-[11px] font-medium leading-tight">
                      <i className={`fas fa-check ${plan.dark ? 'text-[#DC2626]' : 'text-[#2563EB]'}`}></i>
                      <span className={plan.dark ? 'text-white/80' : 'text-[#475569]'}>{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded?.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-1.5 text-[7px] lg:text-[11px] font-medium opacity-30 line-through italic">
                      <i className="fas fa-times"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`w-full py-2.5 rounded-full font-black text-[7px] lg:text-[9px] uppercase tracking-widest transition-all
                ${plan.dark 
                  ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-lg shadow-red-600/20' 
                  : 'border-2 border-slate-100 hover:border-[#0F172A] text-[#0F172A]'}`}>
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};