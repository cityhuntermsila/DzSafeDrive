import React, { useState } from 'react';

const FAQS = [
  {
    q: "Comment SafeDrive AI fonctionne-t-il techniquement ?",
    a: "Nous utilisons des algorithmes de convolution neuronale (CNN) pour analyser chaque frame de votre flux vidéo. L'IA identifie les motifs correspondant à des êtres vivants ou des obstacles et calcule leur distance relative."
  },
  {
    q: "L'application fonctionne-t-elle sans connexion Internet ?",
    a: "Le mode 'Advanced' permet un pré-traitement local, mais l'analyse haute fidélité nécessite une connexion ponctuelle pour la mise à jour des modèles. Une version 100% offline est disponible pour les flottes professionnelles."
  },
  {
    q: "Quelle est la précision du système ?",
    a: "En conditions de jour optimales, la précision dépasse 99.4%. De nuit, grâce à l'IA générative de vision nocturne, nous maintenons un taux de détection de 92%."
  },
  {
    q: "Puis-je l'intégrer à la caméra de recul de ma voiture ?",
    a: "Oui, notre API est compatible avec la plupart des systèmes multimédia embarqués via Android Auto ou Apple CarPlay."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-[#0000FF]">
      <div className="max-w-3xl auto px-4 sm:px-6 lg:px-8 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Questions Fréquentes</h2>
        <div className="space-y-4">
          {FAQS.map((item, i) => (
            <div key={i} className="border border-white/20 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-white/10 transition-all"
              >
                <span className="font-bold text-white">{item.q}</span>
                <i className={`fas ${openIndex === i ? 'fa-minus' : 'fa-plus'} text-yellow-400`}></i>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 text-blue-100 leading-relaxed animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};