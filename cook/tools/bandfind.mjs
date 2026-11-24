import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const hides = { none: '' };
for (const [label, css] of Object.entries(hides)) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.addInitScript(() => { try { sessionStorage.setItem('intro', '1'); } catch {} });
  await page.goto('http://localhost:5173/', { waitUntil: 'load' });
  await page.waitForSelector('html.ready'); await page.waitForTimeout(700);
  if (css) await page.addStyleTag({ content: css });
  await page.mouse.move(700, 450);
  for (let i = 0; i < 20; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(60); }
  const info = await page.evaluate(() => { const c = document.querySelector('.chapter.light'); const r = c.getBoundingClientRect(); const cs = getComputedStyle(c); const hits = [...document.querySelectorAll('body *')].filter((el) => { const b = el.getBoundingClientRect(); const st = getComputedStyle(el); return b.top < 22 && b.bottom > 0 && b.width > 600 && st.visibility !== 'hidden' && st.display !== 'none' && (st.backgroundColor !== 'rgba(0, 0, 0, 0)' || el.tagName === 'CANVAS' || el.tagName === 'svg'); }).map((el) => `${el.tagName.toLowerCase()}.${(el.className && el.className.baseVal === undefined ? el.className : '').toString().split(' ')[0]} top=${Math.round(el.getBoundingClientRect().top)} h=${Math.round(el.getBoundingClientRect().height)} bg=${getComputedStyle(el).backgroundColor} z=${getComputedStyle(el).zIndex} pos=${getComputedStyle(el).position}`);
      return { hits, y: Math.round(scrollY), chTop: Math.round(r.top), chH: Math.round(r.height), stick: cs.getPropertyValue('--stick'), topCss: cs.top, pos: cs.position, vh: innerHeight, mainTop: Math.round(document.querySelector('main').getBoundingClientRect().top) }; });
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 40 } });
  await page.screenshot({ path: `/private/tmp/claude-501/-Users-jamal--claude-spares-spare-7mtOBs/2c6327d5-5da9-4d5e-8a58-129f2309a2d8/scratchpad/bf-${label}.png`, clip: { x: 0, y: 0, width: 1440, height: 40 } });
  console.log(label, JSON.stringify(info));
  await page.close();
}
await browser.close();
