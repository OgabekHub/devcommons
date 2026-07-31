<div align="center">
  <img src="public/new-logo.png" alt="DevCommons Logo" width="120" height="120">
  <h1 align="center">DevCommons 🚀</h1>
  <p align="center">
    <strong>Dasturchilar va AI muhandislari uchun ochiq resurslar, kod snippetlari hamda prompt'lar platformasi</strong><br>
    <em>An open-source hub for developer code snippets, live previews, and high-performance AI prompts.</em>
  </p>

  <p align="center">
    <a href="https://github.com/OgabekHub/devcommons/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js"></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase" alt="Supabase"></a>
    <a href="https://github.com/OgabekHub/devcommons/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/AI_PRs-Welcomed_%F0%9F%A4%96-8A2BE2" alt="AI PRs Welcome"></a>
  </p>

  <p align="center">
    <a href="#-xususiyatlar--features">Xususiyatlar</a> •
    <a href="#-texnologiyalar">Texnologiyalar</a> •
    <a href="#-tezkor-ornatish--quickstart">O'rnatish</a> •
    <a href="CONTRIBUTING.md">Hissa Qo'shish</a>
  </p>
</div>

---

## 🌟 Loyiha Haqida | About The Project

**DevCommons** — bu zamonaviy IT jamoatchilik uchun mo'ljallangan 100% ochiq manbali platforma hisoblanadi. Dasturchilar o'zlarining kundalik hayotida ko'p ishlatiladigan eng samarali **kod snippetlarini (Code Snippets)**, ularning **jonli ishga tushirilib tekshirish mexanizmini (Live Preview)** va **ChatGPT / Claude / Gemini AI Prompt'larini** bepul almashishadi.

---

## ✨ Xususiyatlar | Features

- 🖥️ **Monaco Code Editor:** VS Code tajribasi asosidagi kuchli va interaktiv kod muharriri.
- ⚡ **Sandpack Live Preview:** React, Node.js yoki Vanilla kodi bo'lmasdan turib, bevosita brauzernigida o'nline ishga tushirish imkoniyati!
- 🤖 **AI Prompts & Quick Templates:** 6+ xil eng mashhur tayyor arxitektura shablonlari (React, Next.js API, Express, FastAPI, Docker, SQL) bir zumda avtomatik to'ldirib beriladi.
- 🎨 **No-Shift Premium UI/UX:** Vercel va GitHub o'lchovlaridan ilgari kelgan mukammal hover dizayni (zero layout shifting, subpixel jitter'larsiz silliq tajriba).
- 🌍 **3 Xil Til Qo'llanishi (i18n):** Tizim to'liq **O'zbek**, **Ingliz** va **Rus** tillarida lokalizatsiya qilinib optimallashtirilgan.
- 📊 **Vercel-style Boshqaruv Kartalari:** Shaxsiy va ochiq a'zolashuvchi sahifalarda aniq ko'rinish va oqimlilik.
- 🔐 **GitHub Auth & API Keys:** Bir bosishda autentifikatsiya qilish va developer API kalitlarini yechib berish zanjiri.

---

## 🛠️ Texnologiyalar | Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router & SSR)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, RLS, Auth)
- **Styling:** Vanilla CSS & Tailwind CSS (Custom Tokens, Glassmorphism, Zero-jitter primitives)
- **Editor & Runners:** `@monaco-editor/react`, `@codesANDBOX/sandpack-react`
- **Localization:** `next-intl`
- **Animation & Icons:** `framer-motion`, `lucide-react`

---

## 🚀 Tezkor O'rnatish | Quickstart Guide

Loyihani o'z kompyuteringizda ishga tushirish (yoki unga rasiyka taklif qo'shish) uchun bor-yo'g'i quyingni bajarishingiz kifoya:

### 1. Loyihani yuklab ko'zga oling (Clone Repo)
```bash
git clone https://github.com/OgabekHub/devcommons.git
cd devcommons
```

### 2. Kutubxona paketlarini o'rnating (Install Dependencies)
```bash
npm install
```

### 3. Env sirlilik fayllarini sozlang (`.env.local`)
Loyihangiz ildizida `.env.local` fayli ochilsiz hamda Supabase o'nline muhitingizdagi url va parollarini o'rnating:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Lokal Serverda yod yuritish! (Run Development Server)
```bash
npm run dev
```
Brakingizda `http://localhost:3000` manzilida **DevCommons** ishona ravshan ochiydi!

---

## 🤝 Hissa Qo'shish va "AI PRs Welcome!"

Biz har qanday turdagi hamkorona me'yor yigit va qizlarini xush ko'radi hamda takliflar topshirishga taklif qilinadi! 
> **🤖 AI / Vibe-coded PRs strictly welcomed and encouraged!** 
> Loyihaga foyda berishingiz uchun AI yordamchilardan (Claude, Antigravity, Cursor, ChatGPT) foydalanib yuritishingizdan quvonamiz! 

Batafsil qoidalarga va dizayn barqarorligi qadamlariga rasmiy [CONTRIBUTING.md](CONTRIBUTING.md) ko'rsatuvimizdan to'liq tanishingizni maslahat qilamiz.

---

## 📝 Litsenziya | License

Bu respublika doirasidagi harakatlar **MIT Litsenziyasi** asosining barcha qobiliyatchilar uchun 100% ochiq, erkinlik huquqlarga tayanadi.
