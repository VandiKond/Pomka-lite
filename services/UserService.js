const { User } = require('../models');
const TransactionService = require('./TransactionService');

class UserService {
    /**
     * Creating a new user if not exists or updates the username
     * @param {number} id - the id of the user
     * @param {string} username - the username of the user
     * @param {string} nickname - the nickname of the user
     * @returns A user
     */
    constructor(id, username, nickname) {
        // Creating data
        let data = {
            UserId: id
        }
        // Returning the async functiom
        return (async () => {
            // Getting the user
            let user = await User.findByPk(id) || {}
            // If not exists creating it
            if (!user.UserId && nickname && username) {
                // Adding  nickname to data
                data.Nickname = nickname

                // adding the username
                data.Username = username

                // Creating a new user
                user = await User.create(data)
                await new TransactionService(id, "Создание пользователя", `Создан поьзователь с никнеймом ${nickname} и юзернеймом @${username}`)
            } else if ((username || nickname) && user.UserId) {
                // adding the username
                if (username && username !== user.Username) {
                    data.Username = username
                }
                // adding the nickname
                if (nickname && nickname !== user.Nickname && !user.IsBlocked) {
                    data.Nickname = nickname
                }
                // updating the user
                await User.update(data, {
                    where: { UserId: id }
                });
            } else if (!user.UserId) {
                return null
            }
            return user
        })()
    }

    /**
     * Gets all user
     * @returns an array of users
     */
    static async getAll() {
        return await User.findAll();
    }

    /**
     * blocks a user
     * @param {number} id - the id of the user
     * @param {boolean} block - should it bloock or unblock
     * @returns the updated user
     */
    static async block(id, block) {
        const user = await new UserService(id)
        const data = {
            IsBlocked: block
        }
        if (block) {
            data.TimesBlocked = user.TimesBlocked + 1,
            data.Nickname = "~"
        }
        await User.update(data, { where: { UserId: id } })
        await new TransactionService(id, "Блокировка", `Блокировка? : ${block}`)
        return user
    }

    /**
     * deletes the user
     * @param {number} id - the id of user
     * @returns the user that is deleted
     */
    static async delete(id) {
        return await User.destroy({
            where: { UserId: id }
        });
    }
}

module.exports = UserService;