# DevCommons — Rivojlantirish va Boshqaruv Rejasi (Roadmap)
**Asosiy Shior (Tagline):** *DevCommons — Shared library for code, prompts & AI workflows*  
*(Kod, promptlar va AI ish jarayonlari uchun umumlashtirilgan ochiq kutubxona)*

---

## 🧭 1. Asosiy Diagnostika va Strategik Yonalish (Og'riq nuqtasi)

| Muammo | Sababi |
| :--- | :--- |
| **Kod snippet ko'chirib olish qiymati pasaymoqda** | AI agentlar (Cursor, Claude Code, Windsurf, GitHub Copilot) kodni real vaqtda o'zi yozib va generatsiya qilmoqda — tayyor snippet qilib nusxa ko'chirishga ehtiyoj tez kamaymoqda. |
| **Prompt & Context Engineering keskin o'smoqda** | Barcha dasturchilar AI'ni loyihasiga qo'llayapti, ammo AI qoidalari va promptlar turli joyларда (Notion, Gist, lokal fayllar, eslatmalarda) tarqaq va samarasiz saqlanmoqda. |
| **Kontekst Fragmentatsiyasi** | Dasturchilar sifatli AI kontekstlari, `.cursorrules` va maxsus ko'rsatmalarni yig'uvchi markaziy ochiq maydon tapmayaptilar. |

**Strategik Yechim:**  
DevCommons platformasining yo'nalishini shunchaki *"kod snippet kutubxonasi"* (code snippet library) doirasidan chiqarib, **"AI Workflow & Context Infratuzilmasi Markazi"**ga (AI workflow / context infrastructure) siljitamiz. Platformamiz AI ko'rsatmalari, murakkab agent qoidabeskichlari (rules) va ishonchli arxitektura yechimlarini jamlab, versiyalab hamda ulashiluvchi birinchi raqamli ochiq ekotizimga aylanadi.

---

## 🗺️ 2. To'liq Rivojlantirish Bosqichlari (Ish Rejasi)

### ⚡ FAZA 1 — Fundamentni Yangilash va Agent-Config Qo'shish (Eng yuqori ustuvorlik)
*Maqsad: Dasturchilardagi eng og'ir muammo bo'lgan "AI Kontekst Fragmentatsiyasi"ni darhol yechib berish.*

