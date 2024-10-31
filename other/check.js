const emojisWithText = [
    "Я тут! 😊",
    "Я тут! 😇",
    "Я тут! 🥰",
    "Я тут! 😎",
    "Я тут! 💋",
    "Я тут! 👀",
    "Я тут! 💫",
    "Я тут! 🌟",
    "Я тут! ✨",
    "Я тут! ⚡️",
    "Я тут! ☀️",
    "Я тут! 🔥",
    "Я тут! 💥",
    "Я тут! 🩷",
    "Я тут! ❤️",
    "Я тут! 🤍",
    "Я тут! ❤️‍",
    "Я тут! ❣",
    "Я тут! 💕",
    "Я тут! 💞",
    "Я тут! 💓",
    "Я тут! 💗",
    "Я тут! 💖",
    "Я тут! 💘",
    "Я тут! ✅",
    "Я тут! ☑️"
];

/**
 * sends information abaut the working of the bot
 * @param {Object} ctx the message data
 * @returns a date
 */
async function check_bot(ctx) {
    const ind = Math.floor(Math.random() * emojisWithText.length)
    await Reply.r(ctx, emojisWithText[ind])
    return new Date()
}

module.exports = check_bot