// Local preview server. Unlike `python -m http.server`, this answers HTTP Range
// requests with 206, which browsers require to play <video>. Zero deps.
//   node scripts/serve.mjs [port]        (default 3456, root = repo)
import { createServer } from 'node:http';
import { stat, open } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';

const ROOT = process.cwd();
const PORT = Number(process.argv[2]) || 3456;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(req.url.split('?')[0]);
    if (path.endsWith('/')) path += 'index.html';
    const abs = join(ROOT, normalize(path));
    if (!abs.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }

    const info = await stat(abs);
    const type = TYPES[extname(abs).toLowerCase()] || 'application/octet-stream';
    const total = info.size;
    const range = req.headers.range;

    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : total - 1;
      if (isNaN(start) || isNaN(end) || start > end || end >= total) {
        res.writeHead(416, { 'Content-Range': `bytes */${total}` }).end();
        return;
      }
      const fh = await open(abs);
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Cache-Control': 'no-cache',
      });
      fh.createReadStream({ start, end }).pipe(res).on('close', () => fh.close());
      return;
    }

    const fh = await open(abs);
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': total,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
    });
    fh.createReadStream().pipe(res).on('close', () => fh.close());
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found');
  }
});

server.listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));
