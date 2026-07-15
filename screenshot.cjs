const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: 'screenshot-main.png', fullPage: false });
  console.log('Screenshot saved');
  await browser.close();
})();
