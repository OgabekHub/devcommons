const fs = require('fs');
const newKeys = {
  Header: {
    saved: { en: 'Saved', ru: 'Сохраненное', uz: 'Saqlanganlar' },
    feed: { en: 'Feed', ru: 'Лента', uz: 'Lenta' },
    analytics: { en: 'Analytics', ru: 'Аналитика', uz: 'Analitika' },
    tags: { en: 'Tags', ru: 'Теги', uz: 'Teglar' }
  },
  Feed: {
    title: { en: 'Activity Feed', ru: 'Лента активности', uz: 'Faoliyat lentasi' },
    subtitle: { en: 'Recent activity from people you follow', ru: 'Недавняя активность людей, на которых вы подписаны', uz: 'Kuzatib turgan odamlaringizning so\'nggi faoliyati' },
    empty: { en: 'No activity yet', ru: 'Пока нет активности', uz: 'Hozircha faoliyat yo\'q' },
    empty_desc: { en: 'Visit other user profiles to follow them', ru: 'Посетите профили других пользователей, чтобы подписаться на них', uz: 'Boshqa foydalanuvchilarni kuzatish uchun ularning profiliga tashrif buyuring' }
  },
  Saved: {
    title: { en: 'Saved Items', ru: 'Сохраненные элементы', uz: 'Saqlanganlar' },
    subtitle: { en: 'All your saved snippets and prompts', ru: 'Все ваши сохраненные сниппеты и промпты', uz: 'Siz saqlab qo\'ygan barcha snippet va prompt\'lar' },
    empty: { en: 'Nothing saved yet', ru: 'Пока ничего не сохранено', uz: 'Hozircha hech narsa saqlanmagan' },
    discover: { en: 'Discover new items', ru: 'Изучайте новые материалы', uz: 'Yangi narsalarni kashf qiling' }
  },
  Tags: {
    title: { en: 'Tags', ru: 'Теги', uz: 'Teglar' },
    subtitle: { en: 'Browse by topic', ru: 'Просмотр по темам', uz: 'Mavzular bo\'yicha ko\'rish' },
    empty: { en: 'No tags found', ru: 'Теги не найдены', uz: 'Teg topilmadi' }
  },
  Analytics: {
    title: { en: 'Analytics', ru: 'Аналитика', uz: 'Analitika' },
    subtitle: { en: 'Your personal statistics', ru: 'Ваша личная статистика', uz: 'Sizning shaxsiy statistikangiz' },
    views: { en: 'Total Views', ru: 'Всего просмотров', uz: 'Jami ko\'rishlar' },
    votes: { en: 'Total Votes', ru: 'Всего голосов', uz: 'Jami ovozlar' },
    top_snippets: { en: 'Top Snippets', ru: 'Популярные сниппеты', uz: 'Eng mashhur snippetlar' },
    top_prompts: { en: 'Top Prompts', ru: 'Популярные промпты', uz: 'Eng mashhur promptlar' }
  },
  User: {
    back: { en: 'Back to home', ru: 'На главную', uz: 'Bosh sahifaga qaytish' },
    member_since: { en: 'Member since', ru: 'В клубе с', uz: 'dan beri a\'zo' },
    recent_snippets: { en: 'Recent Snippets', ru: 'Недавние сниппеты', uz: 'So\'nggi Snippets' },
    recent_prompts: { en: 'Recent Prompts', ru: 'Недавние промпты', uz: 'So\'nggi Prompts' },
    empty: { en: 'This user hasn\'t added anything yet', ru: 'Этот пользователь еще ничего не добавил', uz: 'Bu foydalanuvchi hozircha hech narsa qo\'shmagan' }
  },
  Components: {
    share: { en: 'Share', ru: 'Поделиться', uz: 'Ulashish' },
    copied: { en: 'Copied!', ru: 'Скопировано!', uz: 'Nusxalandi!' },
    follow: { en: 'Follow', ru: 'Подписаться', uz: 'Kuzatish' },
    following: { en: 'Following', ru: 'Вы подписаны', uz: 'Kuzatilmoqda' },
    embed: { en: 'Embed', ru: 'Встроить', uz: 'Embed' },
    embed_copy: { en: 'Copy Code', ru: 'Скопировать код', uz: 'Kodni nusxalash' },
    download: { en: 'Download', ru: 'Скачать', uz: 'Yuklab olish' },
    save: { en: 'Save', ru: 'Сохранить', uz: 'Saqlash' },
    saved: { en: 'Saved', ru: 'Сохранено', uz: 'Saqlandi' },
    comments: { en: 'Comments', ru: 'Комментарии', uz: 'Fikrlar' },
    comments_login: { en: 'Log in to comment', ru: 'Войдите, чтобы оставить комментарий', uz: 'Fikr qoldirish uchun tizimga kiring' },
    login: { en: 'Log in', ru: 'Войти', uz: 'Kirish' },
    comment_placeholder: { en: 'Write a comment...', ru: 'Написать комментарий...', uz: 'Fikr yozish...' },
    send: { en: 'Send', ru: 'Отправить', uz: 'Yuborish' },
    no_comments: { en: 'No comments yet. Be the first to share your thoughts!', ru: 'Пока нет комментариев. Будьте первым!', uz: 'Hozircha fikrlar yo\'q. Birinchi bo\'lib fikr bildiring!' }
  }
};

['en', 'ru', 'uz'].forEach(lang => {
  const filePath = `messages/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Merge Header
  Object.keys(newKeys.Header).forEach(k => {
    data.Header[k] = newKeys.Header[k][lang];
  });
  
  // Create sections
  ['Feed', 'Saved', 'Tags', 'Analytics', 'User', 'Components'].forEach(section => {
    data[section] = {};
    Object.keys(newKeys[section]).forEach(k => {
      data[section][k] = newKeys[section][k][lang];
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Updated ' + lang + '.json');
});
