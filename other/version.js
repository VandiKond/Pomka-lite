const { version } = require("../Config.bot/Config");

/**
 * sends the version
 * @param {Object} ctx - message data
 * @returns the version of the bot
 */
async function get_version(ctx) {
    await Reply.r(ctx, `📋 ${version}`)
    return version
}

module.exports = get_version