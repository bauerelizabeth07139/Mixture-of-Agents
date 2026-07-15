const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: 'C:/Users/vipuser/Documents/Codex/2026-07-10/ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn/work/Mixture-of-Agents/screenshot-update.png', fullPage: false });
  console.log('Screenshot saved');
  await browser.close();
})();
