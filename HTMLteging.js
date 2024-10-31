/**
 * removes all htnl tags
 * @param {string} input - the input strting
 * @returns string without html tags
 */
function teging(input) {
    input = String(input)
    input = input.replace(/<[^>]+>/g, "");
    input = input.replace("<", "")
    input = input.replace(">", "")
    return input
}


module.exports = teging