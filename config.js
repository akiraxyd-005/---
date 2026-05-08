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
    sessionID: 'KnightBot!H4sIAAAAAAAAA5VU246jOBT8F78mmgQCIURqaYEAuV9JGljtgwMGDMQQ24SQUf59Rff09Dzszva++aY6darq+DsgBWZogRow/g5Kim+Qo3bJmxKBMdCrKEIUdEEIOQRjMFxo5yV6KPNO2u83dNNRSd+76+uFrZ6o6W0XW3EU7u55P1u9gGcXlNU5x8FvAHd90apnqjQrZHU1mvBYVMR1s1GxiWVXSWeX6a2v+IzIevYCni0ixBST2CwTdEEU5gvUbCGmX6O/W6ygYEv33l0LdgYR7iwi+DBKuexXE75hSwXZr1NL39rm1+hLK9PNrtncr8/DI+7VSv4YmQdY14NTUTV6vu2UZBkfovoRvNNnOCYonIWIcMybL+vOtof82vdc4kmdtSMb5c7fJaaYhjP94WwJy5b2dX216sjKvkY8PkVzOYU66XiK42w6BZR0VEZDLVFiM3NMbflYnSospU7xK/Et/chK9n90N+xtVmsrfnOcDb0dc916BJH1Cj1i7WydrjznvFmHi1VkH79GP3pkktnrdfhtWhb05B8fnZ2r7OaiP9eTs+97I/dgSYPwqK0+6UNe0d+xlLnbS+oCB1pPUvC5hH46OtV0K0wuqpbEIovEs2ZpguF60/xYOEJyVzck3Q+3O6Ze+cUwje2MNmEWuGYUKsFCcHmivbx1lKFmFoKx8OwCimLMOIUcF6Q9E0WlC2B4O6CAIv4mL6C308CNlp3gHkz1+PUwbwJDfj0JPJsOysvUTYuSy3yE5ih+AV1Q0iJAjKFwihkvaLNCjMEYMTD+868uIOjO341ryw2ELogwZfxIqjIvYPjh6sclDIKiIvzQkMBoF4iCcf/zGHGOScxaHSsCaZDgGzISyBkYRzBn6GeHiKIQjDmt0M+pNYqwFX4yUda26XugCy5vhuAQjIEoS8pAlocDSVXGw/4f7FvdwsKy/EYQB12Qvz9T+pIijGRFEQbicNC+bC+ePxm2gCHiEOesjd52cMq32tRcVMMRG9m2ZsaaEWvgs6OPaLxLbw6bey1SWNp3y9onbt4L9xvrJAuhJejIb9JTkHsx6Uhx8PIPIGAMBHmiFerJmnvU9RvP10Qn0NhEuNrqdF0raTx04sPlXB+y2/lauKkhTQ0vZym5r5PF5KYQjldrJdbUfqW4DwsFfEkm9UtbLUQ3HKBfi13omeQSri5hlqurlD+OnsdGAcvmr6udE1u58iihmCZ4V2182z9MFobnLPdJ3Qzs6/4W9nmvhA+vGdW7YLnqaPeDbuD6PbRvQ5P/+KzwW5xar9pthNHb7BPYOvjf3r0TbyPWf3Z/wfjxm/zLROr7DWPB+ipe92y/P3onORocneSEQncf7txLUAju/HU271WzKXg+/+qCMoc8KugFjAEkIS1wCLqAFlWb2RmJit99UhqbaXE8bzvPIePa5xw4+IIYh5cSjAVFGQlDUVWl598xk8JePQcAAA==',
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