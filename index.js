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
const readline = require('readline');
const config = require('./config');
const handler = require('./handler');

// Express server for health checks (keeps Render awake)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Voltaria Bot is running!'));
app.get('/health', (req, res) => res.status(200).send('OK'));
app.listen(PORT, () => console.log(`✅ Health server on port ${PORT}`));

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
      console.log('\n📱 SCAN QR CODE:\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('\n✅ Bot connected!');
      console.log(`📱 ${sock.user.id.split(':')[0]}`);
      console.log(`🤖 ${config.botName}`);
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

  setTimeout(async () => {
    if (!sock.user) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('\n🔑 Enter number (e.g., 254108720384): ', async (num) => {
        const clean = num.replace(/[^0-9]/g, '');
        try {
          const code = await sock.requestPairingCode(clean);
          console.log(`\n🔐 PAIRING CODE: ${code}`);
          console.log('👉 WhatsApp → Settings → Linked Devices → Link with Code\n');
        } catch (err) {
          console.error('Error:', err.message);
        }
        rl.close();
      });
    }
  }, 5000);

  return sock;
}

console.log('\n🚀 Starting Voltaria Bot...\n');
startBot().catch(err => console.error('Fatal:', err));