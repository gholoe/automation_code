const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const htmlPath = path.resolve(__dirname, '../custom-html/report.html');
  const pdfPath = path.resolve(__dirname, '../custom-html/report.pdf');

  if (!fs.existsSync(htmlPath)) {
    console.error('❌ HTML report tidak ditemukan:', htmlPath);
    process.exit(1);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

  await browser.close();
  console.log('✅ PDF report berhasil dibuat di:', pdfPath);
})();
