
import React from 'react';
import { PagePath } from '../App';

interface LegalProps {
  onNavigate: (path: PagePath) => void;
}

export const Legal: React.FC<LegalProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-stone-800 leading-relaxed">
      <button 
        onClick={() => onNavigate('home')}
        className="mb-12 text-[#4F7CAC] font-bold flex items-center gap-2 hover:gap-3 transition-all"
      >
        <i className="fas fa-arrow-left"></i> Retour à l'accueil
      </button>
      
      <h1 className="text-4xl font-black mb-8 text-stone-900">Mentions Légales</h1>
      
      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4 text-[#8B735B] uppercase tracking-wider">1. Présentation de l'entreprise</h2>
          <p>DzSafeDrive est une marque déposée opérée par l'entité technologique basée à M'Sila, Algérie. Nous sommes spécialisés dans le développement de solutions logicielles (SaaS) basées sur l'intelligence artificielle pour la sécurité routière.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-[#8B735B] uppercase tracking-wider">2. Hébergement</h2>
          <p>Le site est hébergé sur des serveurs sécurisés garantissant une haute disponibilité et la protection des données traitées par nos modèles d'IA.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-[#8B735B] uppercase tracking-wider">3. Propriété Intellectuelle</h2>
          <p>L'ensemble des contenus (textes, graphiques, logos, icônes, images, clips audio, logiciels) présents sur ce site est la propriété exclusive de DzSafeDrive ou de ses partenaires. Toute reproduction, représentation, modification ou publication est strictement interdite sans autorisation préalable.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-[#8B735B] uppercase tracking-wider">4. Contact</h2>
          <p>Pour toute question relative aux mentions légales, veuillez nous contacter à l'adresse email : <strong>dz-support@safedrive-ai.com</strong> ou par téléphone au <strong>+213 (0) 35 54 12 34</strong>.</p>
        </div>
      </section>
    </div>
  );
};

export const Privacy: React.FC<LegalProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-stone-800 leading-relaxed">
      <button 
        onClick={() => onNavigate('home')}
        className="mb-12 text-[#4F7CAC] font-bold flex items-center gap-2 hover:gap-3 transition-all"
      >
        <i className="fas fa-arrow-left"></i> Retour à l'accueil
      </button>
      
      <h1 className="text-4xl font-black mb-8 text-stone-900">Politique RGPD & Confidentialité</h1>
      
      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4 text-[#8B735B] uppercase tracking-wider">1. Collecte des Données</h2>
          <p>Nous collectons les données nécessaires au fonctionnement de nos services de détection : flux vidéo (temporairement traité en mémoire vive et non stocké sauf demande explicite de l'utilisateur), données de localisation (pour l'analyse contextuelle) et informations de contact pour la gestion des abonnements.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-[#8B735B] uppercase tracking-wider">2. Finalité du Traitement</h2>
          <p>Les données sont traitées uniquement pour :</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Identifier les risques routiers en temps réel.</li>
            <li>Améliorer la précision de nos modèles d'IA.</li>
            <li>Gérer votre accès aux services Premium.</li>
            <li>Assurer le support technique local à M'Sila.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-[#8B735B] uppercase tracking-wider">3. Protection et Sécurité</h2>
          <p>DzSafeDrive met en œuvre des mesures de sécurité techniques et organisationnelles rigoureuses pour protéger vos données contre tout accès non autorisé, altération ou divulgation. Le traitement de la vision artificielle s'effectue avec un chiffrement de bout en bout.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-[#8B735B] uppercase tracking-wider">4. Vos Droits</h2>
          <p>Conformément aux réglementations en vigueur, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données personnelles. Vous pouvez exercer ces droits en nous contactant directement.</p>
        </div>
      </section>
    </div>
  );
};
