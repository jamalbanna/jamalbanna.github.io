// reduced motion + keyboard checks. usage: node cook/tools/a11y.mjs <outDir>
import { chromium } from 'playwright-core';
const out = process.argv[2], url = 'http://localhost:5173/';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
// 1. reduced motion
let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
let page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(800);
console.log('reduced motion:', JSON.stringify(await page.evaluate(() => ({
  motionClass: document.documentElement.classList.contains('motion'),
  canvas: !!document.querySelector('.ribbons'),
  lenis: !!window.__lenis,
  cursor: !!document.querySelector('.cursor'),
  skipIntro: !!document.querySelector('.skip-intro'),
  svgRolesVisible: getComputedStyle(document.querySelector('.g-roles')).display !== 'none',
  navOpacity: getComputedStyle(document.querySelector('.nav')).opacity,
  nameVisible: getComputedStyle(document.querySelector('.hero-name')).visibility,
  workHorizontal: document.querySelector('.work').classList.contains('is-h'),
  count: document.querySelector('.readout-count b').textContent,
}))));
await page.screenshot({ path: `${out}/reduced-hero.png` });
await ctx.close();
// 2. keyboard
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url, { waitUntil: 'load' });
await page.waitForSelector('html.ready');
await page.waitForTimeout(4200);
const order = [];
for (let i = 0; i < 12; i++) {
  await page.keyboard.press('Tab');
  order.push(await page.evaluate(() => { const a = document.activeElement; return (a.className && typeof a.className === 'string' ? a.className.split(' ')[0] : a.tagName.toLowerCase()) + ':' + (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 28); }));
}
console.log('tab order:', order.join(' | '));
await page.focus('.scrub');
for (let i = 0; i < 14; i++) await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(700);
console.log('after 14 x ArrowLeft:', await page.evaluate(() => document.querySelector('.readout-at').textContent + ' / count ' + document.querySelector('.readout-count b').textContent + ' / ' + document.querySelector('.scrub').getAttribute('aria-valuetext')));
await page.screenshot({ path: `${out}/keyboard-scrub.png` });
console.log(errors.length ? 'ERRORS ' + errors.join('; ') : 'no page errors');
await browser.close();
