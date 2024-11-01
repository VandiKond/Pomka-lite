const CommandService = require("../services/CommandService");
const { trimStart } = require("../trim");

/**
 * sends the information about editing a command
 * @param {string} text - the information for the edit
 * @param {number} user - the user that is editing the command
 * @param {Object} ctx - message data of telegramm to send a message
 * @returns the indicator of a planned creation
 */
async function edit_command_front(text, user, ctx) {
    // trims the text
    text = trimStart(text)

    // Splits the text
    let parts = text.split("/");

    // gets the command name and new action
    let name = parts[0].toLowerCase()
    let new_action = parts.slice(1).join(" ")

    // Creating the reply text
    let reply_text = ""
    try {
        // Deleting the command
        const [command, last_command] = await edit_command_back(name, new_action, user)
        // Creating the sucsess message
        reply_text = `✅ Реакция команды ${name} изменено с <code>${last_command.ActionName}</code> на <b>${command.ActionName}</b>`
    } catch (err) {
        // If one of existing errors
        if (
            (err.code === 404 && err.name === "CommandNotFound") ||
            (err.code === 403 && err.name === "CreatorNotMatch") ||
            (err.code === 413 && err.name === "ActionLength")
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
 * edits a command
 * @param {string} name - the name of a command
 * @param {string} new_action - the new action of the new command
 * @param {number} user - the user that is trying to delete the command
 * @returns The edited command and command be4 editing 
 */
async function edit_command_back(name, new_action, user) {
    // Checking the existance of a command
    const exist = await CommandService.check(name)
    if (!exist) {
        let err = new Error("Нет такой команды")
        err.code = 404
        err.name = "CommandNotFound"
    }

    // Checking that user and creator of command match
    const command = await new CommandService(name)
    if (user !== command.OwnerId && user !== creator) {
        let err = new Error("Ты не владелец команды")
        err.code = 403
        err.name = "CreatorNotMatch"
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

    // returning 
    return [await new CommandService(name, new_action, user), command]
}

module.exports = edit_command_front