const fs = require('fs');
const afkPath = './database/afk.json';

module.exports = {
    name: 'afk',
    aliases: ['away', 'brb'],
    category: 'general',
    description: 'Set yourself as AFK (Away From Keyboard)',
    usage: '§afk <reason>',

    async execute(sock, msg, args, extra) {
        try {
            let sender = msg.key.participant || msg.key.remoteJid;
            if (!sender.includes('@')) {
                sender = sender + '@s.whatsapp.net';
            }
            const senderName = msg.pushName || sender.split('@')[0];
            
            let reason = args.join(' ').trim();
            if (!reason || reason === '') {
                reason = 'AFK';
            }
            
            if (!fs.existsSync('./database')) {
                fs.mkdirSync('./database', { recursive: true });
            }
            
            let afkData = {};
            if (fs.existsSync(afkPath)) {
                afkData = JSON.parse(fs.readFileSync(afkPath));
            }
            
            afkData[sender] = {
                reason: reason,
                time: Date.now(),
                name: senderName
            };
            
            fs.writeFileSync(afkPath, JSON.stringify(afkData, null, 2));
            
            await sock.sendMessage(msg.key.remoteJid, {
                react: { text: '💤', key: msg.key }
            }).catch(() => {});
            
            await extra.reply(`💤 *${senderName} is now AFK*\n📝 Reason: ${reason}`);
            
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};