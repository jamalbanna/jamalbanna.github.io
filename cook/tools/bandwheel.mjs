import { chromium } from 'playwright-core';
const out = process.argv[2];
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.addInitScript(() => { try { sessionStorage.setItem('intro', '1'); } catch {} });
await page.goto('http://localhost:5173/', { waitUntil: 'load' });
await page.waitForSelector('html.ready'); await page.waitForTimeout(800);
await page.mouse.move(700, 450);
let bad = 0;
for (let i = 0; i < 16; i++) {
  for (let k = 0; k < 2; k++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(60); }
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 40 } });
  const p = await page.evaluate(() => getComputedStyle(document.querySelector('.wipe.light')).getPropertyValue('--p').trim());
  await page.screenshot({ path: `${out}/bw-${String(i).padStart(2, '0')}-p${p}.png`, clip: { x: 0, y: 0, width: 1440, height: 40 } });
}
await browser.close();
