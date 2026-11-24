// real wheel scrolling through the pinned work section; saves frames for a raster-lag check
import { chromium } from 'playwright-core';
const out = process.argv[2];
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.addInitScript(() => { try { sessionStorage.setItem('intro', '1'); } catch {} });
await page.goto('http://localhost:5173/', { waitUntil: 'load' });
await page.waitForSelector('html.ready'); await page.waitForTimeout(800);
const y = await page.evaluate(() => document.querySelector('.work-pin').getBoundingClientRect().top + scrollY + 600);
await page.evaluate((yy) => window.__lenis.scrollTo(yy, { immediate: true }), y); await page.waitForTimeout(800);
await page.mouse.move(700, 450);
for (let i = 0; i < 12; i++) { for (let k = 0; k < 4; k++) { await page.mouse.wheel(0, 160); await page.waitForTimeout(16); } await page.screenshot({ path: `${out}/wheel-${String(i).padStart(2, '0')}.png` }); }
await browser.close();
