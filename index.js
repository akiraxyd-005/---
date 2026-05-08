process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

const express = require('express');
const pino = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const handler = require('./handler');

const app = express();
const PORT = process.env.PORT || 3000;

let latestQR = null;

app.get('/', (req, res) => {
    if (latestQR) {
        res.send(`
            <html>
            <head><title>Scan QR Code - Voltaria Bot</title></head>
            <body style="text-align:center; font-family:Arial;">
                <h1>📱 Scan QR Code with WhatsApp</h1>
                <pre style="background:#f0f0f0; padding:20px; display:inline-block;">${latestQR}</pre>
                <p>1. Open WhatsApp</p>
                <p>2. Settings → Linked Devices → Link a Device</p>
                <p>3. Scan this QR code</p>
            </body>
            </html>
        `);
    } else {
        res.send('Waiting for QR code...');
    }
});

app.get('/health', (req, res) => res.status(200).send('OK'));
app.listen(PORT, () => console.log(`✅ Web server on port ${PORT}`));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    auth: state,
    browser: Browsers.ubuntu('Chrome'),
    printQRInTerminal: true
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      latestQR = qr;
      console.log('\n📱 QR Code generated! View at: https://your-app.onrender.com/\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      latestQR = null;
      console.log('\n✅ Bot connected successfully!');
      console.log(`📱 Bot Number: ${sock.user.id.split(':')[0]}`);
      console.log(`🤖 Bot Name: ${config.botName}`);
      console.log(`⚡ Prefix: ${config.prefix}\n`);
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log('♻️ Reconnecting...');
        setTimeout(startBot, 5000);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      if (!msg.message) continue;
      try {
        await handler.handleMessage(sock, msg);
      } catch (err) {
        console.error('Error:', err.message);
      }
    }
  });

  return sock;
}

console.log('\n🚀 Starting Voltaria Bot...\n');
startBot().catch(err => console.error('Fatal:', err));