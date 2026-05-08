/**
 * Global Configuration for WhatsApp MD Bot - Voltaria
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['254108720384'],
    ownerName: ['Arashi'],
    
    // Bot Configuration
    botName: 'Voltaria',
    prefix: '§',
    sessionName: 'session',
    sessionID: 'KnightBot!H4sIAAAAAAAAA5VU25KiSBT8l3rVGEEFlIiOWFAUsEEERXFjH0oooFpuVhUNOOG/b9A9PT0Pu7O9b3WLPHky89R3UJSYog3qgPwdVAS/Qob6JesqBGSg1nGMCBiCCDIIZFCrdLk4iaqIG/F2SQaXVDvTs+HvRDbflLQTJo20P3kx45In8BiCqr5kOPwN4Dm62CnOXkV/ENoxG3DVUnJdzdmWXr120iOLRpAKQqJxsyfw6BEhJrhItCpFOSIw26DOgZh8jX5o72fo1GynR54ukP1SmsqoiZujVKXBWvUjK5W43BTP0mr2NfqBnQdLH+1JEm8yPWTWJr0E27hbWqWQhHjdbhehZtCoaI13+hQnBYqMCBUMs+7LunOLnHiFs3eCXdOqweGQxhbdbI7KyFxfhLmb+WZR8qmyvxpfJE7uq1LrtHbimKaScGfbjGb3HN8CS9kWKza4K96R7Ur72PxK3CEfWbn+H91r7eQelGR6C9apqQs8JIaoH2/CdqIRQRDSAx+OtGcY8dfd1+i3r3Y+CQYiIZbauBWDq+VogoUk9OfkntqozjeeO3Wr/Kh80oesJr9jOamqWFkf2iQ/+M+GWxxTz75oYT7guYgkV+vmp7FAbB0vp940KK3A6Mb63RFbD5fMOuZbcx4Wy9Hu5ZTwTVDeG+3Sqrunt46uqDMiIPOPISAowZQRyHBZ9GdTaQhg9OqhkCD2pi64Wa0XEPWFW0RaA0fI3ceWvpuZe63mCmOQUGl7hRfLq4PyCQxBRcoQUYoiHVNWks5ClMIEUSD/+dcQFKhl77711Sb8EMSYUHYo6iorYfRh6sclDMOyLpjXFeGiXyACZO7zGDGGi4T2MtYFJGGKX9EihYwCOYYZRT8bRARFQGakRj+HdlFGve47J3jem+4aDEH+5geOgAzGwlSaCII4mc4lWeT/oN+aHhZW1bcCMTAE2fsziZtK/EyQJH4yFif9y/7i8ZNhDxghBnFGgQwWjuRnjqJrz3EwD2frtaIlyiJRwGdHH8l4l14Tu7YZE1it29XKTU/ZKHK3K1/goxWvonP34odZkBSDaRI+/QMIkMEB3rz8dNhkxV1/WU1XoiflY83t5lHX5PQ6FfR2try+iJqxzZfZOjSnbTmaneBOvevxfVJvDrBybMEIWefVhs6Vja0vlae+WoRecYh+LbbmWmdwXPjaos4pvsTXsTUNdjS/zoq9l4dL3ylUqTh5O8m/q2d1XCWXTWao+9XKOoRQ2a8vuSs861hPC5t7aeZmvnYWzXtm32Ym+/FX4bc49V712xijt9EvYO/gf3v3TryPGPcY/oLx4zP5l4FU3S2loX0b31zquofAF+LJYZ/6KDq50e6UhyV/Mo+GOaoNHTwefw1BlUEWlyQHMoBFREocgSEgZd1n1iji8jfFFgo1lCQx+84zSJnyOQd7nCPKYF4BmZek2ZgX5vPZ42/QaZR7PAcAAA==',
    newsletterJid: '120363161513685998@newsletter',
    updateZipUrl: '',
    
    // Sticker Configuration
    packname: 'Voltaria',
    
    // Bot Behavior
    selfMode: false,
    autoRead: false,
    autoTyping: false,
    autoBio: false,
    autoSticker: false,
    autoReact: false,
    autoReactMode: 'bot',
    autoDownload: false,
    
    // Group Settings Defaults
    defaultGroupSettings: {
      antilink: false,
      antilinkAction: 'delete',
      antitag: false,
      antitagAction: 'delete',
      antiall: false,
      antiviewonce: false,
      antibot: false,
      anticall: false,
      antigroupmention: false,
      antigroupmentionAction: 'delete',
      welcome: false,
      welcomeMessage: '╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮\n┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: @user 👋\n┃Member count: #memberCount\n┃𝚃𝙸𝙼𝙴: time⏰\n╰━━━━━━━━━━━━━━━╯\n\n*@user* Welcome to *@group*! 🎉\n*Group 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽*\ngroupDesc\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ botName*',
      goodbye: false,
      goodbyeMessage: 'Goodbye @user 👋 We will never miss you!',
      antiSpam: false,
      antidelete: false,
      nsfw: false,
      detect: false,
      chatbot: false,
      autosticker: false
    },
    
    // API Keys
    apiKeys: {
      openai: '',
      deepai: '',
      remove_bg: ''
    },
    
    // Message Configuration
    messages: {
      wait: '⏳ Please wait...',
      success: '✅ Success!',
      error: '❌ Error occurred!',
      ownerOnly: '👑 This command is only for bot owner!',
      adminOnly: '🛡️ This command is only for group admins!',
      groupOnly: '👥 This command can only be used in groups!',
      privateOnly: '💬 This command can only be used in private chat!',
      botAdminNeeded: '🤖 Bot needs to be admin to execute this command!',
      invalidCommand: '❓ Invalid command! Type §menu for help'
    },
    
    // Timezone
    timezone: 'Africa/Nairobi',
    
    // Limits
    maxWarnings: 3,
    
    // Social Links
    social: {
      github: 'https://github.com/',
      instagram: 'https://instagram.com/',
      youtube: 'https://youtube.com/'
    }
};