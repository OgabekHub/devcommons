# 🤝 Contributing to DevCommons

Thank you for your interest in contributing to **DevCommons**! We welcome bug fixes, documentation improvements, translation expansions, new feature proposals, and high-performance code snippets or AI prompt templates from engineers of all backgrounds globally.

---

## 🤖 AI / Vibe-Coded PRs Strictly Welcomed! 🚀

We actively celebrate modern AI-assisted engineering!
> **Pull Requests created with autonomous AI agents (Claude Dev, Google Antigravity, Cursor, Devin, ChatGPT, OpenClaw tools, etc.) are strictly welcomed and actively encouraged in this repository!**

Whether you write every line of code by hand or guide an AI agent via prompt engineering ("vibe-coding"), we value the **quality, cleanliness, and functional impact** of your Pull Request. 

---

## 🛠️ Engineering Standards & Rules

Before submitting a Pull Request, please verify adherence to our two foundational technical standards:

### 1. 🛑 ZERO LAYOUT SHIFT POLICY (No-Shift UI/UX)
DevCommons follows an ultra-clean visual design standard inspired by Vercel and Apple:
- **STRICTLY PROHIBITED:** Avoid adding layout-shifting properties during hover or interactive states (e.g., `transform: translateY(-2px)`, `scale(1.02)`, or changing border-width on hover). This causes unwanted subpixel jitter and visual displacement of surrounding cards and icons.
- **ENCOURAGED:** Use clean color transitions (`transition-colors duration-200`), background brightness changes (`hover:bg-white/5`), or glowing shadow effects (`hover:border-brand/50`, shadow glows) that do not alter spatial geometry.

### 2. 🧪 TypeScript Strict Mode & Zero-Error Builds
This codebase enforces strict TypeScript safety (`noUnusedLocals: true`, `noUnusedParameters: true`, `noUncheckedIndexedAccess: true`).
- Do not leave unused variable declarations or dead imports.
- Always verify that your changes compile cleanly before opening a PR by running:
  ```bash
  npm run build
  ```
  If `npm run build` exits cleanly with `✓ Compiled successfully` and zero TypeScript errors, your code is ready for review!

---

## 🌍 Localization (i18n)

DevCommons supports 3 core languages via `next-intl`: **English (`en.json`)**, **Uzbek (`uz.json`)**, and **Russian (`ru.json`)**.
If you are adding new UI buttons, labels, or toasts, please add the translation keys to all three JSON registries located inside the `/messages` directory.

---

## 🔄 Contribution Workflow (Step-by-Step)

1. **Fork the Repository:** Click the "Fork" button in the top right of this page.
2. **Clone Your Fork Locally:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/devcommons.git
   cd devcommons
   ```
3. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
   *(Use standard prefix naming: `feat/`, `fix/`, `docs/`, `refactor/`)*
4. **Make & Test Your Changes:**
   Ensure `npm run build` executes without errors.
5. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature or translation"
   git push origin feat/your-feature-name
   ```
6. **Open a Pull Request:**
   Navigate back to `OgabekHub/devcommons` and click **New Pull Request**. Fill out the simple PR checklist, sit back, and relax!

We will review your PR promptly. Thank you for making DevCommons better for software developers everywhere! 🎉
