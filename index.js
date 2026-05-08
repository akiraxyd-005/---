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
const readline = require('readline');
const config = require('./config');
const handler = require('./handler');

// Express server for health checks
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
    printQRInTerminal: false // Disable QR, use pairing code
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      console.log('\n✅ Bot connected successfully!');
      console.log(`📱 Bot Number: ${sock.user.id.split(':')[0]}`);
      console.log(`🤖 Bot Name: ${config.botName}`);
      console.log(`⚡ Prefix: ${config.prefix}\n`);
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log('♻️ Reconnecting in 5 seconds...');
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

  // PAIRING CODE METHOD - This will ask for your number
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('\n🔑 Enter your WhatsApp number (with country code, no + or spaces): ', async (number) => {
    const cleanNumber = number.replace(/[^0-9]/g, '');
    console.log(`\n📱 Requesting pairing code for ${cleanNumber}...`);
    
    try {
      const code = await sock.requestPairingCode(cleanNumber);
      console.log(`\n🔐 PAIRING CODE: ${code}`);
      console.log('👉 Open WhatsApp → Settings → Linked Devices → Link with Code');
      console.log('👉 Enter this code within 2 minutes\n');
    } catch (err) {
      console.error('❌ Failed to get pairing code:', err.message);
    }
    rl.close();
  });

  return sock;
}

console.log('\n🚀 Starting Voltaria Bot...\n');
console.log(`📦 Bot Name: ${config.botName}`);
console.log(`⚡ Prefix: ${config.prefix}\n`);

startBot().catch(err => console.error('Fatal:', err));