#!/usr/bin/env node
import { Command } from 'commander';
import fetch from 'node-fetch';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const program = new Command();
const API_BASE = process.env.DEVCOMMONS_API || 'http://localhost:3000/api/v1/cli';

/**
 * Faylni faqat joriy ishchi papka (cwd) ichiga xavfsiz yozadi.
 * Server bergan fayl nomlari ishonchsiz — absolyut yo'llar va `..` bilan
 * papkadan chiqib ketish (path traversal → RCE) bloklanadi.
 */
function safeWrite(rawName: string, content: string): boolean {
  if (typeof rawName !== 'string' || !rawName.trim()) {
    console.error(chalk.red('  └─ Skipped: invalid filename'));
    return false;
  }
  if (path.isAbsolute(rawName)) {
    console.error(chalk.red(`  └─ Skipped (absolute path not allowed): ${rawName}`));
    return false;
  }
  const cwd = process.cwd();
  const target = path.resolve(cwd, rawName);
  const rel = path.relative(cwd, target);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    console.error(chalk.red(`  └─ Skipped (path escapes project directory): ${rawName}`));
    return false;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  return true;
}

program
  .name('devcommons')
  .description('DevCommons CLI - Pull AI workflows, rules, and prompts directly to your project')
  .version('1.0.0');

program
  .command('pull <id>')
  .description('Pull a snippet, prompt, or skill bundle by ID')
  .action(async (id: string) => {
    try {
      console.log(chalk.blue(`Fetching resource ${id} from DevCommons...`));
      const res = await fetch(`${API_BASE}/pull/${id}`);
      
      if (!res.ok) {
        console.error(chalk.red(`Failed to fetch: ${res.statusText}`));
        process.exit(1);
      }

      const json = await res.json() as any;
      
      if (!json.success) {
        console.error(chalk.red(`Error: ${json.error}`));
        process.exit(1);
      }

      const safeId = id.replace(/[^a-zA-Z0-9_-]/g, "").substring(0, 6);
      if (json.type === 'snippet') {
        const ext = getExtension(json.data.language);
        const filename = `devcommons_snippet_${safeId}${ext}`;
        if (safeWrite(filename, json.data.code)) {
          console.log(chalk.green(`✅ Successfully pulled snippet to ${filename}`));
        }
      } else if (json.type === 'prompt') {
        const filename = `devcommons_prompt_${safeId}.md`;
        if (safeWrite(filename, json.data.content)) {
          console.log(chalk.green(`✅ Successfully pulled prompt to ${filename}`));
        }
      } else if (json.type === 'bundle') {
        console.log(chalk.yellow(`📦 Found Skill Bundle: ${json.data.title}`));
        const items = json.data.items || [];
        for (const item of items) {
          // item.filename ishonchsiz (server tomonidan beriladi) — safeWrite tekshiradi.
          if (item.filename && item.content) {
             if (safeWrite(item.filename, item.content)) {
               console.log(chalk.green(`  └─ Saved ${item.filename}`));
             }
          }
        }
        console.log(chalk.green(`✅ Successfully extracted skill bundle!`));
      }
    } catch (err: any) {
      console.error(chalk.red(`Error pulling resource: ${err.message}`));
    }
  });

program
  .command('search <query>')
  .description('Search for resources')
  .action(async (query: string) => {
    try {
      console.log(chalk.blue(`Searching DevCommons for "${query}"...`));
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
      
      if (!res.ok) {
        console.error(chalk.red(`Search failed: ${res.statusText}`));
        process.exit(1);
      }

      const json = await res.json() as any;
      
      if (!json.success) {
        console.error(chalk.red(`Error: ${json.error}`));
        process.exit(1);
      }

      const { snippets, prompts, bundles } = json.data;
      
      console.log(chalk.bold.underline('\nBundles:'));
      bundles.forEach((b: any) => console.log(`- ${chalk.yellow(b.id)}: ${b.title}`));
      if (bundles.length === 0) console.log(chalk.gray('  No bundles found.'));

      console.log(chalk.bold.underline('\nSnippets:'));
      snippets.forEach((s: any) => console.log(`- ${chalk.cyan(s.id)}: ${s.title} [${s.language}]`));
      if (snippets.length === 0) console.log(chalk.gray('  No snippets found.'));

      console.log(chalk.bold.underline('\nPrompts:'));
      prompts.forEach((p: any) => console.log(`- ${chalk.magenta(p.id)}: ${p.title} [${p.category}]`));
      if (prompts.length === 0) console.log(chalk.gray('  No prompts found.'));
      
      console.log('\n');
    } catch (err: any) {
      console.error(chalk.red(`Search error: ${err.message}`));
    }
  });

program.parse(process.argv);

function getExtension(lang: string) {
  const map: Record<string, string> = {
    'typescript': '.ts',
    'javascript': '.js',
    'python': '.py',
    'rust': '.rs',
    'go': '.go',
    'html': '.html',
    'css': '.css',
    'json': '.json'
  };
  return map[lang.toLowerCase()] || '.txt';
}
