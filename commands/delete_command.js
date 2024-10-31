const { creator } = require("../Config.bot/Config");
const CommandService = require("../services/CommandService");
const { trimStart } = require("../trim");

/**
 * sends the information about deleting a command
 * @param {string} name - the name of the command
 * @param {number} user - the user that is deleting the command
 * @param {Object} ctx - message data of telegramm to send a message
 * @returns the indicator of a planned creation
 */
async function delete_command_front(name, user, ctx) {
    name = name.toLowerCase()
    name = trimStart(name)
    // Creating the reply text
    let reply_text = ""
    try {
        // Deleting the command
        await delete_command_back(name, user)
        // Creating the sucsess message
        reply_text = `❎ Команда ${name} удалена`
    } catch (err) {
        // If one of existing errors
        if (
            (err.code === 404 && err.name === "CommandNotFound") ||
            (err.code === 403 && err.name === "CreatorNotMatch")
        ) {   // Adding the error message
            reply_text = `❌ Ошибка : ${err.message}`
        } else {
            // If the error is unexpecteed adding a different message
            reply_text = `❌ Непонятная ошибка : ${err.message}`

            // throwing the error
            throw err
        }
    } finally {
        // Finally sending the message
        await Reply.r(ctx, reply_text)
    }

    // returning true as nothing went wrong
    return true
}

/**
 * deleting a command
 * @param {string} name - the name of the command
 * @param {number} user - the user that is trying to delete the command
 * @returns the sucsess of the deleting
 */
async function delete_command_back(name, user) {
    // Checking the existance of a command
    const exist = await CommandService.check(name)
    if (!exist) {
        let err = new Error("Нет такой команды")
        err.code = 404
        err.name = "CommandNotFound"
        throw err
    }

    // Checking that user and creator of command match
    const command = await new CommandService(name)
    if (user !== command.OwnerId && user !== creator) {
        let err = new Error("Ты не владелец команды")
        err.code = 403
        err.name = "CreatorNotMatch"
        throw err
    }

    // deleting the command
    await CommandService.delete(name, user)

    // returning sucsess
    return true
}

module.exports = delete_command_front