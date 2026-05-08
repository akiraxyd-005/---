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

// Express app
const app = express();
const PORT = process.env.PORT || 3000;

let latestQR = null;
let isConnected = false;

// Web endpoints
app.get('/', (req, res) => {
    if (latestQR && !isConnected) {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Scan QR Code - Voltaria Bot</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        text-align: center;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        margin: 0;
                        padding: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .container {
                        background: white;
                        border-radius: 20px;
                        padding: 30px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        max-width: 500px;
                    }
                    h1 { color: #333; margin-bottom: 20px; }
                    .qr-container {
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        display: inline-block;
                        margin: 20px 0;
                    }
                    pre {
                        font-family: monospace;
                        font-size: 14px;
                        line-height: 1.2;
                        margin: 0;
                    }
                    .steps {
                        text-align: left;
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 10px;
                        margin-top: 20px;
                    }
                    .steps p {
                        margin: 10px 0;
                        color: #555;
                    }
                    .status {
                        color: #e74c3c;
                        font-weight: bold;
                        margin-top: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🌸 Voltaria Bot 🌸</h1>
                    <div class="qr-container">
                        <pre>${latestQR}</pre>
                    </div>
                    <div class="steps">
                        <p>📱 <strong>Step 1:</strong> Open WhatsApp on your phone</p>
                        <p>⚙️ <strong>Step 2:</strong> Go to Settings → Linked Devices</p>
                        <p>🔗 <strong>Step 3:</strong> Tap "Link a Device"</p>
                        <p>📸 <strong>Step 4:</strong> Scan this QR code</p>
                    </div>
                    <div class="status">
                        ⏳ Waiting for connection...
                    </div>
                </div>
            </body>
            </html>
        `);
    } else if (isConnected) {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Voltaria Bot - Connected</title>
                <style>
                    body {
                        font-family: monospace;
                        text-align: center;
                        background: linear-gradient(135deg, #11998e, #38ef7d);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .container {
                        background: white;
                        border-radius: 20px;
                        padding: 40px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    h1 { color: #333; }
                    .status { color: #27ae60; font-size: 24px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>✅ Voltaria Bot is Online!</h1>
                    <div class="status">🎉 Bot Connected Successfully 🎉</div>
                    <p>The bot is now active and ready to use.</p>
                </div>
            </body>
            </html>
        `);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Voltaria Bot - Starting</title>
                <style>
                    body {
                        font-family: monospace;
                        text-align: center;
                        background: linear-gradient(135deg, #f093fb, #f5576c);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .container {
                        background: white;
                        border-radius: 20px;
                        padding: 40px;
                    }
                    .spinner {
                        width: 50px;
                        height: 50px;
                        border: 5px solid #f3f3f3;
                        border-top: 5px solid #3498db;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 20px auto;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 Starting Voltaria Bot...</h1>
                    <div class="spinner"></div>
                    <p>Please wait while the bot initializes...</p>
                    <p>Refresh in a few seconds to scan QR code.</p>
                </div>
            </body>
            </html>
        `);
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', connected: isConnected, timestamp: new Date().toISOString() });
});

app.get('/status', (req, res) => {
    res.status(200).json({ connected: isConnected, qr_available: !!latestQR });
});

app.listen(PORT, () => {
    console.log(`✅ Web server running on port ${PORT}`);
    console.log(`📱 QR Code page: http://localhost:${PORT}/`);
});

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
            isConnected = false;
            console.log('\n📱 QR Code generated!');
            console.log('👉 View at: https://your-app.onrender.com/\n');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            isConnected = true;
            latestQR = null;
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
            } else {
                console.log('❌ Logged out. Please restart to scan again.');
                isConnected = false;
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
console.log(`📦 Bot Name: ${config.botName}`);
console.log(`⚡ Prefix: ${config.prefix}`);
console.log(`🌐 Web Interface: http://localhost:${PORT}\n`);

startBot().catch(err => console.error('Fatal:', err));