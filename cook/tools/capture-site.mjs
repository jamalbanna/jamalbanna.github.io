// Screenshot a public site at desktop size. usage: node cook/tools/capture-site.mjs <url> <out.png>
import { chromium } from 'playwright-core';
const [url, out] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch((e) => { console.log('goto error', e.message); return null; });
console.log('status', res && res.status(), 'title', await page.title());
await page.waitForTimeout(2500);
await page.screenshot({ path: out });
await browser.close();
