const UserService = require("./services/UserService");

/**
 * creates a link of a user based on its username
 * @param {UserService} user 
 * @returns the link to a user
 */
async function l(user = {}) {
    if (user.Username !== "none") {
        return `t.me/${user.Username}`
    }
    return `tg://openmessage?user_id=${user.UserId}`
}

module.exports = l 
