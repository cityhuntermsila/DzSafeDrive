import React from 'react';

export const Contact: React.FC = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13054.43714856037!2d4.532392949999999!3d35.70617355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128a383d47a46f97%3A0x6b4c10c436d6a2f4!2sM'Sila%2C%20Alg%C3%A9rie!5e0!3m2!1sfr!2sdz!4v1715600000000!5m2!1sfr!2sdz";

  return (
    <section id="contact" className="py-24 bg-[#0000FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Contactez-nous à M'Sila</h2>
          <p className="text-blue-100 text-lg leading-relaxed opacity-80">
            Notre siège social est basé au cœur de l'Algérie. Nos experts locaux sont disponibles pour des démonstrations sur site à travers toute la wilaya de M'Sila.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col items-center space-y-12">
            <div className="grid sm:grid-cols-1 md:grid-cols-1 gap-8 w-full">
              <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-yellow-300 shadow-sm text-xl border border-white/20">
                  <i className="fas fa-location-dot"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Siège Social</p>
                  <p className="font-semibold text-white">Cité Administrative, M'Sila Centre, Algérie</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-yellow-300 shadow-sm text-xl border border-white/20">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Téléphone (Algérie)</p>
                  <p className="font-semibold text-white">+213 (0) 35 54 12 34</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-yellow-300 shadow-sm text-xl border border-white/20">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Email Support</p>
                  <p className="font-semibold text-white">dz-support@safedrive-ai.com</p>
                </div>
              </div>
            </div>

            {/* Google Map Localization */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 h-80 w-full relative group">
              <iframe
                title="M'Sila Centre Location"
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.8] group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-max">
                <a 
                  href="https://maps.google.com/?q=M'Sila+Centre+Algérie" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white px-6 py-3 rounded-xl text-sm font-bold text-blue-800 shadow-lg flex items-center gap-2 hover:bg-blue-50 transition-all active:scale-95"
                >
                  <i className="fas fa-map-location-dot"></i> Ouvrir dans Google Maps
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/20 w-full flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white mb-8">Envoyez-nous un message</h3>
            <form className="space-y-6 w-full max-w-lg mx-auto text-left" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-100 uppercase tracking-widest ml-1">Nom Complet</label>
                <input type="text" className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none placeholder:text-white/30" placeholder="Ex: Mohamed Amine" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-100 uppercase tracking-widest ml-1">Email</label>
                <input type="email" className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none placeholder:text-white/30" placeholder="amine@exemple.dz" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-100 uppercase tracking-widest ml-1">Wilaya / Ville</label>
                <input type="text" className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none" defaultValue="M'Sila" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-100 uppercase tracking-widest ml-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none resize-none placeholder:text-white/30" placeholder="Détaillez votre besoin..."></textarea>
              </div>
              <button className="w-full bg-[#FFB81C] text-blue-900 py-5 rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-xl shadow-black/20 active:scale-95 flex items-center justify-center gap-3 mt-4">
                <i className="fas fa-paper-plane"></i> Envoyer ma Demande
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};