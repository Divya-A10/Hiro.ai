import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Spawn FastAPI Python backend
console.log('[HIRO ENGINE] Spawning FastAPI Python backend on 127.0.0.1:8080...');
const pythonProcess = spawn('python3', ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8080'], {
  stdio: 'inherit',
  shell: true
});

pythonProcess.on('error', (err) => {
  console.error('[HIRO ERROR] Failed to start python backend:', err);
});

// Proxy logic for all '/api' requests to FastAPI
app.all('/api/*', async (req, res) => {
  const targetUrl = `http://127.0.0.1:8080${req.originalUrl}`;
  try {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v));
        } else {
          headers.set(key, typeof value === 'string' ? value : String(value));
        }
      }
    });

    const method = req.method;
    const options: RequestInit = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'HEAD') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    const contentType = response.headers.get('content-type') || '';
    
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (contentType.includes('application/json')) {
      const json = await response.json();
      res.json(json);
    } else {
      const text = await response.text();
      res.send(text);
    }
  } catch (error: any) {
    console.error(`[PROXY ERROR] Routing path ${req.method} ${targetUrl} failed:`, error);
    res.status(500).json({ error: 'Gateway proxy error', details: error.message });
  }
});

// Serve frontend static assets from 'dist' directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback all other client-side routes to index.html for SPA router (Vite)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Keep port hardcoded exactly to 3000 as mandated by system architecture
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[HIRO GATEWAY] Full-Stack Server active at http://0.0.0.0:${PORT}`);
});

process.on('exit', () => {
  try {
    pythonProcess.kill();
  } catch (e) {}
});
