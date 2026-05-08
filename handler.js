const fs = require('fs');
const afkPath = './database/afk.json';

async function handleAFK(sock, msg) {
    try {
        if (!msg.key.remoteJid.endsWith('@g.us')) return;
        
        let sender = msg.key.participant || msg.key.remoteJid;
        if (!sender.includes('@')) {
            sender = sender + '@s.whatsapp.net';
        }
        
        if (!fs.existsSync(afkPath)) return;
        const afkData = JSON.parse(fs.readFileSync(afkPath));
        
        if (afkData[sender]) {
            const afk = afkData[sender];
            delete afkData[sender];
            fs.writeFileSync(afkPath, JSON.stringify(afkData, null, 2));
            
            const durationMs = Date.now() - afk.time;
            const minutes = Math.floor(durationMs / 1000 / 60);
            const seconds = Math.floor((durationMs / 1000) % 60);
            
            let durationText = '';
            if (minutes === 0) {
                durationText = `${seconds} Sec`;
            } else if (seconds === 0) {
                durationText = `${minutes} Min`;
            } else {
                durationText = `${minutes} Min ${seconds} Sec`;
            }
            
            const senderName = msg.pushName || sender.split('@')[0];
            
            // YOUR EXACT BORDER - PRESERVED AS IS, NOT FIXED
            const welcomeBackMessage = `
╔═                                                         ═╗                                 
     🌸 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓫𝓪𝓬𝓴, @${senderName} 𝓢𝓮𝓷𝓹𝓪𝓲!  🌸
                        𝓨𝓸𝓾 𝔀𝓮𝓻𝓮 𝓐𝓕𝓚                       
              📝 𝓡𝓮𝓪𝓼𝓸𝓷: ${afk.reason}  
           
          ⏳ 𝓓𝓾𝓻𝓪𝓽𝓲𝓸𝓷: ${durationText}              
╚═                                                         ═╝`;
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: welcomeBackMessage,
                mentions: [sender]
            }, { quoted: msg });
        }
        
        const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        for (const jid of mentionedJids) {
            if (afkData[jid]) {
                const afk = afkData[jid];
                const timeAgo = Math.floor((Date.now() - afk.time) / 1000 / 60);
                let timeText = timeAgo < 1 ? 'just now' : timeAgo === 1 ? '1 minute ago' : `${timeAgo} minutes ago`;
                
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `💤 *${afk.name} is AFK*\n📝 Reason: ${afk.reason}\n⏱️ Since: ${timeText}`,
                    mentions: [jid]
                }, { quoted: msg });
            }
        }
        
    } catch (err) {
        console.error('AFK handler error:', err);
    }
}

module.exports = { handleAFK };