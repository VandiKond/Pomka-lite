const { bot, version, Use_tocken, chanelBot, creator, start_message, if_allow, password } = require("./Config.bot/Config");
const os = require("os");
const r = require("./Reply");
const l = require("./Link");
const UserService = require("./services/UserService");
const { trimStart, trimlike } = require("./trim");
const create_command_front = require("./commands/create_command");
const delete_command_front = require("./commands/delete_command");
const edit_command_front = require("./commands/edit_command");
const use_command_front = require("./commands/use_command");
const teging = require("./HTMLteging");
const check_bot = require("./other/check");
const get_version = require("./other/version");
const view_one_front = require("./commands/view_command/view_one");
const { CommandSort } = require("./commands/view_command/view_all");
const { Usr_CommandSort } = require("./commands/view_command/view_users");
const block_user_front = require("./blacklist");
const view_operatiom = require("./view_op");
const get_all_data = require("./view_all");

// Creationg a global Reply to message function
global.Reply = { r }

// Creating global Link user function
global.Link = { l }

// If the bot cathes an error
bot.catch((err) => {
    // The information about the error
    const errorInfo = `Название: ${teging(err.name) || 'Неизвестная ошибка'}
Сообщение: ${teging(err.message) || 'Нет сообщения'}
Стек вызовов: <pre>${teging(String(err.stack)) || 'Нет информации о стеке'}</pre>`

    // Sending the error message
    chanelBot.telegram.sendMessage(creator, `Ошибка: \n\n${errorInfo}`, {
        parse_mode: 'HTML'
    });

    // Loging the error in the console
    console.error(err);
});


// If the bot gets a new chat member
bot.on('new_chat_members', async (ctx) => {
    try {
        // Gets the chat members
        const newMembers = ctx.message.new_chat_members;

        // For each chat member
        newMembers.forEach(async (member) => {

            // If the bot is added to a group
            if (member.id === ctx.botInfo.id) {
                // It sends the start message
                await Reply.r(ctx, start_message)
            }
        })
    } catch (err) { }
});

// If the bot get the command start
bot.start(async (ctx) => {
    // It sends the start message
    await Reply.r(ctx, start_message)
});
// Or command help
bot.help(async (ctx) => {
    // It sends the start message
    await Reply.r(ctx, start_message)
})

