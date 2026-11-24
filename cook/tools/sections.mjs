// Screenshots of the experience organisations, desktop and phone, plus a console-error check.
// usage: node cook/tools/sections.mjs <outDir>
import { chromium } from 'playwright-core';
const out = process.argv[2];
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const sizes = [
  ['desktop', { viewport: { width: 1440, height: 900 } }],
  ['phone', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
];
for (const [name, opts] of sizes) {
  const page = await (await browser.newContext(opts)).newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript(() => { try { sessionStorage.setItem('intro', '1'); } catch {} });
  await page.goto('http://localhost:5173/', { waitUntil: 'load' });
  await page.waitForSelector('html.ready');
  await page.waitForTimeout(800);
  const orgs = await page.$$('.org');
  for (const i of [0, 1, 2, 3]) {
    await orgs[i].scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await orgs[i].screenshot({ path: out + '/' + name + '-org-' + i + '.png' });
  }
  const count = await page.evaluate(() => document.querySelector('.readout-count b').textContent);
  const focus = await page.evaluate(() => document.activeElement && document.activeElement.className);
  console.log(name, 'focus:', focus, 'hero count:', count, 'errors:', errs.length ? errs.join(' | ') : 'none');
}
await browser.close();
