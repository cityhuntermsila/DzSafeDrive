import React from 'react';

export const Contact: React.FC = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13054.43714856037!2d4.532392949999999!3d35.70617355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128a383d47a46f97%3A0x6b4c10c436d6a2f4!2sM'Sila%2C%20Alg%C3%A9rie!5e0!3m2!1sfr!2sdz!4v1715600000000!5m2!1sfr!2sdz";

  return (
    <section id="contact" className="py-24 bg-white text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="text-[#2563EB] font-black uppercase tracking-[0.3em] text-[10px] mb-4">Contact</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#0F172A]">Discutons de votre sécurité</h2>
          <p className="text-[#475569] max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Notre équipe est disponible 7J/7 pour des démonstrations personnalisées.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-8 bg-[#F8FAFC] rounded-[2rem] border border-slate-100 group hover:border-[#DC2626] transition-all">
              <div className="w-12 h-12 bg-[#0F172A] text-[#DC2626] rounded-xl flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform">
                <i className="fas fa-location-dot"></i>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#475569] mb-1">Siège</p>
                <p className="font-extrabold text-lg text-[#0F172A]">Cité Administrative, M'Sila Centre</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 p-8 bg-[#F8FAFC] rounded-[2rem] border border-slate-100 group hover:border-[#DC2626] transition-all">
              <div className="w-12 h-12 bg-[#0F172A] text-[#DC2626] rounded-xl flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#475569] mb-1">Email</p>
                <p className="font-extrabold text-lg text-[#0F172A]">dz-support@safedrive-ai.com</p>
              </div>
            </div>

            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-[#F8FAFC] h-[300px] relative group">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                className="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>
          
          <div className="bg-[#F8FAFC] p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-xl">
            <h3 className="text-2xl font-extrabold mb-10 text-[#0F172A]">Formulaire de contact</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#475569] ml-1">Nom complet</label>
                <input type="text" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#DC2626] outline-none transition-all text-[#0F172A]" placeholder="Mohamed Amine" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#475569] ml-1">Email professionnel</label>
                <input type="email" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#DC2626] outline-none transition-all text-[#0F172A]" placeholder="amine@entreprise.dz" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#475569] ml-1">Message</label>
                <textarea rows={4} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#DC2626] outline-none transition-all resize-none text-[#0F172A]" placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>
              <button className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                Envoyer ma demande
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};