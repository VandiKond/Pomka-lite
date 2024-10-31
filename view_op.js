const TransactionService = require("./services/TransactionService")

/**
 * Sends the opersation data
 * @param {string} text - the text with the operation id
 * @param {Object} ctx - the message data
 * @returns boolean sucsess indicator
 */
async function view_operatiom(text, ctx) {
    text = +text || -1
    const transaction = await TransactionService.getById(text)
    if (!transaction.Id || !transaction) {
        await Reply.r(ctx, `❌ Ошибка : Операции не существует`)
        return false
    }
    await Reply.r(ctx, await TransactionService.formatToString(transaction))
    return true
}

module.exports = view_operatiom