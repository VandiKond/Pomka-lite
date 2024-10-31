const { creator } = require("./Config.bot/Config");
const getUser = require("./get_user");
const UserService = require("./services/UserService");

async function block_user_front(text, user, ctx, block) {
    let reply_text = ""
    try {
        const [block_user] = await getUser(text, ctx)
        if (!block_user) {
            reply_text  =  `❌ Ошибка : пользователь не найден`
            return

        }
        await block_user_back(user, block_user.UserId, block)

        let is_block = ""
        if (block) is_block = "заблокирован" 
        else is_block = "разблокирован"
        reply_text = `<a href='${await Link.l(block_user)}'>${block_user.Nickname}</a> ${is_block}`
    } catch (err) {
        // If one of existing errors
        if (
            (err.code === 423 && err.name === "UserIsNotCreator") ||
            (err.code === 429 && err.name === "UserIsAlreadyBlocked") ||
            (err.code === 429 && err.name === "UserIsNotBlocked")
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
 * Blockes or unblocks a user
 * @param {number} request_user - the user that is creating the block request
 * @param {number} user - the user to block
 * @param {boolean} block - block or unblock
 * @returns a user
 */
async function block_user_back(request_user, user, block) {
    if (request_user !== creator) {
        let err = new Error("Ты не создатель бота")
        err.code = 423
        err.name = "UserIsNotCreator"
    }

    const userData = await new UserService(user)

    if (userData.IsBlocked && block) {
        let err = new Error("Пользователь уже заблокирован")
        err.code = 429
        err.name = "UserIsAlreadyBlocked"
        throw err
    }

    if (!userData.IsBlocked && !block) {
        let err = new Error("Пользователь уже разблокирован")
        err.code = 429
        err.name = "UserIsNotBlocked"
        throw err
    }

    return await UserService.block(user, block)
}

module.exports = block_user_front