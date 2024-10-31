const UserService = require("../../services/UserService");
const { CommandSort } = require("./view_all");
const { sequelize } = require('../../models');
const getUser = require("../../get_user");


class Usr_CommandSort extends CommandSort {
    /**
    * 
    * @param {number} user - the user thats commands are locking
    * @param {string} sort_ord - order of sorting 
    * @param {number} skip - how many commands are need to skip
    */
    constructor(user, sort_ord, skip) {
        super(sort_ord, skip)
        this.user = user
    }
    /**
     * Creates a callback string to create telegram keyboards
     * @param {Object} options - changing some data
     * @returns string of the callback data for telegram
     */
    conv(options = {}) {
        const data = {}
        data.skip = this.skip
        data.sort_ord = this.sort_ord
        data.user = this.user
        // editing the data
        for (let op in options) {
            data[op] = options[op]
        }
        return `view_usr_commands/${data.user}/${data.sort_ord}/${data.skip}`
    }
    /**
     * starts viewing commands
     * @param {Object} ctx - the message data
     * @param {number} user - the user whose data is viewing
     * @returns the sucsess
     */
    static async start(ctx, user) {
        const data = new this(user, "DESC", 0)
        const [text, markup] = await data.mes_info()
        await Reply.r(ctx, text, { inline_keyboard: markup })
        return true
    }
    /**
     * gets commads by filters
     * @returns command array
     */
    async get() {
        const [data] = await sequelize.query(`SELECT * 
            FROM Commands
            WHERE OwnerId = ${this.user}
            ORDER BY CreatedAt ${this.sort_ord}
            LIMIT 10 OFFSET ${this.skip}`)
        return data
    }
    /**
     * creates text for message
     * @returns an array of a string and result of cr_markup()
     */
    async mes_info() {
        const data = await this.get_back()
        const markup = this.cr_markup()
        const user = await new UserService(this.user)
        return [`🗂️ Данные команд <a href='${await Link.l(user)}'>${user.Nickname}</a>:\n\n${data.join("\n")}\n\n📖 Страница ${super.getPage()}`, markup]
    }
    /**
     * starts the editing of the current message
     * @param {string} sort_ord - order of sorting 
     * @param {number} skip - how many commands are need to skip
     * @param {Object} ctx - message data
     * @returns a sucsess indicator
     */
    static async get_from(user, sort_ord, skip, ctx) {
        const data = new this(user, sort_ord, skip)
        await data.continue_front(ctx)
        return true
    }
    /**
     * creating markup buttons based on the data
     * @returns an array of buttons
     */
    cr_markup() {
        // Creating basic buttons
        const skip = this.skip
        var MarkupButtons = [
            [
                {
                    text: '⬅️',
                    callback_data: this.conv({ skip: skip - 10 })
                }, {
                    text: '➡️',
                    callback_data: this.conv({ skip: skip + 10 })
                }
            ], [
                {
                    text: '⬆️',
                    callback_data: this.conv({ sort_ord: "DESC" })
                }, {
                    text: '⬇️',
                    callback_data: this.conv({ sort_ord: "ASC" })
                }
            ]
        ]
        return MarkupButtons
    }
    /**
     * gets all info on the backend
     * @returns An array with strings
     */
    async get_back() {
        if (this.skip < 0) this.skip = 0
        const data = await CommandSort.map_data(await this.get())
        return data
    }
    /**
     * starts with getting the user by text
     * @param {string} text - the text to get user
     * @param {Object} ctx - the message data
     * @returns sucsess or fail as boolean
     */
    static async start_with_user(text, ctx) {
        // Getting the user
        const [userInfo] = await getUser(text, ctx) || {}
        const user = userInfo.UserId
        // If didn't got the wright user sending an error.
        if (!user) {
            await Reply.r(ctx, "❌ Ошибка : Пользователь не найден")
            return false

        }
        // Starting doing other operations
        return await Usr_CommandSort.start(ctx, user)
    }
}

module.exports = { Usr_CommandSort }