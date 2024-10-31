const getUser = require("../get_user")
const CommandService = require("../services/CommandService")
const UserService = require("../services/UserService")

/**
 * Using a command
 * @param {string} text - the input text
 * @param {number} user - the id of the user that is using the command
 * @param {Object} ctx - the telegram message dara
 * @returns A sucsses or not promise
 */
async function use_command_front(text, user, ctx) {
    // Getting lines
    const TextLines = text.split("\n")
    // If the text is empty throwing an error
    if (!TextLines.length) {
        await Reply.r(ctx, "❌ Ошибка: Текст пуст")
        throw new Error("Текст пуст")
    }

    // Getting the user
    const [user_to, firstLine] = await getUser(TextLines[0].toLowerCase(), ctx)

    // If not user returning false
    if (!user_to) {
        return false
    }

    // getting the user from 
    const user_from = await new UserService(user)

    // If not user throwing an error
    if (!user_from) {
        await Reply.r(ctx, "❌ Ошибка: Кажится вы не существуете")
        throw new Error("Пользователь не существует")
    }

    // Getting the left linec
    const last_lines = TextLines.slice(1).join("\n")

    // Definding the send text
    let send_text = ""
    try {
        // Using the command
        const command = await use_command_back(firstLine)
        // In sucsess createding a usage messafe
        send_text = `<a href='${await Link.l(user_from)}'>${user_from.Nickname}</a> ${command.ActionName} <a href='${await Link.l(user_to)}'>${user_to.Nickname}</a>`

        // If it has some message to a command adding it to the text
        if (last_lines.length && last_lines && last_lines.length < 500) {
            send_text += `\n💬 Сказав: <b><u>«${last_lines}»</u></b>`

        }
    } catch (err) {
        // If the error was expectred returning false
        if (err.code === 404 && err.name === "CommandNotFound") {
            return false
        }
        // If the error is unexpecteed adding a different message
        send_text = `❌ Непонятная ошибка : ${err.message}`

        // throwing the error
        throw err
    } finally {
        // Finally sending the message
        await Reply.r(ctx, send_text)
    }

    // returning true as nothing went wrong
    return true
}

/**
 * uses a command
 * @param {string} name - the name of the command
 * @returns the command
 */
async function use_command_back(name) {
    // Getting the command
    const ok = await CommandService.check(name)
    if (!ok) {
        // If command not found throwing error
        let err = new Error("Команда не найдена")
        err.code = 404
        err.name = "CommandNotFound"
        throw err
    }
    const command = await new CommandService(name)
    // adding uses of command
    return await CommandService.Add_uses(command)
}

module.exports = use_command_front