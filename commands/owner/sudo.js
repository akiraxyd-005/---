const fs = require('fs');
const sudoPath = './database/sudo.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');

function load() {
    if (!fs.existsSync(sudoPath)) return {};
    return JSON.parse(fs.readFileSync(sudoPath));
}

function save(data) {
    fs.writeFileSync(sudoPath, JSON.stringify(data, null, 2));
}

module.exports = {
    name: 'sudo',
    aliases: ['mod', 'admin'],
    category: 'owner',
    description: 'Manage sudo users',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        const ctx = msg.message?.extendedTextMessage?.contextInfo;
        let target = ctx?.mentionedJid?.[0] || ctx?.participant;
        
        if (action === 'list') {
            const data = load();
            const list = Object.values(data);
            if (!list.length) return extra.reply('📋 No sudo users.');
            let txt = '★ SUDO USERS ★\n\n';
            list.forEach((u, i) => txt += `${i+1}. ${u.name}\n`);
            return extra.reply(txt);
        }
        
        if (action === 'add' && target) {
            const num = target.split('@')[0];
            const name = msg.pushName || num;
            const data = load();
            if (data[target]) return extra.reply(`⚠️ ${name} is already sudo.`);
            data[target] = { id: target, number: num, name };
            save(data);
            return extra.reply(`✅ ${name} added as sudo!`);
        }
        
        if (action === 'remove' && target) {
            const data = load();
            const name = data[target]?.name || target.split('@')[0];
            if (!data[target]) return extra.reply(`⚠️ ${name} is not sudo.`);
            delete data[target];
            save(data);
            return extra.reply(`❌ ${name} removed from sudo.`);
        }
        
        extra.reply('Usage: §sudo add/remove/list @user');
    }
};