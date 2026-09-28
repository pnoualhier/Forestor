import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Transparent proxy for FAO FRA official API
app.use('/fao-api', async (req, res) => {
  try {
    const targetUrl = new URL(`https://fra-data.fao.org/api${req.url}`);
    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Forestor-Web/1.0',
      },
    });

    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');

    const data = await response.text();
    res.send(data);
  } catch (err: any) {
    console.error('FAO API Proxy Error:', err.message);
    res.status(502).json({ error: 'FAO API unreachable', details: err.message });
  }
});

// Static assets
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA Fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Forestor server running on http://localhost:${PORT}`);
});
