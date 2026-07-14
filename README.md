# DevCommons

Dasturchilar uchun ochiq kod snippet va AI prompt hub'i.

## Ishga tushirish

1. Dependencies o'rnatish:
   ```bash
   npm install
   ```

2. `.env.example` faylini `.env.local` ga nusxalab, Supabase ma'lumotlarini kiriting:
   ```bash
   cp .env.example .env.local
   ```

3. Supabase'da `supabase/schema.sql` faylini SQL Editor orqali ishga tushiring.

4. Dev serverni ishga tushirish:
   ```bash
   npm run dev
   ```

## Struktura

```
devcommons/
├── src/
│   ├── app/           # Sahifalar (App Router)
│   │   ├── snippets/  # Kod snippet'lar
│   │   ├── prompts/   # AI prompt'lar
│   │   └── auth/      # Autentifikatsiya
│   ├── components/    # Qayta ishlatiladigan komponentlar
│   ├── lib/           # Supabase client va helper'lar
│   └── types/         # TypeScript tiplari
└── supabase/
    └── schema.sql      # Database schema
```

## Keyingi qadamlar

- [ ] GitHub OAuth sozlash (Supabase Auth)
- [ ] Snippet/Prompt qo'shish formasi
- [ ] Qidiruv va tag filter
- [ ] User profil sahifasi
