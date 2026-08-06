<div align="center">
  <img src="public/new-logo.png" alt="DevCommons Logo" width="120" height="120">
  <h1 align="center">DevCommons 🚀</h1>
  <p align="center">
    <strong>An Open-Source Hub for Code Snippets, Live Code Execution, and AI Prompts</strong><br>
    <em>Empowering developers and AI engineers globally to share, test, and innovate together.</em>
  </p>

  <p align="center">
    🌐 <b>English</b> | <a href="README.uz.md">🇺🇿 O'zbek</a>
  </p>

  <p align="center">
    <a href="https://github.com/OgabekHub/devcommons/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js"></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase" alt="Supabase"></a>
    <a href="https://github.com/OgabekHub/devcommons/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/AI_PRs-Welcomed_%F0%9F%A4%96-8A2BE2" alt="AI PRs Welcome"></a>
    <a href="https://devcommons.vercel.app"><img src="https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel" alt="Vercel"></a>
  </p>

  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quickstart">Quickstart</a> •
    <a href="CONTRIBUTING.md">Contributing</a> •
    <a href="README.uz.md">🇺🇿 O'zbekiston</a>
  </p>
</div>

---

## 🌟 About The Project

**DevCommons** is a state-of-the-art open-source platform designed for the global software development and AI engineering community. It allows engineers to effortlessly organize, discover, live-test, and distribute high-performance **Code Snippets** and production-ready **AI Prompts** (for ChatGPT, Claude, Gemini, and deep research agents).

Originally seeded with love by Uzbekistan's thriving engineering ecosystem, DevCommons is built from day one for international scale with full localization across 3 languages, high-precision typography, and zero-layout-shift design architecture.

---

## ✨ Features

- 🖥️ **Monaco Code Editor:** Powerful VS Code-powered editing experience with intelligent syntax highlighting and keybindings.
- ⚡ **Sandpack Live Preview:** Execute React, Node.js, TypeScript, or Vanilla JavaScript code directly inside your browser without local server setup!
- 🤖 **AI Prompts & Quick Templates:** 6+ one-click architectural boilerplate templates (React Components, Next.js API Routes, Express Servers, Python FastAPI, Dockerfiles, SQL schemas).
- 🎨 **Zero-Shift Premium UI/UX:** Crafted with strict visual consistency—no jittery layout jumps or distracting transformations during hover states. Pure glassmorphism and modern dark aesthetic.
- 🌍 **Internationalization (i18n):** Seamlessly switch between **English**, **Uzbek (O'zbek)**, and **Russian (Русский)** with complete URL-routed localization via `next-intl`.
- 📊 **Vercel-Style Developer Profiles:** Comprehensive metrics, public tabs, activity stats, and bookmarked collections designed for professional sharing.
- 🔐 **GitHub Auth & API Keys:** Single-click OAuth authentication via Supabase with custom developer API token management.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, SSR & React Server Components)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Github OAuth)
- **Styling & Tokens:** Vanilla CSS & Tailwind CSS (Custom design system with strict zero-jitter primitives)
- **Code Engines:** `@monaco-editor/react`, `@codesandbox/sandpack-react`, PrismJS
- **Internationalization:** `next-intl`
- **UI Animation & Icons:** `framer-motion`, `lucide-react`

---

## 🚀 Quickstart Guide

Running DevCommons locally for testing, learning, or contributing takes less than 3 minutes:

### 1. Clone the repository
```bash
git clone https://github.com/OgabekHub/devcommons.git
cd devcommons
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (`.env.local`)
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Start the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`. Welcome to **DevCommons**!

---

## 🤝 Contributing & "AI PRs Welcome!"

We welcome developers, designers, and AI engineers of all backgrounds to join our community and submit contributions! 

> **🤖 AI / Vibe-coded PRs strictly welcomed and encouraged!**
> Whether you code by hand or leverage autonomous AI coding agents (Claude Dev, Antigravity, Cursor, Devin, ChatGPT), we gladly accept high-quality, verified Pull Requests!

Before submitting, please read our concise [CONTRIBUTING.md](CONTRIBUTING.md) guide to familiarize yourself with our **Zero-Shift UI guidelines** and strict build verification process.

---

## 📝 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

> Last updated: 2026-08-06
