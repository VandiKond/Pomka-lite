const { Command } = require('../models');
const TransactionService = require('./TransactionService');

class CommandService {
    /**
     * get's the command and creates of not exists
     * @param {string} Name - The name of the command
     * @param {number} OwnerId - The Id of the owner
     * @param {string} ActionName - the action of the command
     */
    constructor(Name, ActionName, OwnerId) {
        // Creating data
        let data = {
            Name: Name
        }

        // Returning the async functiom
        return (async () => {
            // Getting the command
            let command = await Command.findByPk(Name) || {}

            // If not exists creating it
            if (!command.Name && OwnerId && ActionName) {
                // Adding owner id to data
                data.OwnerId = OwnerId

                // adding the action name
                data.ActionName = ActionName

                // Creating a new command
                await new TransactionService(OwnerId, "Создание команды", `Команда ${Name} с действием ${ActionName}`)
                command = await Command.create(data)
            } else if (ActionName && command.ActionName !== ActionName && command.Name) {
                // adding the action name
                command.ActionName = ActionName

                // updating the command
                await new TransactionService(OwnerId, "Изменение команды", `Команда ${Name} изменена с ${command.ActionName} на ${ActionName}`)
                await Command.update(command, {
                    where: { Name: Name }
                });
            } else if (!command.Name) {
                return null
            }
            return command
        })()
    }

    /**
     * method to get all commands
     * @returns 
     */
    static async getAll() {
        return await Command.findAll();
    }

    /**
     * method to delete a command
     * @param {string} name - name of a command
     * @returns The deleted command
     */
    static async delete(name, user) {
        await new TransactionService(user, "Удаление команды", `Удалена команда ${name}`)
        return await Command.destroy({
            where: { Name: name }
        });
    }

    /**
     * Ads one use to a command 
     * @param {CommandService} command - the commnad
     * @returns A updated command 
     */
    static async Add_uses(command) {
        const data = {
            Name: command.Name,
            TimesUsed: command.TimesUsed + 1
        }
        await Command.update(data, {
            where: { Name: command.Name }
        })
        return command
    }

    /**
     * Method to check the existance of command
     * @param {string} name - the command name
     * @returns the command exists
     */
    static async check(name) {
        let command = await Command.findByPk(name)
        return Boolean(command)
    }
}

module.exports = CommandService;