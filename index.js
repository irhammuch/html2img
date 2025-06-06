import express from 'express';
import puppeteer from 'puppeteer-core';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());

// POST endpoint
app.post('/html2img', async (req, res) => {
  try {
    const { title = "Default Title" } = req.body;

    // Load and inject HTML
    const htmlTemplate = await fs.readFile(path.join(__dirname, 'templates', 'template.html'), 'utf8');
    const html = htmlTemplate.replace('{{title}}', title);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Capture image
    const imageBuffer = await page.screenshot({ type: 'png' });

    await browser.close();

    // Respond with image
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Render error');
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
