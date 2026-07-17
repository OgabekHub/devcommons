import React from 'react';

export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-10 flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Yangi Gibrid Logo Konseptlari</h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Sun'iy intellekt orqali rasm chizish limiti vaqtinchalik tugagani sababli, men siz uchun to'g'ridan-to'g'ri kod (SVG) orqali 4 ta mutlaqo yangi, yuqori sifatli gibrid logotiplarni yasadim. Ular hozir saytingizda jonli ishlab turibdi!
        </p>
      </div>
      
      <svg className="hidden">
        <defs>
          <linearGradient id="grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" /> {/* Cyan */}
            <stop offset="50%" stopColor="#3B82F6" /> {/* Blue */}
            <stop offset="100%" stopColor="#8B5CF6" /> {/* Purple */}
          </linearGradient>
          <linearGradient id="grad-alt" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-sm" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
        
        {/* Concept 1 */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-48 h-48 flex items-center justify-center bg-[#111] rounded-3xl border border-white/5 p-10 hover:bg-[#151515] hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl shadow-purple-900/10">
            <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible">
              <path d="M 12 6 V 34 M 12 6 H 22 L 32 16 V 24 L 22 34 H 12" fill="none" stroke="url(#grad-main)" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#glow-sm)"/>
              <circle cx="22" cy="6" r="3.5" fill="#111" stroke="url(#grad-main)" strokeWidth="3" />
              <circle cx="32" cy="16" r="3.5" fill="#111" stroke="url(#grad-main)" strokeWidth="3" />
              <circle cx="32" cy="24" r="3.5" fill="#111" stroke="url(#grad-main)" strokeWidth="3" />
              <circle cx="22" cy="34" r="3.5" fill="#111" stroke="url(#grad-main)" strokeWidth="3" />
              <circle cx="12" cy="20" r="3.5" fill="url(#grad-main)" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">1. "Node D"</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-[280px]">D harfi va Tarmoq tugunlarining ideal uyg'unligi. Eng zo'r gibrid.</p>
          </div>
        </div>

        {/* Concept 2 */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-48 h-48 flex items-center justify-center bg-[#111] rounded-3xl border border-white/5 p-10 hover:bg-[#151515] hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl shadow-cyan-900/10">
            <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible">
              <rect x="6" y="22" width="12" height="12" rx="4" fill="none" stroke="url(#grad-main)" strokeWidth="3.5" filter="url(#glow-sm)" />
              <rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="url(#grad-main)" strokeWidth="3.5" filter="url(#glow-sm)" />
              <rect x="22" y="22" width="12" height="12" rx="4" fill="none" stroke="url(#grad-main)" strokeWidth="3.5" filter="url(#glow-sm)" />
              <path d="M 28 3 Q 28 12 37 12 Q 28 12 28 21 Q 28 12 19 12 Q 28 12 28 3 Z" fill="url(#grad-alt)" filter="url(#glow)" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">2. "Grid & Spark"</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-[280px]">Modullar (Grid) va Sun'iy Intellekt (Uchqun) kombinatsiyasi.</p>
          </div>
        </div>

        {/* Concept 3 */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-48 h-48 flex items-center justify-center bg-[#111] rounded-3xl border border-white/5 p-10 hover:bg-[#151515] hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl shadow-blue-900/10">
            <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible">
              <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="none" stroke="url(#grad-main)" strokeWidth="2.5" filter="url(#glow-sm)" strokeLinejoin="round" />
              <polygon points="20,6 31,12 31,28 20,34 9,28 9,12" fill="none" stroke="url(#grad-main)" strokeWidth="1" strokeLinejoin="round" opacity="0.5" />
              <path d="M 16 13 V 27 M 16 13 H 20 A 7 7 0 0 1 20 27 H 16" fill="none" stroke="url(#grad-alt)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">3. "Hexa D"</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-[280px]">Kiber-xavfsizlik va strukturani ifodalovchi Hexagon ichidagi "D".</p>
          </div>
        </div>

        {/* Concept 4 */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-48 h-48 flex items-center justify-center bg-[#111] rounded-3xl border border-white/5 p-10 hover:bg-[#151515] hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl shadow-pink-900/10">
            <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible">
              <path d="M 28 8 C 36 8 36 20 28 20 H 12 C 4 20 4 32 12 32 H 28" fill="none" stroke="url(#grad-main)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-sm)" />
              <path d="M 12 32 C 4 32 4 20 12 20 H 28 C 36 20 36 8 28 8" fill="none" stroke="url(#grad-alt)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" filter="url(#glow)" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">4. "Infinity Loop"</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-[280px]">C va D harflarini hosil qiluvchi uzluksiz cheksizlik (Infinity) chizig'i.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
