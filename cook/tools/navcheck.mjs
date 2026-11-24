import { chromium } from 'playwright-core';
const out = process.argv[2];
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.addInitScript(() => { try { sessionStorage.setItem('intro', '1'); } catch {} });
await page.goto('http://localhost:5173/', { waitUntil: 'load' });
await page.waitForSelector('html.ready'); await page.waitForTimeout(800);
for (const y of [30, 120, 400, 700]) {
  await page.evaluate((yy) => window.__lenis.scrollTo(yy, { duration: 0.6 }), y);
  await page.waitForTimeout(900);
  const st = await page.evaluate(() => { const n = document.querySelector('.nav'); return { cls: n.className, theme: n.dataset.theme, bg: getComputedStyle(n).backgroundColor, tf: getComputedStyle(n).transform }; });
  console.log(y, JSON.stringify(st));
  await page.screenshot({ path: `${out}/navcheck-${y}.png` });
}
await browser.close();
