const { sequelize } = require('./models'); 
const UserService = require('./services/UserService');

/**
 * Gets a user
 * @param {string} text - the text of the message
 * @param {Object} ctx - the telegram message data
 * @returns an array with the user is get and the text without the mention
 */
async function getUser(text, ctx) {
    let user;
    try {
        // Lowering the text
        const textLower = text.toLowerCase();
        // Finding the user by @
        const usernameMatch = textLower.match(/@(\w+)/);
        if (usernameMatch ) {
            // Gettig the user
            let username = usernameMatch[1]
            // Finding the user by username
            const [user] = await sequelize.query(`SELECT * FROM Users WHERE Username = :username`,
                { replacements: { username } }
            );
            if (user.length) {
                // Finding the text without the mention 
                const username = text.substring(usernameMatch.index, usernameMatch[0].length + usernameMatch.index+1)
                const textWithOutUserame = text.replace(username, '').trim();

                // returning the user and the text without the username
                return [user[0], textWithOutUserame];
            }
        }

        // Getting the last number
        const numMatch = text.match(/\d+(?=\D*$)/)
        if (numMatch) {
            // Getting the user my id
            user = await new UserService(numMatch)
            if (user) {
                // Finding the text without the id 
                const id_text = text.substring(numMatch.index, numMatch[0].length + numMatch.index+1)
                const textWithOutId = text.replace(id_text, '').trim();
                
                // returning the user and the text without the id
                return [user, textWithOutId];
            }
        }

        // Finding a mention
        const mentionedUser = ctx.message.entities.find(entity => entity.type === 'text_mention');
        if (mentionedUser) {
            // Getting the user
            let userId = mentionedUser.user.id;
            user = await new UserService(userId)
            if (user) {
                // getting the first name
                var firstName = mentionedUser.user.first_name;

                // If the text was lowerd be4
                if (textLower === text) {
                    firstName = firstName.toLowerCase()
                }

                // getting the text without the mention
                const textWithOutMention = text.replace(firstName, '').trim();

                // returning the user and the text without the mention
                return [user, textWithOutMention];
            }
        }

        // If none of it worked
        throw new Error("Пользователь не найден")

    } catch (err) {
        try {
            // Checking a reply
            if (ctx.message.reply_to_message) {
                // getting the user
                let id = ctx.message.reply_to_message.from.id;
                user = await new UserService(id)
                if (user) {
                    // Returning the user and text
                    return [user, text]; 
                }
            }
            // Returning null and text
            return [null, text];
        } catch (err) {
        }
        // Returning null and text
        return [null, text];
    }
}

module.exports = getUser
