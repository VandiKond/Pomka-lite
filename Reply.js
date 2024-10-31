
/**
 * A function to send telegram messages
 * @param {Object} ctx - Message data
 * @param {string} text - Text 
 * @param {Object} inlineButtons - Data of the inline buttons of the message
 * @param {Boolean} previewLinks - Shouldn't the bot preview preview links 
 * @returns ctx with the new message id
 */
async function r(ctx, text, inlineButtons, previewLinks = true) {
    // Checking the data types
    if (!text) {
        return ctx
    }
    
    if (typeof text !== 'string') {
        throw new TypeError('Message text needs to be a string');
    }

    // If the inline buttons are not an object ore they are missed
    if (inlineButtons && typeof inlineButtons !== 'object') {
        // Create empty data
        inlineButtons = {}
    }

    // Cpliting the text to parts 
    const messageParts = text.split('\n');

    // getting the id of the reply 
    let replyToMessageId = null;
    if (ctx.message && ctx.message.message_id) {
        // Andswering to the last message
        replyToMessageId = ctx.message.message_id;
    }

    // Creating sendtet and messages to edit
    let sendText = ""
    let messgeToEdit

    // Going throuth textparts
    for (let i = 0; i < messageParts.length; i++) {
        // getting the current part
        const part = messageParts[i];

        // getting the length of the next message
        let len = part.length + sendText.length

        // Creating a i + 1 
        let ip1 = i + 1

        // In case lenth is more than 4000 or it's the last iteration
        if (len >= 4000 || messageParts.length === ip1) {
            // Creationg options of the message
            const options = {
                parse_mode: 'HTML',
                reply_to_message_id: replyToMessageId,
                disable_web_page_preview: previewLinks,
            };

            // Adding buttuns if exist
            if (inlineButtons && messageParts.length === ip1) {
                options.reply_markup = inlineButtons;
            }
            
            // If it's the last iteration
            if (messageParts.length === ip1) {
                // Replying with the option
                messgeToEdit = await ctx.reply(`${sendText}\n${part}`, options);
                messgeToEdit = messgeToEdit.message_id

                // making empty send text
                sendText = ''
            } else {
                // Replying with the options
                await ctx.reply(sendText, options);

                // making empty send text
                sendText = part
            }
        } else { 
            // Else editing the send text
            sendText += `\n${part}` 
        }
    } 

    // Adding the new message id
    try {
        ctx.message.message_id = messgeToEdit
    } catch (err) {

    }

    // Returning ctx
    return ctx
}

module.exports = r