import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
for (const intro of [false, true]) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  if (intro) await page.addInitScript(() => { try { sessionStorage.setItem('intro', '1'); } catch {} });
  await page.goto('http://localhost:5173/', { waitUntil: 'load' });
  const log = [];
  for (let i = 0; i < 10; i++) { await page.waitForTimeout(500); log.push(await page.evaluate(() => Math.round(scrollY))); }
  console.log(intro ? 'intro skipped' : 'with intro', 'scrollY over 5 s:', log.join(' '), 'nav:', await page.evaluate(() => document.querySelector('.nav').className));
}
await browser.close();
