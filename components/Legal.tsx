import React from 'react';
import { PagePath } from '../App';

interface LegalProps {
  onNavigate: (path: PagePath) => void;
}

export const Legal: React.FC<LegalProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-[#94A3B8] leading-relaxed text-center flex flex-col items-center">
      <button 
        onClick={() => onNavigate('home')}
        className="mb-16 text-[#2563EB] font-black flex items-center gap-2 hover:gap-3 transition-all uppercase text-[11px] tracking-widest w-fit"
      >
        <i className="fas fa-arrow-left"></i> Retour à l'accueil
      </button>
      
      <h1 className="text-4xl font-black mb-12 text-white">Mentions Légales</h1>
      
      <div className="space-y-12 max-w-2xl">
        <section>
          <h2 className="text-lg font-bold mb-4 text-[#DC2626] uppercase tracking-wider">1. Présentation de l'entreprise</h2>
          <p>DzSafeDrive est une marque déposée opérée par l'entité technologique basée à M'Sila, Algérie. Nous sommes spécialisés dans le développement de solutions logicielles (SaaS) basées sur l'intelligence artificielle pour la sécurité routière.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-[#DC2626] uppercase tracking-wider">2. Hébergement</h2>
          <p>Le site est hébergé sur des serveurs sécurisés garantissant une haute disponibilité et la protection des données traitées par nos modèles d'IA.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-[#DC2626] uppercase tracking-wider">3. Propriété Intellectuelle</h2>
          <p>L'ensemble des contenus (textes, graphiques, logos, icônes, images, clips audio, logiciels) présents sur ce site est la propriété exclusive de DzSafeDrive ou de ses partenaires. Toute reproduction, représentation, modification ou publication est strictement interdite sans autorisation préalable.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-[#DC2626] uppercase tracking-wider">4. Contact</h2>
          <p>Pour toute question relative aux mentions légales, veuillez nous contacter à l'adresse email : <strong>dz-support@safedrive-ai.com</strong> ou par téléphone au <strong>+213 (0) 35 54 12 34</strong>.</p>
        </section>
      </div>
    </div>
  );
};

export const Privacy: React.FC<LegalProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-[#94A3B8] leading-relaxed min-h-screen flex flex-col items-center">
      <button 
        onClick={() => onNavigate('home')}
        className="mb-20 text-[#2563EB] font-black flex items-center gap-2 hover:gap-3 transition-all uppercase text-[12px] tracking-widest w-fit"
      >
        <i className="fas fa-arrow-left"></i> Retour à l'accueil
      </button>
      
      <div className="mb-20 text-center">
        <div className="text-[#DC2626] font-black uppercase tracking-[0.4em] text-[10px] mb-4">Confiance Digitale</div>
        <h1 className="text-5xl md:text-6xl font-black mb-8 text-white tracking-tighter">Charte de <br/><span className="text-[#DC2626]">Confidentialité</span></h1>
        <p className="text-lg font-medium text-slate-400 max-w-2xl mx-auto">
          Chez DzSafeDrive, nous croyons que la sécurité routière ne doit jamais se faire au détriment de votre vie privée. Découvrez nos engagements pour protéger vos données.
        </p>
      </div>
      
      <section className="space-y-24 w-full flex flex-col items-center">
        {/* Banner principale centrée */}
        <div className="p-12 bg-white/5 rounded-[3.5rem] border border-white/10 backdrop-blur-sm relative overflow-hidden group w-full max-w-4xl text-center flex flex-col items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#DC2626]/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="w-16 h-16 bg-[#DC2626] rounded-2xl shadow-xl flex items-center justify-center mb-8">
            <i className="fas fa-user-shield text-3xl text-white"></i>
          </div>
          
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">La Règle d'Or : Souveraineté totale</h2>
          <p className="text-slate-400 font-medium text-lg mb-8">Toutes les données générées par votre utilisation sont votre propriété exclusive.</p>
          
          <p className="text-lg font-medium text-white leading-relaxed max-w-2xl">
            DzSafeDrive agit uniquement en tant que processeur technique. Nous ne revendiquons aucun droit de propriété sur les flux vidéo, les historiques de trajet ou les analyses de risques.
          </p>
        </div>

        {/* Grille de points clés centrés */}
        <div className="grid md:grid-cols-2 gap-20 w-full max-w-4xl text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 flex items-center justify-center text-4xl text-[#DC2626]">
              <i className="fas fa-ban"></i>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Zéro Tiers</h2>
            <p className="text-base text-slate-400 font-medium leading-relaxed">
              Nous ne vendons, n'échangeons et ne partageons aucune de vos données personnelles ou de conduite avec des tiers. Votre sécurité ne doit jamais être une marchandise.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 flex items-center justify-center text-4xl text-[#2563EB]">
              <i className="fas fa-bolt"></i>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Traitement Éphémère</h2>
            <p className="text-base text-slate-400 font-medium leading-relaxed">
              Pour la sécurité en temps réel, les flux vidéo sont traités en mémoire vive et supprimés instantanément. Seuls vos archivages personnels sont conservés.
            </p>
          </div>
        </div>

        {/* Section numérotée centrée */}
        <div className="pt-24 border-t border-white/5 w-full max-w-3xl">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-16 text-center">Nos engagements immuables</h2>
          <div className="space-y-12">
            {[
              { id: 1, title: "Transparence Totale", text: "Vous savez exactement quelles données sont utilisées et pourquoi." },
              { id: 2, title: "Souveraineté", text: "Un bouton unique vous permet de purger instantanément l'intégralité de vos données." },
              { id: 3, title: "Sécurité de Grade Militaire", text: "Chiffrement AES-256 pour toutes les données au repos et TLS 1.3 en transit." },
              { id: 4, title: "Localisation", text: "Données traitées sous la supervision stricte de notre équipe experte à M'Sila." }
            ].map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-4 text-center group">
                <span className="w-12 h-12 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-lg font-black shadow-lg group-hover:scale-110 transition-transform mb-2">
                  {item.id}
                </span>
                <p className="text-lg font-medium text-slate-300 max-w-md">
                  <strong className="text-white block mb-1 uppercase tracking-wide text-sm">{item.title} :</strong>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-32 pt-12 border-t border-white/5 text-center w-full max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">Dernière mise à jour : Mai 2024 • Politique de la Maison DzSafeDrive</p>
      </div>
    </div>
  );
};