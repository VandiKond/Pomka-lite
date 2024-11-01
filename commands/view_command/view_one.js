const add_suf = require("../../add_suf");
const CommandService = require("../../services/CommandService");
const UserService = require("../../services/UserService");

class Command_data{
    /**
     * creates command data for eseaer edditing
     * @param {CommandService} command - data of a command
     * @param {number} user - user, thats requesting data of command
     */
    constructor(command, user = 0) {
        this.Match = user === command.OwnerId
        this.Name = command.Name
        this.ActionName = command.ActionName
        this.Times = command.TimesUsed
        this.OwnerId = command.OwnerId
    }
}

/**
 * Sends the info of the command
 * @param {string} text - the command name
 * @param {number} user - the user, that's sends the request
 * @param {Object} ctx - the message data
 * @returns the sucsess
 */
async function view_one_front(text = "", user, ctx) {
    text = text.toLowerCase()

    let send_text = ""
    try {
        // Getting data
        command_data = await view_one_back(text, user)
        // Checks if the command belongs to user
        let add = ""
        if (command_data.Match) add = " (Ваша)"

        // Get's the ownet
        const owner = await new UserService(command_data.OwnerId)
        // Ads other information
        send_text = `🔑 Команда ${text}${add}:
        
▫️ Создатель: <a href='${await Link.l(owner)}'>${owner.Nickname}</a>
▫️Реакция бота: ${command_data.ActionName}
▫️Использована: ${add_suf(command_data.Times)} раз`
    } catch (err) {
        if (err.code === 404 && err.name === "CommandNotFound") {
            // Creatiing text
            send_text = `❌ Ошибка : ${err.message}`
        } else {
            // If the error is unexpecteed adding a different message
            reply_text = `❌ Непонятная ошибка : ${err.message}`

            // throwing the error
            throw err
        }
    } finally {
        // Finally sending the message
        await Reply.r(ctx, send_text)
    }

    return true
}

/**
 * gets the information about the command on the backend
 * @param {string} name - the name of the comamnd 
 * @param {number} user - the id of the user, thats requesting the command
 * @returns the command data
 */
async function view_one_back(name, user) {
    // Checking the existance of the command
    const ok = await CommandService.check(name)
    if (!ok) {
        // Creating an error
        let err = new Error("Команда не найдена")
        err.code = 404
        err.name = "CommandNotFound"
        throw err
    }

    // Getting the command
    const command = await new CommandService(name)

    // Gets better information about the command
    return await new Command_data(command, user)

}

module.exports = view_one_front