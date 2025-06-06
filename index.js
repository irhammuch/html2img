import express from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/html2img', async (req, res) => {
  try {
    const title = req.query.title || "Default Title";

    const htmlTemplate = await fs.readFile(path.join(__dirname, 'templates', 'template.html'), 'utf8');
    const html = htmlTemplate.replace('{{title}}', title);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const imageBuffer = await page.screenshot({ type: 'png' });

    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Render error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
