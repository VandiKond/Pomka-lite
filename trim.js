/**
 * Trims the '.', '!', '/', ' ' characters in the text
 * @param {string} text - the text to trim
 * @returns the result
 */
var trimStart = function (text) {
    const charsToRemove = ['.', '!', '/', ' ']; 
    let i = 0;
    while (i < text.length && charsToRemove.includes(text[i])) {
        i++;
    }
    return text.substring(i);
}

/**
 * Deletes multy-space
 * @param {string} text - the text to trim
 * @returns the result text
 */
var trimlike = function (text) {
    return String(text).replace(/ +/g, ' '); 
}

module.exports = { trimStart, trimlike }