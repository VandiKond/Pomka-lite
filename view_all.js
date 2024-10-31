
const { sequelize } = require('./models'); // Подключаем модель User и экземпляр Sequelize
const { creator } = require('./Config.bot/Config');

/**
 * Sends all data of bot
 * @param {string} text - the name of the table
 * @param {number} user - the request user
 * @param {Object} ctx - the message data
 * @returns a sucsess indicatior
 */
async function get_all_data(text, user, ctx) {
    text = text.toLowerCase()

    // Checking that user is creator
    if (user !== creator) {
        return false
    }

    // Getting the table name
    let TableName
    switch (text) {
        case 'транзакций':
            TableName = 'Transactions'
            break
        case 'команд':
            TableName = 'Commands'
            break
        default:
            text = 'пользователей'
            TableName = 'Users'
    }

    // Sending the first message
    await Reply.r(ctx, `⌛ Загружаю все данные ${text} (таблицы ${TableName})`)

    // Getting data
    let [allData] = await sequelize.query(`SELECT * FROM ${TableName}`)
    let [allCount] = await sequelize.query(`SELECT COUNT() AS count FROM ${TableName}`)

    // creating text for the message
    const SendText = `📊 Все данные ${text} (таблицы ${TableName}), Общее количество: ${allCount[0].count}`
    let FileText = SendText + '\n'
    for (let data of allData) {
        let num = 0
        for (let [key, nameData] of Object.entries(data)) {
            if (!(num)) {
                FileText += `\n`+ key + ' : ' + nameData + `\n`
                num++
            } else {
                FileText += `   ` + key + ' : ' + nameData + `\n`
            }
        }
    }

    // Creationg a file
    const buffer = Buffer.from(FileText);
    const file = {
        source: buffer,
        filename: `${TableName}.json`,
        contentType: 'application/json'
    };

    // Sending the message
    const options = {
        parse_mode: 'HTML',
        caption: SendText
    }
    await ctx.replyWithDocument(file, options);

    return true
}

module.exports = get_all_data
