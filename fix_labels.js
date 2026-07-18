const fs = require('fs');
const path = require('path');
const files = [
  'src/app/[locale]/prompts/[id]/edit/page.tsx',
  'src/app/[locale]/prompts/new/page.tsx',
  'src/app/[locale]/snippets/[id]/edit/page.tsx',
  'src/app/[locale]/snippets/new/page.tsx'
];

files.forEach(f => {
  const p = path.join(process.cwd(), f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.split('<label className="text-sm font-semibold text-gray-700">')
                     .join('<label className="text-sm font-semibold text-gray-300">');
    fs.writeFileSync(p, content);
    console.log('Fixed', f);
  }
});
