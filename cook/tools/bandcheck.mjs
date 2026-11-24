import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
for (const [name, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['phone', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
  const page = await (await browser.newContext(opts)).newPage();
  await page.addInitScript(() => { try { sessionStorage.setItem('intro', '1'); } catch {} });
  await page.goto('http://localhost:5173/', { waitUntil: 'load' });
  await page.waitForSelector('html.ready'); await page.waitForTimeout(700);
  const vh = opts.viewport.height;
  for (const f of [0.9, 1.2, 1.5, 1.7]) {
    await page.evaluate((y) => window.__lenis.scrollTo(y, { immediate: true }), Math.round(f * vh));
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const desc = (el) => el ? (el.className && typeof el.className === 'string' ? el.tagName.toLowerCase() + '.' + el.className.split(' ').slice(0, 2).join('.') : el.tagName.toLowerCase()) : 'none';
      const top = document.elementsFromPoint(200, 4).slice(0, 4).map(desc).join(' > ');
      const ch = document.querySelector('.chapter.light').getBoundingClientRect().top;
      const nav = document.querySelector('.nav'); const nb = nav.getBoundingClientRect();
      const w = document.querySelector('.wipe.light'); const wb = w.getBoundingClientRect(); const cs = getComputedStyle(w);
      const hero = document.querySelector('.hero').getBoundingClientRect();
      return { chapterTop: Math.round(ch), wipe: [Math.round(wb.top), Math.round(wb.height), cs.visibility, cs.getPropertyValue('--p').trim(), cs.zIndex], heroTop: Math.round(hero.top), heroH: Math.round(hero.height) };
    });
    console.log(name, f, JSON.stringify(r));
    await page.screenshot({ path: `cook/stills/r10/band-${name}-${f}.png`, clip: { x: 0, y: 0, width: opts.viewport.width, height: 60 } });
  }
}
await browser.close();