// If bot gets any kind of message
bot.on('message', async (ctx) => {
    // Creating standart values of user
    ctx.from.first_name = teging(ctx.from.first_name)
    let user = ctx.from.id;
    let from = ctx.from
    let repl_from
    let repl_user
    let hfn = ctx.from.first_name
    let repl_hfn
    let repl_username
    let username = from.username || "none"
    username = username.toLowerCase()

    if (ctx.message.reply_to_message) {
        // If it's a chat
        if (ctx.message.reply_to_message.sender_chat) {
            ctx.message.reply_to_message.from = ctx.message.reply_to_message.sender_chat
            ctx.message.reply_to_message.from.first_name = ctx.message.reply_to_message.from.title
            ctx.message.reply_to_message.from.username = "none"
            ctx.message.reply_to_message.from.is_bot = false
        }
        // ads the values of reply
        ctx.message.reply_to_message.from.first_name = teging(ctx.message.reply_to_message.from.first_name)
        repl_from = ctx.message.reply_to_message.from;
        repl_user = repl_from.id
        repl_hfn = repl_from.first_name
        repl_username = repl_from.username || "none"
        repl_username = repl_username.toLowerCase()
    }

    // if user is a chat
    if (ctx.message.sender_chat) {
        user = ctx.message.sender_chat.id
        ctx.message.sender_chat.title = teging(ctx.message.sender_chat.title)
        from = ctx.message.sender_chat
        hfn = from.title
        username = "none"
        ctx.from.id = ctx.message.sender_chat.id
        ctx.from = ctx.message.sender_chat
        ctx.from.first_name = from.title
        ctx.from.username = "none"
    }

    // Checks is it allowed to use the bot
    var allow_use
    if (if_allow[0] === true || if_allow[0] === ctx.chat.id) allow_use = true
    else if (if_allow[1] === true || if_allow[1] === user) allow_use = true
    if (!allow_use) {
        return
    }

    // Gets the users in data base
    let userInfo = await new UserService(user, username, hfn)
    let repl_userInfo
    if (repl_user) {
        repl_userInfo = await new UserService(repl_user, repl_username, repl_hfn)
    }
    // Checks if the user is blocked
    if (userInfo.IsBlocked) {
        return
    }

    // If it's a not valid message
    if (!ctx.message.text || ctx.message.text.length > 1000) {
        return
    }

    // creating the base text parts
    let original_text = ctx.message.text
    ctx.message.text = trimStart(trimlike(teging(original_text)))
    const text = ctx.message.text

    // Using command
    await use_command_front(text, user, ctx)

    // Going througth the text
    switch (text.toLowerCase()) {
        case "бот":
        case "помка":
            // Checks the bot
            await check_bot(ctx)
            break
        case "версия":
            // Gets the bot version
            await get_version(ctx)
            break
        case "команды":
            // Get all commands
            await CommandSort.start(ctx)
            break
        case "мои команды":
            // Get user's commands
            await Usr_CommandSort.start(ctx, user)
            break
        case "о боте":
            // Send bot info
            await Reply.r(ctx, start_message)
            break
    }

    const textWords = text.split(" ")
    // Creating the first word and last words
    const f_word = textWords[0]
    const l_words = textWords.slice(1).join(" ") || " "

    // Switching throgth the first word
    switch (f_word.toLowerCase()) {
        case "создать":
            // Creating a command
            await create_command_front(l_words, user, ctx)
            break
        case "удалить":
            // Deleting the command
            await delete_command_front(l_words, user, ctx)
            break
        case "изменить":
            // Editing the command
            await edit_command_front(l_words, user, ctx)
            break
        case "команда":
            // Viewing the command
            await view_one_front(l_words, user, ctx)
            break
        case "действие":
            // Getting a transaction 
            await view_operatiom(l_words, ctx)
            break
        case "данные":
            // Getting all data
            await get_all_data(l_words, user, ctx)
            break
    }


    if (textWords.length < 2) {
        return
    }

    // Creating the first 2 words and last words
    const s_word = f_word + " " + textWords[1]
    const ls_words = textWords.slice(2).join(" ") || " "

    switch (s_word.toLowerCase()) {
        case "твои команды":
            // Viewing user's commands
            await Usr_CommandSort.start_with_user(ls_words, ctx)
            break
        case `блок ${password}`:
            // blocking user
            await block_user_front(ls_words, user, ctx, true)
            break
        case `разблок ${password}`:
            // unblocking user
            await block_user_front(ls_words, user, ctx, false)
            break
    }

})

bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data.split('/');
    switch (data[0]) {
        case "view_all_commands":
            await CommandSort.get_from(data[1], Number(data[2]), ctx)
            break
        case "view_usr_commands":
            await Usr_CommandSort.get_from(Number(data[1]), data[2], Number(data[3]), ctx)
    }
})

try {
    bot.launch()
} catch (err) {
    console.error(err)
}
try {
    bot.telegram.getMe().then(botInfo => {
        const username = botInfo.username;
        const options = {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        let ServerTime = new Date()
        ServerTime = ServerTime.toLocaleString('ru-RU', options);
        const launchMessage = `Версия бота ${version} запущена✅
Бот: @${username}🤖
Имя хоста: ${os.hostname()}💻
Тип бота: ${Use_tocken['bot type']}
Время: ${ServerTime}🕗`;
        chanelBot.telegram.sendMessage(creator, launchMessage, { parse_mode: 'HTML' });
    });
} catch (err) {
    console.error(err)
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));