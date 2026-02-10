
import React from 'react';

interface InfoCardProps {
  title: string;
  content: string;
  icon: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, content, icon }) => (
  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:border-amber-500/50 transition-all group">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
        <i className={`fas ${icon} text-xl`}></i>
      </div>
      <h3 className="text-xl font-semibold font-serif text-amber-100">{title}</h3>
    </div>
    <p className="text-slate-300 leading-relaxed">{content}</p>
  </div>
);

export const HistorySection: React.FC = () => {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-500">Zahiriddin Muhammad Bobur</h2>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto italic">
          Buyuk sarkarda, iste’dodli shoir va o‘zbek xalqining faxri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoCard 
          icon="fa-crown"
          title="Kelib chiqishi" 
          content="1483-yilda Andijon shahrida tug‘ilgan. Temuriylar sulolasiga mansub bo‘lib, Amir Temurning avlodlaridan biridir."
        />
        <InfoCard 
          icon="fa-book-open"
          title="Ilm va Adabiyot" 
          content="Yoshligidan ilm-fan va adabiyotga qiziqqan. Arab, fors va turkiy tillarni yaxshi bilgan. She’r yozishga juda erta kirishgan."
        />
        <InfoCard 
          icon="fa-sword"
          title="Sarkardalik" 
          content="Davlat boshqaruvi va harbiy yurishlarda qatnashgan. Hindistonga yurish qilib, u yerda qudratli Boburiylar davlatiga asos solgan."
        />
        <InfoCard 
          icon="fa-scroll"
          title="Boburnoma" 
          content="Uning eng mashhur asari. Unda hayoti, yurishlari va ko‘rgan mamlakatlari haqida tarixiy, adabiy va ilmiy ma'lumotlar berilgan."
        />
        <InfoCard 
          icon="fa-pen-nib"
          title="She’riyat" 
          content="Devon nomli she’riy to‘plamida g‘azal, ruboiy va tuyuqlar jamlangan. Vatan sog‘inchi va hayot falsafasi keng o'rin olgan."
        />
        <InfoCard 
          icon="fa-landmark"
          title="Meros" 
          content="U nafaqat davlat arbobi, balki buyuk adib ham bo‘lgan. Asarlari ko‘plab jahon tillariga tarjima qilingan va bugungi kungacha o'rganiladi."
        />
      </div>

      <div className="bg-slate-900/80 border border-amber-900/30 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
           <i className="fas fa-feather-pointed text-9xl"></i>
        </div>
        <h3 className="text-2xl font-serif font-bold text-amber-500 mb-4 italic">Tanlangan Ruboiy:</h3>
        <blockquote className="text-2xl md:text-3xl font-serif italic text-amber-100 leading-snug">
          "Tole' yo‘qi jonimga balog‘ bo‘ldi, <br/>
          Har ishniki qildim - xatog‘ bo‘ldi. <br/>
          O'z yerin qo‘yib, Hind sori yuzlandim, <br/>
          Yo Rab, netayin, ne yuz qarolig‘ bo‘ldi."
        </blockquote>
      </div>
    </section>
  );
};
