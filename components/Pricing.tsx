import React, { useState } from 'react';

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-24 bg-[#0000FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-[#FFB81C] font-black uppercase tracking-[0.3em] text-[10px] mb-4">Abonnements</div>
        <h2 className="text-3xl md:text-5xl font-black mb-4 text-white leading-tight">Plans de Protection</h2>
        <p className="text-blue-100/70 mb-12 max-w-2xl mx-auto text-lg">Choisissez le niveau de vigilance adapté à vos trajets.</p>
        
        <div className="flex items-center justify-center gap-6 mb-16">
          <span className={`text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'text-white' : 'text-white/40'}`}>Mensuel</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-16 h-8 bg-blue-800 rounded-full relative p-1 transition-all hover:bg-blue-700 border border-white/20"
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-500 ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'text-white' : 'text-white/40'}`}>
            Annuel <span className="ml-2 px-3 py-1 bg-[#FFB81C] text-blue-900 rounded-full text-[9px] font-black border border-white/20">-30%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 p-10 rounded-[2.5rem] shadow-sm border border-white/10 text-center flex flex-col items-center hover:bg-white/20 transition-all border-b-8 border-b-yellow-400/20 backdrop-blur-md">
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Standard</h3>
            <div className="text-4xl font-black text-yellow-300 mb-8">Gratuit</div>
            <ul className="space-y-4 mb-10 flex-grow text-sm font-medium">
              <li className="flex items-center justify-center gap-3 text-white"><i className="fas fa-check text-yellow-400"></i> Détection image</li>
              <li className="flex items-center justify-center gap-3 text-white"><i className="fas fa-check text-yellow-400"></i> 10 analyses / jour</li>
              <li className="flex items-center justify-center gap-3 text-white/30"><i className="fas fa-times"></i> Alertes Vocales</li>
            </ul>
            <button className="w-full py-4 text-center rounded-2xl border-2 border-white/20 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-white">Essayer</button>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/40 text-center flex flex-col items-center relative overflow-hidden border-4 border-[#FFB81C] md:scale-105 z-10 border-b-8 border-b-blue-900">
            <div className="absolute top-0 right-0 bg-[#FFB81C] text-blue-900 px-6 py-2 text-[8px] font-black uppercase tracking-[0.2em] rounded-bl-2xl">Plus Populaire</div>
            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest">Advanced Pro</h3>
            <div className="mb-8">
              <div className="text-4xl font-black text-blue-800">
                {billingCycle === 'monthly' ? `2 500 DA` : `1 750 DA`}
              </div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">/ mois</div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow text-sm font-medium">
              <li className="flex items-center justify-center gap-3 text-slate-800"><i className="fas fa-check text-blue-600"></i> Détection HD</li>
              <li className="flex items-center justify-center gap-3 text-slate-800"><i className="fas fa-check text-blue-600"></i> Temps Réel Illimité</li>
              <li className="flex items-center justify-center gap-3 text-slate-800"><i className="fas fa-check text-blue-600"></i> Synthèse Vocale</li>
            </ul>
            <button className="w-full py-4 text-center rounded-2xl bg-[#004A99] text-white font-black text-xs uppercase tracking-widest hover:bg-[#003366] transition-all shadow-lg shadow-[#004A99]/20">S'abonner</button>
          </div>

          <div className="bg-white/10 p-10 rounded-[2.5rem] shadow-sm border border-white/10 text-center flex flex-col items-center hover:bg-white/20 transition-all border-b-8 border-b-blue-400/20 backdrop-blur-md">
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Business</h3>
            <div className="text-3xl font-black text-blue-200 mb-8">Sur Devis</div>
            <ul className="space-y-4 mb-10 flex-grow text-sm font-medium">
              <li className="flex items-center justify-center gap-3 text-white"><i className="fas fa-check text-blue-400"></i> Gestion de Flotte</li>
              <li className="flex items-center justify-center gap-3 text-white"><i className="fas fa-check text-blue-400"></i> Rapports Avancés</li>
              <li className="flex items-center justify-center gap-3 text-white"><i className="fas fa-check text-blue-400"></i> Support 24/7</li>
            </ul>
            <button className="w-full py-4 text-center rounded-2xl border-2 border-white/20 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-white">Contact Ventes</button>
          </div>
        </div>
      </div>
    </section>
  );
};