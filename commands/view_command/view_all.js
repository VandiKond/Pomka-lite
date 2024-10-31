const edit_mes = require('../../Edit');
const { sequelize } = require('../../models');


class CommandSort {
    /**
     * 
     * @param {string} sort_ord - order of sorting 
     * @param {number} skip - how many commands are need to skip
     */
    constructor(sort_ord, skip) {
        this.sort_ord = sort_ord
        this.skip = skip
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
        // editing the data
        for (let op in options) {
            data[op] = options[op]
        }
        return `view_all_commands/${data.sort_ord}/${data.skip}`
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
     * starts viewing commands
     * @param {Object} ctx - the message data
     * @returns the sucsess
     */
    static async start(ctx) {
        const data = new this("DESC", 0)
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
            ORDER BY CreatedAt ${this.sort_ord}
            LIMIT 10 OFFSET ${this.skip}`)
        return data
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
     * creates text for message
     * @returns an array of a string and result of cr_markup()
     */
    async mes_info() {
        const data = await this.get_back()
        const markup = this.cr_markup()
        return [`🗂️ Данные команд:\n\n${data.join("\n")}\n\n📖 Страница ${this.getPage()}`, markup]
    }
    /**
     * edits message with new data
     * @param {Object} ctx - message data
     * @returns a sucsess indicator
     */
    async continue_front(ctx) {
        const [text, markup] = await this.mes_info()
        await edit_mes(ctx, text, { inline_keyboard: markup })
        return true
    }
    /**
     * starts the editing of the current message
     * @param {string} sort_ord - order of sorting 
     * @param {number} skip - how many commands are need to skip
     * @param {Object} ctx - message data
     * @returns a sucsess indicator
     */
    static async get_from(sort_ord, skip, ctx) {
        const data = new this(sort_ord, skip)
        await data.continue_front(ctx)
        return true
    }
    /**
     * 
     * @param {[]Object} data 
     * @returns a maped object 
     */
    static map_data(data) {
        // Returning empty data
        if (data.length === 0) {
            return ["❌ Пусто"]
        }
        // Returning maped data
        return data.map(commad => `<code>команда ${commad.Name}</code>`)
    }
    /**
     * Gets the page by sql skiping
     * @returns the number of page
     */
    getPage() { return Math.floor(this.skip / 10) + 1};
}

module.exports = { CommandSort }