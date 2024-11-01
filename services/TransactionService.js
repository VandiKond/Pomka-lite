const { chanel, chanelBot } = require('../Config.bot/Config');
const { Transaction } = require('../models');
const { User } = require('../models');
const { sequelize } = require('../models');


const time_options = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
};

class TransactionService {
    /**
     * Creates a new transaction
     * @param {number} user - the id of user
     * @param {string} type - the transction type
     * @param {string} desciption - the transaction description
     */
    constructor(user, type = "", desciption = "") {
        let data = {
            Type: type,
            UserId: user,
            Description: desciption
        }
        return (async () => {
            data = await Transaction.create(data)
            await chanelBot.telegram.sendMessage(chanel, await TransactionService.formatToString(data), { parse_mode: 'HTML' })
            return data
        })()
    }

    /**
     * Gets all transations
     * @returns An array of all transactions
     */
    static async getAll() {
        return await Transaction.findAll();
    }

    /**
     * Gets transaction by id
     * @param {number} id - the id of the transaction
     * @returns a transaction
     */
    static async getById(id) {
        const [[result]] = await sequelize.query(`SELECT * FROM Transactions WHERE Id = ${id}`)
        return result
    }

    /**
     * Deletes the transaction
     * @param {number} id - the id of the transaction
     * @returns a new transaction
     */
    static async delete(id) {
        return await Transaction.destroy({
            where: { Id: id }
        });
    }

    /**
     * Formats a transaction to a ctring
     * @param {TransactionService} data 
     * @returns a string about the transaction
     */
    static async formatToString(data) {
        console.log(user)
        return `🔆 Действие #${data.Id}: ${data.Type} \nПользователь: <a href='${await Link.l(user)}'>${user.Nickname}</a>\nДоп информация: ${data.Description}\nВремя: ${new Date(data.ProcessedAt).toLocaleString('ru-RU', time_options)}`
    }
}

module.exports = TransactionService;