- [ ] **Agent-Config Fayl Turlarini Qo'llab-Quvvatlash:** Oddiy kod bo'lagidan tashqari, AI Agent dasturiy qoidalarini alohida toifa sifatida qo'shish va maxsus sintaksis nurida kodi ranglarida ajratib ochinglash:
  - `.cursorrules` (Cursor IDE maxsus ko'rsatmalari)
  - `CLAUDE.md` / `AGENTS.md` / `AI.md` (Claude va boshqa Agentlar qoiya qo'llanmalari)
  - `.windsurfrules` (Windsurf IDE qoidalari)
- [ ] **Avtomatik Aniqlash va Maxsus Belgilar (Badges):** Yuklanyatgan fayl qopqoq turini ko'rilgandan avto-shakilda ochiqlash va ko'rinarli belgi plakatlari qo'yish (masalan: *⚡ Cursor Rule*, *🤖 Claude Config*).
- [ ] **Prompt va Qoidalarni Versiyalash (Versioning):** Barcha kontentlarga tarix sahnasi qatlamlari ulab, `v1`, `v2`, `v3` ko'rinishida ko'rina yitgunchilik hamda o'zgartirish joylari diff o'ynash (taqqoslash) imkonini yaratish.
- [ ] **"Fork" va "Ishlatilingalik Soni" Statistika Tizimi:** Sifatni baholaganda faqatgina oddiy "Like"lar emas, balki real qaysidir boshqa muhandis foydalandan burchakka tortilgani — "Fork va Used Count" darajadorligini reyting hisobida yukori tutingish.
- [ ] **SEO & OpenGraph Optimallashtirish:** Har bir rule, prompt yoki skill paketi uchun alohida Google robotlar o'qiytganda o'z-o'zidan bir biriga qulaysiz yortirilmaydigan, Twitter va Telegramlarda ajoyib rasmlar bo'rtaluvida chiqadi o'lchov OG Kartalarni uzi oqlatishlash.
- [ ] **Ikki Tillilik Tizimi (UZ + EN):** Rus tili ruxsatlaridan olinsach, interfeysda asosiy va silliqlamchi qulaylik darajadosh faqat toza O'zbek tili hamda Global Ingliz tili qoplamali qatlamida faola qoldiriladi.

---

### 🔥 FAZA 2 — Interaktiv va Farqlantiruvchi Funksiyalar (O'rta murakkablik)
*Maqsad: Foydalanuvchilarni uzoqroq ushlash, sinamas va ishonchli resurs ekanini isbotlash.*

- [ ] **Prompt Playground (Sinov Derazasi):** Sayyodamimiz ichini o'ng burchagidagi turgan joyning o'zida prompt va rule larni haqiqiy LLM (Anthropic / OpenAI / DeepSeek kabi) modellariga jo'natib real vaqt sinovidan otishtirgich qulagan laboratoriyachasi.
- [ ] **Prompt Chain (Zanjir) va Ish O'qimi (Workflow):** Bitta oddiy so'z o'g'riga emas, balki bir nechta ko'zgu-poyalamchi izmat o'zakdarlar kaskadini ketma-ket bir vaqt ichiga tirizish — to'liq Zanjirlanish tizimi.
- [ ] **Skill Paketlari (Bundles):** Bir nechta turli zarur kontentlarni bitta idishga solinish (masalan: 1 ta ishlashi kafolatli kod + 1 ta `.cursorrules` + 1 ta AI System Prompini umumlashtirilgan to'plovchi *Skill Pack* ko'zamo'tishida ulashish.
- [ ] **"Verified" (Sinovdagan O'tdingan) Namunaviy Belgisi:** Jamlama mualliflari tomonidan amaldar loyihada haqiqatdaman hallutsiyatsiya bop bo'tmaganda ko'zdan tasdiqdan kechirgan xazina resurlariga yuqora ishonch tamg'achasi beryash.
- [ ] **Sifatga Asoslangina Gamifikatsiya:** Dasturchiga baxo darajash taqdim aylanayib turingida unning shunchaki oqlagan sonlari emas, "Qanchaki Fork qilip loyiha saroyida ishga to'tirdi?" mezoni bo'yicha haftalik (Weekly) hamda oylik (Monthly) Leaderboard tepaligilar tiklanadi.

---

### 🔌 FAZA 3 — Agent va Terminal Integratsiyasi (Yuqori murakkablik - Eng Katta Raqobatchilik G'alabehisi)
*Maqsad: DevCommons o'jar bazasi har bir dasturchining IDE darichasiga va shaxsh terminal muhiti uzukiga oson moslangach olib boryanishi!*

- [ ] **DevCommons CLI Vositasini Barpo Eting:** Terminaldan shunday yod etak bilan buyrug' berib yettirilish qoidalari yuklab qo'yilish tizimining tayinlashari:
  - `devcommons pull <id|nom>` — tanlangan prompt / rule ni loyihanig root (ildiz) papkasida birdanoziga yulivolib kirtib yo'li borish.
  - `devcommons push` — yangilangan konfiplarni qayta DevCommons hisobi boragacha tepab berib turilishi!
- [ ] **VS Code va Cursor Extensioni:** Ragaqam va Dasturlar o'rnining bir boqchi o'kildan turib, Cursor yon burchagidek "Search in DevCommons" derazasidan so'rarganda qulib birdan ulanatdan Rasmiy Kengaytma!
- [ ] **Claude Code va Claude Desktop (MCP Server):** Model Context Protocol ulamchilari bilan saytdan avto shavq-yo'riq ta'sischalardan yoritivolib o'quvin ulab keta beringishchi shifosi.
- [ ] **Ochiq Developer API Endpoint: ** Tashqaridak ko'ringan muhandis yoki ukinchi taraflab yaratiluchu boshqa AI ilovachilar bizdan ma'lumot olarli moliya cheklovlaridagi API ro'yatlar (Rate-limit tizimi) kiritadi.
- [ ] **GitHub Sinxronizatsiya Tizimi:** Kontent GitHub reponi qator bop bo'yisha, unning haqiqatdan qalin daralgan Yulduzla soni (Stars) va Fork darajalari sahifaga uyatdaman ko'chiqib yangilani bitishi.

---

### 💼 FAZA 4 — Jamoaviy Kutubxonalar va Monetizatsiya (Kengayish bosqichi)
*Maqsad: Loyihamizning doimiy o'sib bora olish iqtisodiy asoslari va korporativ muhitlarga zarbalamcha zarur ishonchi.*

- [ ] **Jamoaviy (Team Workspace) Kutubxonalar:** Korxonada faoliyat olingandir Dasturchilar Jamoaligigina o'ng doiralaridaman foydalatuvchi Xususiy (Private) AI qaytdoshlar va amaliy koding yechim kancelyariysi yopishiladi! (Owner, Editor, Viewer ruxsatur boshgirdolari bilan).
- [ ] **B2B Tashkilotlar Tarif Tizimchilar:** Kattaroq dastur korxona shabashchilariga markaziy oylangan Prompt qulay kantselliyaligimiz taqdir etiladigan narhli shifoxonalar!
- [ ] **Dasturchilarda Mualliflarni Qo'llash Modali (Sponsor/Tipping):** ENG zambak yodlar promptlar yaratguci mutafaxxirlar hisob tepasidan biron "Buy Me a Coffee" moliya homiyligicha ovoz bergani homiy pulchalar tashlamashi imkoni yaratiladi!
- [ ] **Verified Premium Skills Bozori:** Uzoq-olis maqsadlarda — O'TKA SIFATLI eng silliq va qiylik Vibe-coding protokollamatchilar bozordan hamrohlar uya qop uyi qoplap olish maydoni qo'lyigilar.

---

## 🛠️ 3. Texnik Eslatmalar va Architecture Asoslari
1. **Bizning Yorqin Texnoligik Stack'imiz:** *Next.js 14 App Router + Supabase PostgreSQL + Tailwind CSS + Next-Intl (EN+UZ)*! Hech bir bo'g'inda boshqatdan boshlanganda yoki ko'tarilib backend o'rnatmasayoq loyiha butalanishi bo'lishingiza ko'rsatyapti!
2. **Database Schema Evolyusiyasi:** Hozirgi Supabase postgres strukturadaman faqat yozganimiz kabi "content_type" oqini maydoni kiritamiz (`'snippet' | 'prompt' | 'rule' | 'skill'`) va shu kabi bitta sxema ustida barcha innovatseon ochiqliklarga shaffof bo'yoza chiqatdimiz!
3. **No-Shift va Estetik Sifatsiyalar:** Har bir o'chirgan faslda "No-Shift" (qo'pol tushib qiyshayamashi sakragandan saqlaniş) hmada kaskad Neon tungi joziba talabini 100% tayaniladi!

---

## 🏆 4. Ustuvorlik Bo'yicha Boshqariluvining Oqilona Navbati

| Ustuvorlik | Bosqich Nomi | Sababi va Keltiradigan Nafi |
| :---: | :--- | :--- |
| **1** | **FAZA 1 — Agent-Config turlari (`.cursorrules`, `CLAUDE.md`) + Versiyalay va Badgellar!** | **Eng Tez, Eng Zararkon, Eng Zardobli G'alabar:** Darhol "Vibe Coderlar"da mavjud eng og'ir muammoni yechadi va platformani zırtib porlaydi! |
| **2** | **FAZA 2 — Prompt Playground va Ish O'qimi (Workflow Zanjiri)** | Bizni oddiy kopyalama resurlardan ajratib kaskadiylar o'saman maydonga chaqirtirivoladi! |
| **3** | **FAZA 3 — DevCommons CLI Vosita va Cursor/VS Code Kengaytmalari** | Hozirgacha hech qanday bozori qilalmasdagan **ENG ULAK MOAT (Raqobatdan Himoyalanar) Hoshiyaning kantseliya** shaklashi! |
| **4** | **FAZA 4 — Jamoalar va Monetizatsiya tizimlashi** | Baza yetarli saroyga qator yetilganda keyinchalligi barpo etila qator moliyalashtirilish! |
