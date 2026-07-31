# 🤝 DevCommons Loyihasi uchun Hissa Qo'shish Qo'llanmasi (Contributing Guide)

**DevCommons** respositoryasiga tashakkur! Biz har qaysi darajadagi dasturchi kadrining kiritayotgan foydali taklif, xatolikni barlamali tuzatishi yoki yangi funksiyaviy kod o'tkazishlarini cheksiz xush ko'rib olqishlaymiz! 

---

## 🤖 AI / Vibe-Coded PRs Strictly Welcomed! 🚀

Biz kelajakning silliq texnologiyalar zanjirini olqishlovchi ochiq jamoatimiz! 
> **Siz AI agentlar (Claude Dev, Antigravity, Cursor, Devin, ChatGPT va h.k.) dan foydalanib yozilgan har qanday xoli, sifatli va testdan o'tuvchi Pull Request (PR) yubormishingizga mutlaqo ruxsat berilamiz hamda rasm qiziqasiga qamrash qilinuvchi ruxsat ostidagi motivasiyamiz bor!**

Bizga muhimi – inson tomonidan bitta bitta harflab qo'lda kiritildimi yo AI ko'chirib tez kiritdingizmi qat'inazar, uning **sifati, qoidalarga mosligi va xatolamsiz qurilishidir (Clean build)**.

---

## 🛠️ Hissa qo'shuvining eng muhim Qonuniyatlari (Engineering Guidelines)

PR yubormazingizdan oldin biz qattiq amal qilinish kerak deb belgilovchi 2 ta oliy qoidalarni ko'zdan ko'tarasiz:

### 1. 🛑 NO-SHIFT UI/UX QOIDASI (Zero Layout Shift on Hover!)
Platformamiz ko'rinishi **"Vercel va Apple stsenariysi kabi sakramaydab silliq turishi"** zaruriydir:
- **Taqiq etiladi:** Hech bir karta (`.card`), tugma yoki elementlarda hover qilinganda `transform: translateY(-1px)`yoki sakrash yig'indilari o'tkazilmaslikka buyriladi. Hover vaqtida uning o'zini o'zidan tepa-pasqa sakrashi bor yondirish qismlarini buzishga sabab bo'lardi!
- **Ruxsat etiladi:** Hover ko'rsatib yotilsang faqatgina ranglar (`bg-white/5`), chekkacha chiziq nuray (glow shadow yoki `border-brand/50`) va yorituv obyekti o'zgarsin. Harakat faqat `transition-colors` orqalidir o'tiladi.

### 2. 🧪 TypeScript Strict Mode va Build Tekshiruv
Loyihamiz oliq tsconfig konfida qat'iy mantiqlari o'tadi:
- `noUnusedLocals: true`, `noUnusedParameters: true`, `noUncheckedIndexedAccess: true`.
- Hech qanaqa keraksiz, ishlamaydab turgan `import` yig'ishga yoki qolip qoralanadigan o'zgaruvchilarga qo'ymasligingiz shart!
- Boshqalaga yo'l yollashga kod yo'llashingizdan avval **ALBATTA terminalga quyidagi tekshiruv yuritish lozim:**
  ```bash
  npm run build
  ```
  Agar o'sha buyruq `✓ Compiled successfully` va `Zero errors` bo'la olinsa – marhamam, PR ingizni xotirjamas jo'natuvga koring!

---

## 🔄 PR Jo'natilish Tizimi (Step-by-Step Guide)

Hissa qo'shuv qachon o'sadi va bu qanday kechishi bo'yicha 4 ta oson bosqich:

1. **Repodan o'z papkani zbekcha Fork ekin:**
   GitHub o'z sahifangiz burchakdagi **Fork** tugmasi orqali repo protokolini shaxsan ko'chiradi.
2. **Lokal shoxona (branch) a'zolash: **
   ```bash
   git checkout -b feat/add-your-feature
   ```
   (Yy xatosizlar, yangilar yechilingan ko'rinish kabi shartli nom bering: `feat/new-lang-theme`, `fix/mobile-navbar`).
3. **Kodni yakuniy ko'ring va Commit olib yoting:**
   ```bash
   git add .
   git commit -m "feat: add super useful AI prompt template and localization"
   git push origin feat/add-your-feature
   ```
4. **Pull Request (PR) yozasiz va qullatib topshirilgan olinadila:**
   Github yoritilganda **New Pull Request** qilib takliflaringiz bayonini jo'natingiz. Biz uni tekshirishdan yuvilmas va xushko'tarilgandan ko'chirma tarziga qatorga (Merge) quduvdan bo'lamiz! 

**Birinchi bo'lib qatnaganingiz yo qonuniyat ortidagi fidoyili harakatlar bori uchun RAHMAT! 🎉**
