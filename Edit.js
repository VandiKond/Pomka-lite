/**
 * edits a message based on telegramm limits
 * @param {Object} ctx - telegram messsage data
 * @param {string} text - the reply tex
 * @param {Object} replyMarkup - markup for telegram
 * @returns the indicator of sucsessful editing
 */
async function edit_mes(ctx, text = "", replyMarkup = {}) {
    if (!text) {
        return false
    }
    while (true) {
        try {
            await ctx.editMessageText(text, { reply_markup: replyMarkup, parse_mode: 'HTML', disable_web_page_preview: true });
            return true
        } catch (err) {
            if (err.code === 429 || err.code === 420 || err.code === 504) {
                const retryAfter = err.parameters.retry_after || 0.1;
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            } else if (err.code === 400) {
                await ctx.answerCbQuery('❌ Ничего не поменялось').catch((err) => {})
                return false
            }
            else {

                throw err;
            }
        }
    }
}

module.exports = edit_mes