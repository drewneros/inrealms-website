// Verifies the 3 Oct 2026 realm rebuild of index.html.
// Usage: node scripts/verify-rebuild.mjs <check>   (static checks read the file; "live" drives Playwright)
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const check = process.argv[2];
const fail = msg => { console.log('FAIL: ' + msg); process.exit(1); };
const body = html.slice(html.indexOf('<body'));
const visibleText = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ');

const checks = {
  removed() {
    for (const id of ['tech-stack', 'problem-stats', 'comparison', 'showcase', 'calendar', 'cta', 'founder'])
      if (html.includes(`id="${id}"`)) fail(`old section #${id} still present`);
    for (const c of ['ticker-bar', 'review-form-section', 'submitReview', 'tech-pill', 'compare-', 'showcase-', 'counterObserver'])
      if (html.includes(c)) fail(`old marker "${c}" still present`);
    console.log('REMOVED-OK');
  },
  order() {
    const want = ['portal', 'services', 'work', 'process', 'reviews', 'about', 'faq', 'book'];
    const pos = want.map(id => html.indexOf(`<section id="${id}"`));
    if (pos.some(p => p < 0)) fail('missing: ' + want.filter((_, i) => pos[i] < 0).join(','));
    if (pos.some((p, i) => i && p < pos[i - 1])) fail('sections out of order');
    if (!/<footer[\s>]/.test(html)) fail('no footer');
    console.log('ORDER-OK');
  },
  nosydney() {
    // positive control: the same regex must catch a planted fixture
    if (!/sydney/i.test('Serving Sydney')) fail('control failed');
    const hits = html.match(/sydney/gi);
    if (hits) fail(`${hits.length} Sydney mentions`);
    console.log('NOSYDNEY-OK');
  },
  nodash() {
    if (!/—/.test('a — b')) fail('control failed');
    const n = (html.match(/—/g) || []).length;
    if (n) fail(`${n} em dashes in index.html`);
    console.log('NODASH-OK');
  },
  seo() {
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) fail(`h1 count ${h1}`);
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    if (/receptionist|chatbot/i.test(title)) fail('title still voice/chatbot-first: ' + title);
    if (title.length < 30 || title.length > 65) fail('title length ' + title.length);
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    if (desc.length < 110 || desc.length > 165) fail('meta description length ' + desc.length);
    for (const s of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const j = JSON.parse(s[1]);
      const flat = JSON.stringify(j);
      if (/aggregateRating/.test(flat)) fail('self-serving aggregateRating still in schema');
      const faq = j['@graph'].find(n => n['@type'] === 'FAQPage');
      const domQ = [...html.matchAll(/<button class="faq-q"[^>]*>([^<]+)</g)].map(m => m[1].trim());
      const ldQ = faq.mainEntity.map(q => q.name);
      if (JSON.stringify(domQ) !== JSON.stringify(ldQ)) fail('FAQ schema does not match page FAQ');
    }
    for (const sec of ['services', 'work', 'process', 'reviews', 'about', 'faq', 'book']) {
      const chunk = html.slice(html.indexOf(`<section id="${sec}"`), html.indexOf('</section>', html.indexOf(`<section id="${sec}"`)));
      if (!/<h2[\s>]/.test(chunk)) fail(`#${sec} has no h2`);
    }
    console.log('SEO-OK');
  },
  assets() {
    const srcs = [...body.matchAll(/(?:src|poster)="([^"]+)"/g)].map(m => m[1]).filter(s => !/^(https?:|data:)/.test(s) && s);
    const missing = srcs.filter(s => !existsSync(join(root, s.split('?')[0])));
    if (missing.length) fail('missing assets: ' + missing.join(', '));
    const work = html.slice(html.indexOf('<section id="work"'), html.indexOf('</section>', html.indexOf('<section id="work"')));
    for (const u of ['https://michaelalexseifert.com', 'https://saraystudio.it', 'https://drewneros.github.io/seven-mgmt/', 'https://travisaro.app', 'https://drewneros.github.io/golden-horde-invite/'])
      if (!work.includes(`href="${u}"`)) fail('work link missing ' + u);
    const anchors = [...html.matchAll(/href="#([a-z-]+)"/g)].map(m => m[1]);
    const bad = anchors.filter(a => !html.includes(`id="${a}"`));
    if (bad.length) fail('dead anchors: ' + bad.join(','));
    console.log(`ASSETS-OK (${srcs.length} local assets)`);
  },
  async live() {
    const { chromium } = await import('/Users/drewneros/.claude/skills/gstack/node_modules/playwright/index.mjs');
    const b = await chromium.launch();
    const problems = [];
    for (const [w, h] of [[1280, 800], [390, 844]]) {
      const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
      const errs = [];
      p.on('pageerror', e => errs.push(e.message));
      await p.goto('http://localhost:3460/', { waitUntil: 'load' });
      // the site uses scroll-behavior: smooth; jump instead so positions are final when read
      await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
      // re-read the height every step: the pinned gallery resizes the page after load
      for (let y = 0; y <= await p.evaluate(() => document.documentElement.scrollHeight - innerHeight) + h; y += Math.round(h * 0.6)) {
        await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(60);
      }
      await p.waitForTimeout(900);
      const r = await p.evaluate(() => {
        const W = innerWidth;
        const over = document.documentElement.scrollWidth > W;
        const hidden = [...document.querySelectorAll('.reveal')].filter(e => !e.classList.contains('visible') && e.getClientRects().length).length;
        return { over, hidden, sw: document.documentElement.scrollWidth };
      });
      if (errs.length) problems.push(`${w}px errors: ${errs.join(' | ')}`);
      if (r.over) problems.push(`${w}px horizontal overflow (scrollWidth ${r.sw})`);
      if (r.hidden) problems.push(`${w}px ${r.hidden} .reveal elements never revealed`);
    }
    await b.close();
    if (problems.length) fail(problems.join('; '));
    console.log('LIVE-OK');
  }
};
if (!checks[check]) fail('unknown check ' + check);
await checks[check]();
