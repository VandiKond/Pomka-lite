const CommandService = require("../services/CommandService");
const { trimStart } = require("../trim");

/**
 * sends the information about creating a command
 * @param {string} text - the text that has command nfo
 * @param {number} user - the creator of the command
 * @param {Object} ctx - message data of telegramm to send a message
 * @returns the indicator of a planned creation
 */
async function create_command_front(text, user, ctx) {
    // trims the text
    text = trimStart(text)

    // Splits the text
    let parts = text.split("/");

    // gets the command name and action
    let commandName = parts[0].toLowerCase()
    let action = parts.slice(1).join(" ")

    // Creating the reply text
    let reply_text = ""
    try {
        // Creating the command
        const command = await create_command_back(commandName, action, user)

        // Creating the sucsess message
        reply_text = `✅ Создана команда <code>${command.Name}</code> с реакцией бота <b>${command.ActionName}</b>\n\n🧐 Чтобы удалить команду напиши <code>Удалить ${command.Name}</code>`
    } catch (err) {
        // If one of existing errors
        if (
            (err.code === 413 && err.name === "CommandLength") ||
            (err.code === 413 && err.name === "ActionLength") ||
            (err.code === 429 && err.name === "CommandExists")
        ) {
            // Adding the error message
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
 * Creates a new command on back-end side. If exists or not valid returns an error
 * @param {string} commandName - the name of the new command
 * @param {string} action - the action of this command
 * @param {number} user - the id of the owner
 * @returns The new command
 */
async function create_command_back(commandName, action, user) {

    // If the command name is not valid
    if (commandName.length < 2 || commandName.length >= 100) {
        let err = new Error("Команда слишком длинная")
        if (commandName.length < 2) {
            err = new Error("Команда слишком короткая")
        }
        err.code = 413
        err.name = "CommandLength"
        throw err
    }

    // If the action is not valid
    if (action.length >= 500 || action.length < 2) {
        let err = new Error("Действие бота слишком длинное")
        if (action.length < 2) {
            err = new Error("Действие бота слишком короткое")
        }
        err.code = 413
        err.name = "ActionLength"
        throw err
    }

    // Checks the existense
    const exist = await CommandService.check(commandName)
    if (exist) {
        let err = new Error("Команда уже существует")
        err.code = 429
        err.name = "CommandExists"
    }

    // Returns
    return await new CommandService(commandName, action, user)
}

module.exports = create_command_front