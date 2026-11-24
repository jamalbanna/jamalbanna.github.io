// usage: node cook/tools/motion.mjs <outDir> [desktop|phone]
import { chromium } from 'playwright-core';
const out = process.argv[2], mode = process.argv[3] || 'desktop', url = 'http://localhost:5173/';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const phone = mode === 'phone';
const ctx = await browser.newContext(phone ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(e.message));
const shot = (n) => page.screenshot({ path: `${out}/${mode}-${n}.png` });
await page.addInitScript(() => {
  window.__frames = [];
  let last = performance.now();
  const loop = (t) => { window.__frames.push(t - last); last = t; requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
});
const fps = async (label) => {
  const f = await page.evaluate(() => { const a = window.__frames.slice(5); window.__frames = []; return a; });
  if (!f.length) return;
  const s = [...f].sort((a, b) => a - b), avg = f.reduce((a, b) => a + b, 0) / f.length;
  console.log(`${mode} ${label}: frames ${f.length}, avg ${avg.toFixed(1)} ms (${(1000 / avg).toFixed(0)} fps), p95 ${s[Math.floor(s.length * 0.95)].toFixed(1)} ms, over 20ms: ${f.filter((x) => x > 20).length}`);
};
await page.goto(url, { waitUntil: 'load' });
console.log('gl:', await page.evaluate(() => { const c = document.createElement('canvas').getContext('webgl2'); const e = c && c.getExtension('WEBGL_debug_renderer_info'); return e ? c.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'none'; }));
await page.waitForSelector('html.ready');
await page.evaluate(() => { window.__frames = []; });
await page.waitForTimeout(600); await shot('intro-1');
await page.waitForTimeout(900); await shot('intro-2');
await page.waitForTimeout(900); await shot('intro-3');
await page.waitForTimeout(1600); await shot('hero-rest');
await fps('intro');
if (!phone) {
  // scrub the playhead
  const box = await page.locator('.graph').boundingBox();
  await page.mouse.move(box.x + box.width * 0.95, box.y + box.height * 0.5);
  await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.5, { steps: 30 });
  await page.waitForTimeout(60); await shot('scrub-moving');
  await page.waitForTimeout(700); await shot('scrub-rest');
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5, { steps: 40 });
  await page.waitForTimeout(500); await shot('scrub-early');
  await fps('scrub');
  await page.mouse.move(700, 880);
}
const H = await page.evaluate(() => document.documentElement.scrollHeight), vh = phone ? 844 : 900;
console.log('page height', H);
const to = async (y, wait = 900) => { await page.evaluate((yy) => window.__lenis.scrollTo(yy, { immediate: true }), y); await page.waitForTimeout(wait); };
const top = (sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY, sel);
await to(vh * 0.45); await shot('wipe1-a');
await to(vh * 0.75); await shot('wipe1-b');
const about = await top('#about'); await to(about + 40, 1500); await shot('about');
const skills = await top('#skills'); await to(skills - 60, 1500); await shot('skills');
const dark = await top('.chapter.dark'); await to(dark - vh * 0.55); await shot('wipe2');
await to(dark + 40, 1800); await shot('experience');
await to(dark + 1300, 1800); await shot('experience-2');
await page.evaluate((y) => window.__lenis.scrollTo(y, { duration: 0.5 }), dark + 1300 - 260); await page.waitForTimeout(1300); await shot('navup');
const pin = await top('.work-pin');
await to(pin - 300, 1500); await shot('work-head');
await to(pin + 10, 1200); await shot('work-1');
await to(pin + 900, 1200); await shot('work-2');
await to(pin + 2600, 1200); await shot('work-3');
await to(pin + 5200, 1200); await shot('work-4');
const H2 = await page.evaluate(() => document.documentElement.scrollHeight);
await to(H2 - vh * 1.5); await shot('wipe3');
await to(H2, 1800); await shot('contact');
// smooth scroll fps: run the whole page
await to(0, 500); await page.evaluate(() => { window.__frames = []; });
await page.evaluate((h) => window.__lenis.scrollTo(h, { duration: 9, easing: (t) => t }), H2);
await page.waitForTimeout(9400);
await fps('full-page scroll');
console.log('overflow px:', await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
console.log(errors.length ? 'ERRORS:\n' + [...new Set(errors)].join('\n') : 'no console errors');
await browser.close();
