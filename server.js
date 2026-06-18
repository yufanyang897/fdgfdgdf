// 智能提词器 — HTTPS 本地服务器
// 自动生成自签名证书，局域网也能用语音识别
// 用法: node server.js

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const PORT = 3443;
const CERT_DIR = path.join(__dirname, 'certs');
const KEY_FILE = path.join(CERT_DIR, 'key.pem');
const CERT_FILE = path.join(CERT_DIR, 'cert.pem');

// === 获取本机局域网 IP ===
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// === 用 openssl 生成自签名证书 ===
function ensureCert() {
  if (!fs.existsSync(CERT_DIR)) fs.mkdirSync(CERT_DIR, { recursive: true });
  if (fs.existsSync(KEY_FILE) && fs.existsSync(CERT_FILE)) {
    return { key: fs.readFileSync(KEY_FILE), cert: fs.readFileSync(CERT_FILE) };
  }

  console.log('🔐 正在生成 SSL 证书（首次运行）…');

  const IP = getLocalIP();
  // 生成密钥和证书，SAN 包含 localhost + 本机 IP
  const cmd = `openssl req -x509 -newkey rsa:2048 -keyout "${KEY_FILE}" -out "${CERT_FILE}" -days 3650 -nodes -subj "/CN=Teleprompter" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:${IP}" 2>&1`;
  try {
    execSync(cmd, { stdio: 'pipe' });
  } catch (e) {
    console.error('证书生成失败:', e.stderr?.toString() || e.message);
    process.exit(1);
  }

  console.log('✅ 证书已生成');
  return { key: fs.readFileSync(KEY_FILE), cert: fs.readFileSync(CERT_FILE) };
}

// === MIME 映射 ===
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

function serve(req, res) {
  let filePath = req.url === '/' ? '/index.html' : req.url.split('?')[0].split('#')[0];
  filePath = path.join(__dirname, filePath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA fallback: 找不到的文件返回 index.html
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}

// === 启动 ===
const ssl = ensureCert();
const IP = getLocalIP();

const httpsServer = https.createServer(ssl, serve);
httpsServer.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('  📺 智能提词器 — HTTPS 模式');
  console.log('  🎤 语音识别可用');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('  iPhone Safari 打开:');
  console.log(`  →  https://${IP}:${PORT}`);
  console.log('');
  console.log('  首次打开会提示证书不受信任:');
  console.log('  ① 点「显示详细信息」');
  console.log('  ② 点「访问此网站」');
  console.log('  ③ 之后就能正常用语音了');
  console.log('');
  console.log('  按 Ctrl+C 停止');
  console.log('═══════════════════════════════════════');
  console.log('');
});

// HTTP 301 重定向到 HTTPS
http.createServer((req, res) => {
  const host = req.headers.host?.replace(/:80$/, '') || IP;
  res.writeHead(301, { Location: `https://${host}:${PORT}${req.url}` });
  res.end();
}).listen(3000);
