const fs = require('fs');
const reportsPath = './database/reports.json';
const COOLDOWN = 2 * 60 * 60 * 1000;

if (!fs.existsSync('./database')) fs.mkdirSync('./database');

module.exports = {
    name: 'report',
    aliases: ['complaint', 'issue'],
    category: 'general',
    description: 'Report a user to admins',
    async execute(sock, msg, args, extra) {
        try {
            const sender = extra.sender;
            const senderName = msg.pushName || sender.split('@')[0];
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            let target = ctx?.mentionedJid?.[0] || ctx?.participant;
            let reason = target ? args.slice(1).join(' ') : args.join(' ');
            
            if (!target || !reason) {
                return extra.reply('❌ Usage: §report @user <reason> or reply to their message');
            }
            
            let reports = {};
            if (fs.existsSync(reportsPath)) reports = JSON.parse(fs.readFileSync(reportsPath));
            
            const uid = sender.split('@')[0];
            const gid = extra.from;
            
            if (!reports[gid]) reports[gid] = { cooldowns: {}, reports: [] };
            
            const last = reports[gid].cooldowns[uid];
            if (last && Date.now() - last < COOLDOWN) {
                const mins = Math.ceil((COOLDOWN - (Date.now() - last)) / 60000);
                return extra.reply(`⏰ Wait ${mins} minutes before reporting again.`);
            }
            
            const targetName = target.split('@')[0];
            const reportId = 'RP' + Date.now();
            
            reports[gid].reports.push({
                id: reportId, reporter: senderName, suspect: targetName, reason, time: new Date().toLocaleString()
            });
            reports[gid].cooldowns[uid] = Date.now();
            fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2));
            
            await extra.reply(`⚠️ Report sent!\n🔖 ID: ${reportId}`);
            
            const metadata = await sock.groupMetadata(gid);
            const admins = metadata?.participants?.filter(p => p.admin) || [];
            
            for (const admin of admins) {
                try {
                    await sock.sendMessage(admin.id, {
                        text: `📋 NEW REPORT\nFrom: ${senderName}\nAgainst: ${targetName}\nReason: ${reason}\nID: ${reportId}`
                    });
                } catch (e) {}
            }
        } catch (err) {
            extra.reply(`❌ ${err.message}`);
        }
    }
};