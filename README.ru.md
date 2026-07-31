<div align="center">
  <img src="public/new-logo.png" alt="DevCommons Logo" width="120" height="120">
  <h1 align="center">DevCommons 🚀</h1>
  <p align="center">
    <strong>Открытая платформа для обмена сниппетами кода, живого исполнения и AI промптов</strong><br>
    <em>Объединяем разработчиков и AI-инженеров со всего мира для совместного создания инноваций.</em>
  </p>

  <p align="center">
    <a href="README.md">🌐 English</a> | <a href="README.uz.md">🇺🇿 O'zbek</a> | <b>🇷🇺 Русский</b>
  </p>

  <p align="center">
    <a href="https://github.com/OgabekHub/devcommons/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js"></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase" alt="Supabase"></a>
    <a href="https://github.com/OgabekHub/devcommons/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/AI_PRs-Welcomed_%F0%9F%A4%96-8A2BE2" alt="AI PRs Welcome"></a>
  </p>
</div>

---

## 🌟 О Проекте

**DevCommons** — это современная платформа со 100% открытым исходным кодом, созданная для глобального сообщества IT-специалистов. Она позволяет инженерам удобно хранить, находить, запускать прямо в браузере (Live Preview) и делиться полезными **сниппетами кода**, а также проверенными **AI промптами** для ChatGPT, Claude и Gemini.

Изначально зарожденная в инженерном сообществе Узбекистана, платформа ориентирована на глобальную аудиторию и полностью локализована на 3 языка.

---

## ✨ Возможности

- 🖥️ **Monaco Code Editor:** Мощный редактор на базе VS Code с интеллектуальной подсветкой синтаксиса.
- ⚡ **Sandpack Live Preview:** Запуск и тестирование React, Node.js или Vanilla JS кода прямо внутри вашего браузера без необходимости локальных серверов!
- 🤖 **AI Промпты и быстрые шаблоны:** 6+ популярных шаблонов (React-компоненты, Next.js API, Express, FastAPI, Docker, SQL) в один клик.
- 🎨 **Без джиттера (Zero-Shift UI/UX):** Изумительный современный дизайн в стиле Vercel — без прыжков элементов при наведении и анимаций сдвига.
- 🌍 **Мультиязычность (i18n):** Полная поддержка **Английского**, **Узбекского (O'zbek)** и **Русского (Русский)** языков на базе `next-intl`.
- 📊 **Профили разработчиков:** Статистика, личные коллекции и публичный шеринг в стиле Vercel.
- 🔐 **GitHub Auth & API ключи:** Быстрая авторизация в 1 клик через OAuth и генерация токенов для разработчиков.

---

## 🛠️ Технологический Стек

- **Фреймворк:** [Next.js 14](https://nextjs.org/) (App Router, SSR & React Server Components)
- **База данных и Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security)
- **Стилизация:** Vanilla CSS & Tailwind CSS (Кастомная дизайн-система с нулевой вибрацией)
- **Редакторы:** `@monaco-editor/react`, `@codesandbox/sandpack-react`
- **Локализация:** `next-intl`
- **Анимация и Иконки:** `framer-motion`, `lucide-react`

---

## 🚀 Быстрый Старт

Запуск DevCommons на вашем компьютере для тестирования или контрибьюта занимает всего пару минут:

### 1. Склонируйте репозиторий
```bash
git clone https://github.com/OgabekHub/devcommons.git
cd devcommons
```

### 2. Установите зависимости
```bash
npm install
```

### 3. Настройте `.env.local`
Создайте файл `.env.local` в корне проекта и добавьте ключи Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Запустите сервер разработки
```bash
npm run dev
```
Откройте в браузере страницу `http://localhost:3000`!

---

## 🤝 Контрибьют и "AI PRs Welcome!"

Мы приветствуем разработчиков со всего мира и с радостью принимаем пул-реквесты (PR)!

> **🤖 AI / Vibe-coded PRs strictly welcomed!**
> Неважно, пишете ли вы код вручную или используете AI-агентов (Claude, Antigravity, Cursor, Devin, ChatGPT) — мы рады любым качественным, проверенным улучшениям!

Перед отправкой PR ознакомьтесь с коротким руководством [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📝 Лицензия

Распространяется по лицензии **MIT**.
