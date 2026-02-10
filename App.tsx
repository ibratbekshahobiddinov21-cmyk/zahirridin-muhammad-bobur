
import React from 'react';
import { HistorySection } from './components/HistorySection';
import { GeminiLiveChat } from './components/GeminiLiveChat';

const App: React.FC = () => {
  return (
    <div className="min-h-screen royal-gradient selection:bg-amber-500/30">
      {/* Hero / Header Area */}
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-amber-900/20">
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://picsum.photos/id/10/1920/1080')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'sepia(1) saturate(0.5)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>
        
        <div className="relative z-20 text-center px-4 space-y-6">
          <div className="inline-block p-1 bg-amber-500/20 rounded-full mb-4 border border-amber-500/30 backdrop-blur-sm">
            <span className="px-4 py-1 text-xs uppercase tracking-[0.3em] font-bold text-amber-400">Tarix va Madaniyat</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 tracking-tight">
            Mirzo Bobur
          </h1>
          <p className="text-xl md:text-2xl font-light text-amber-100/70 max-w-2xl mx-auto font-serif">
            Andijonning arsloni, Hindning sultoni va buyuk adabiyot darg‘asi
          </p>
          
          <div className="flex justify-center gap-4 pt-8">
            <a href="#history" className="bg-amber-500 text-slate-950 px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition-colors shadow-xl shadow-amber-500/20">
              Hayot yo'li
            </a>
            <a href="#works" className="bg-slate-800 text-amber-100 border border-slate-700 px-8 py-3 rounded-full font-bold hover:bg-slate-700 transition-colors">
              Asarlari
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-32">
        <div id="history">
          <HistorySection />
        </div>
        
        <section id="works" className="bg-slate-950 py-24 px-4 border-y border-amber-900/10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-bold text-amber-500">Boburnoma - Hayot va Davlatnomasi</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                "Boburnoma" — jahon adabiyotidagi eng go'zal va ochiq-oydin avtobiografik asarlardan biri. 
                Unda Bobur mirzo o'zining shonli g'alabalarini ham, achchiq mag'lubiyatlarini ham boricha tasvirlaydi.
              </p>
              <ul className="space-y-4">
                {[
                  "15-16-asrlar tarixinining eng ishonchli manbasi",
                  "Markaziy Osiyo, Afg'oniston va Hindiston tabiati tavsifi",
                  "Davlat boshqaruvi va diplomatiya qoidalari",
                  "Tilsiz qolgan tuyg'ularning samimiy ifodasi"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-400">
                    <i className="fas fa-check-circle text-amber-500"></i>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-500/10 blur-3xl rounded-full"></div>
              <img 
                src="https://picsum.photos/id/101/800/600" 
                alt="Manuscript concept" 
                className="relative rounded-2xl shadow-2xl border border-amber-900/20"
              />
            </div>
          </div>
        </section>

        <section className="py-24 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-amber-100 mb-8">Ma'naviy meros bugun</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            Zahiriddin Muhammad Boburning asarlari bugungi kungacha yetib kelgan. Ularning ko‘pchiligi ingliz, rus, fors, hind va boshqa tillarga tarjima qilingan. 
            Xatti Boburiy asari yozuv san’atiga, Risolai aruz esa she’r vazni haqidagi bilimlarga boy.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {['Xatti Boburiy', 'Mubayyin', 'Devon', 'Risolai Aruz'].map((work, i) => (
               <div key={i} className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg text-amber-300 font-serif italic">
                 {work}
               </div>
             ))}
          </div>
        </section>
      </main>

      {/* Interactive Voice Layer */}
      <GeminiLiveChat />

      <footer className="bg-slate-950 py-12 px-4 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Bobur Mirzo - Interactive Educational Project</p>
        <p className="mt-2">Powered by Gemini 2.5 Live API</p>
      </footer>
    </div>
  );
};

export default App;
