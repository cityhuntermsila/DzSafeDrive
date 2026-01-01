import React, { useState } from 'react';

const FAQ_SECTIONS = [
  {
    title: "DzSafeDrive Général",
    questions: [
      {
        q: "Qu'est-ce que DzSafeDrive précisément ?",
        a: "DzSafeDrive est une solution SaaS de vision artificielle conçue en Algérie. Elle utilise des modèles d'IA de pointe pour transformer n'importe quel flux vidéo de route en un système d'alerte intelligent capable d'identifier piétons, animaux et obstacles imprévus."
      },
      {
        q: "Comment installer le système dans mon véhicule ?",
        a: "L'installation est simple : il suffit de fixer votre smartphone ou une caméra connectée sur votre tableau de bord. Notre application s'occupe du reste en se synchronisant avec votre interface embarquée via Bluetooth ou USB."
      },
      {
        q: "Le système fonctionne-t-il la nuit ?",
        a: "Oui, DzSafeDrive intègre des algorithmes d'optimisation de luminance qui permettent une détection efficace même dans des conditions de faible éclairage ou lors de tempêtes de sable."
      }
    ]
  },
  {
    title: "Confidentialité & Données",
    questions: [
      {
        q: "Mes vidéos de conduite sont-elles enregistrées sur vos serveurs ?",
        a: "Non. Par défaut, le traitement de la vision artificielle s'effectue en temps réel et en mémoire vive. Aucune image ou vidéo n'est stockée de façon permanente sur nos serveurs, sauf si vous activez explicitement l'option 'Enregistrement de sécurité' pour vos archives personnelles."
      },
      {
        q: "Qui a accès à ma position géographique ?",
        a: "Seul l'utilisateur a accès à ses données de localisation en temps réel. Ces données sont utilisées pour contextualiser les alertes (ex: zone de bétail fréquente) et sont cryptées de bout en bout."
      },
      {
        q: "Comment garantissez-vous la sécurité de mon compte ?",
        a: "Nous utilisons des protocoles d'authentification forte et un cryptage AES-256 pour toutes les données de profil et d'abonnement."
      }
    ]
  },
  {
    title: "Historiques & Utilisation",
    questions: [
      {
        q: "À quoi servent les historiques de détection ?",
        a: "Les historiques compilent les types de risques rencontrés pour vous fournir des rapports statistiques sur votre sécurité. Cela vous permet d'identifier vos trajets les plus risqués et d'adapter votre conduite."
      },
      {
        q: "Puis-je supprimer mes données d'historique ?",
        a: "Absolument. Vous avez un contrôle total sur vos données. Depuis votre tableau de bord, vous pouvez purger tout ou partie de votre historique de détection à tout moment."
      },
      {
        q: "Utilisez-vous mes historiques pour entraîner l'IA ?",
        a: "Nous utilisons des données anonymisées et agrégées pour améliorer la précision globale de nos modèles de détection, sans jamais lier ces informations à votre identité personnelle ou à vos trajets spécifiques."
      }
    ]
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <section id="faq" className="py-24 bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-[#2563EB] font-black uppercase tracking-[0.3em] text-[10px] mb-4">Aide & Support</div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight uppercase tracking-tight text-[#0F172A]">Foire Aux Questions</h2>
          <p className="text-[#475569] font-medium">Survolez une question pour voir la réponse.</p>
        </div>

        <div className="space-y-12">
          {FAQ_SECTIONS.map((section, sIdx) => (
            <div key={sIdx}>
              <h3 className="text-[11px] font-black text-[#DC2626] uppercase tracking-[0.25em] mb-6 pl-4 border-l-4 border-[#DC2626]">
                {section.title}
              </h3>
              <div className="space-y-4">
                {section.questions.map((item, qIdx) => {
                  const id = `section-${sIdx}-q-${qIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div 
                      key={qIdx} 
                      className={`rounded-[2rem] overflow-hidden border transition-all duration-300 ${isOpen ? 'bg-white border-slate-200 shadow-xl' : 'bg-transparent border-slate-100'}`}
                      onMouseEnter={() => setOpenIndex(id)}
                      onMouseLeave={() => setOpenIndex(null)}
                    >
                      <div className="w-full p-6 text-left flex justify-between items-center group cursor-default">
                        <span className={`font-extrabold text-base md:text-lg transition-colors duration-300 ${isOpen ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>
                          {item.q}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-4 ${isOpen ? 'bg-[#DC2626] text-white rotate-180' : 'bg-slate-200 text-slate-400'}`}>
                          <i className={`fas fa-chevron-down text-[10px]`}></i>
                        </div>
                      </div>
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-8 text-[#475569] leading-relaxed font-medium text-sm md:text-base">
                          <div className="pt-2 border-t border-slate-50">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-[#0F172A] rounded-[3rem] text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC2626]/20 blur-[60px] rounded-full"></div>
          <h4 className="text-xl font-extrabold mb-4">Vous avez encore des doutes ?</h4>
          <p className="text-slate-400 mb-8 text-sm">Notre équipe est à votre disposition pour toute question technique ou juridique.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:dz-support@safedrive-ai.com" className="bg-[#DC2626] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#B91C1C] transition-all">
              Écrire au support
            </a>
            <button className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              Consulter le Wiki
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};