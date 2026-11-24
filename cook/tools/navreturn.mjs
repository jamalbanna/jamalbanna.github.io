import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.addInitScript(() => { try { sessionStorage.setItem('intro', '1'); } catch {} });
await page.goto('http://localhost:5173/', { waitUntil: 'load' });
await page.waitForSelector('html.ready'); await page.waitForTimeout(700);
await page.mouse.move(700, 450);
// fast flick from the top through the first two chapter changes, then into experience
for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 240); await page.waitForTimeout(25); }
await page.waitForTimeout(1500);
for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(60); }
await page.waitForTimeout(400);
for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, -100); await page.waitForTimeout(60); }
await page.waitForTimeout(1200);
console.log(JSON.stringify(await page.evaluate(() => ({ y: Math.round(scrollY), nav: document.querySelector('.nav').className, navTop: Math.round(document.querySelector('.nav').getBoundingClientRect().top) }))));
await browser.close();
