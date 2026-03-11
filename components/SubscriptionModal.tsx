import React, { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, planName }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ fullName: '', address: '', phone: '', email: '' });
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#0F172A] transition-colors"
          aria-label="Fermer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0F172A] mb-2">Abonnement</h2>
          <p className="text-sm font-medium text-slate-500">
            {planName ? `Plan sélectionné : ${planName}` : 'Veuillez remplir vos informations'}
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">Demande envoyée !</h3>
            <p className="text-slate-500 text-sm">Nous vous contacterons très prochainement.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nom et Prénom</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-sm font-medium text-[#0F172A]"
                placeholder="Votre nom complet"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Adresse</label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-sm font-medium text-[#0F172A]"
                placeholder="Votre adresse"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Numéro de téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-sm font-medium text-[#0F172A]"
                placeholder="Ex: 0555 12 34 56"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-sm font-medium text-[#0F172A]"
                placeholder="votre.email@exemple.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all
                ${isSubmitting ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-lg shadow-blue-600/20'}`}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Confirmer l\'abonnement'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
