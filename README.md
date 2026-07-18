<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/code-2.svg" alt="DevCommons Logo" width="80" height="80">
  <h1 align="center">DevCommons</h1>
  <p align="center">
    <strong>Dasturchilar uchun ochiq resurslar va tajriba almashish platformasi</strong>
  </p>

  <p align="center">
    <a href="#xususiyatlar">Xususiyatlar</a> •
    <a href="#texnologiyalar">Texnologiyalar</a> •
    <a href="#o-rnatish">O'rnatish</a> •
    <a href="#loyihani-ishga-tushirish">Ishga Tushirish</a>
  </p>
</div>

---

## 🌟 Loyiha Haqida

**DevCommons** — bu dasturchilar o'zlarining foydali kod qismlari (snippets) va sun'iy intellekt (AI) uchun tayyorlagan samarali so'rovlarini (prompts) boshqalar bilan ulashishlari mumkin bo'lgan ochiq platforma. O'zbekistondagi dasturchilar hamjamiyatini rivojlantirish maqsadida yaratilgan.

## ✨ Xususiyatlar

- **Kod Snippetlari:** Turli dasturlash tillarida yozilgan tayyor kod qismlarini saqlash, izlash va ulashish.
- **AI Prompts:** ChatGPT, Claude va boshqa AI modellar uchun samarali so'rovlar bazasi.
- **Syntax Highlighting:** Kodlarni o'ziga xos ranglarda chiroyli formatda o'qish imkoniyati (PrismJS).
- **Qidiruv va Filtrlar:** Til, kategoriya va teglar bo'yicha tezkor qidiruv.
- **I18n (Ko'p tillilik):** Sayt to'liq O'zbek va Ingliz tillarida ishlaydi.
- **GitHub Auth:** Bir marta bosish orqali GitHub akkaunti yordamida tezkor ro'yxatdan o'tish.
- **Interaktiv Sayohat (Tour):** Yangi foydalanuvchilarga saytni qanday ishlatishni o'rgatuvchi qadam-baqadam yo'riqnoma.
- **Dark Mode:** Ko'zni charchatmaydigan, to'liq moslashtirilgan zamonaviy tungi rejim dizayni.

## 🛠 Texnologiyalar

Loyiha eng zamonaviy web texnologiyalar asosida qurilgan:

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **I18n:** [next-intl](https://next-intl-docs.vercel.app/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Tour:** [Driver.js](https://driverjs.com/)
- **Syntax Highlighting:** [PrismJS](https://prismjs.com/)
- **Analytics:** Vercel Speed Insights & Web Analytics

## 🚀 O'rnatish

Loyihani o'z kompyuteringizda ishga tushirish uchun quyidagi qadamlarni bajaring:

### 1. Repozitoriyni klonlash
```bash
git clone https://github.com/OgabekHub/devcommons.git
cd devcommons
```

### 2. Kutubxonalarni o'rnatish
```bash
npm install
```

### 3. Muhit o'zgaruvchilarini sozlash
`.env.example` faylidan nusxa olib, yangi `.env.local` faylini yarating:
```bash
cp .env.example .env.local
```
Fayl ichidagi Supabase API kalitlari (URL va ANON KEY) ni o'zingizning [Supabase](https://supabase.com) loyihangiz ma'lumotlari bilan almashtiring.

### 4. Ma'lumotlar Bazasini Sozlash (Supabase)
Supabase SQL Editor orqali `supabase/schema.sql` fayli ichidagi kodni ishga tushiring. Bu kerakli jadvallar va RLS (Row Level Security) qoidalarini yaratadi.

## 💻 Loyihani Ishga Tushirish

Dev serverni ishga tushirish uchun:
```bash
npm run dev
```
Brauzeringizda [http://localhost:3000](http://localhost:3000) manziliga o'ting.

## 📁 Loyiha Strukturasi

```bash
devcommons/
├── src/
│   ├── app/           # Sahifalar va marshrutlar (App Router)
│   ├── components/    # Qayta ishlatiladigan UI komponentlar
│   ├── i18n/          # Tarjima va til sozlamalari
│   ├── lib/           # Yordamchi funksiyalar va Supabase client
│   └── types/         # TypeScript tiplari
├── messages/          # Tarjima lug'atlari (en.json, uz.json)
├── supabase/          # SQL schemalar va migratsiyalar
└── public/            # Rasmlar va statik fayllar
```

## 🤝 Hissa Qo'shish

Biz loyihaga hissa qo'shmoqchi bo'lgan barcha dasturchilarni qo'llab-quvvatlaymiz! 
1. Repozitoriyni **Fork** qiling.
2. O'zgartirishlaringizni yangi branchda bajaring (`git checkout -b feature/YangiImkoniyat`).
3. Kodni Commit qiling (`git commit -m 'Yangi imkoniyat qo'shildi'`).
4. Branchga Push qiling (`git push origin feature/YangiImkoniyat`).
5. **Pull Request** oching!

---
<div align="center">
  O'zbekiston 🇺🇿 dasturchilari tomonidan mehnat va mehr bilan yozildi ❤️
</div>
