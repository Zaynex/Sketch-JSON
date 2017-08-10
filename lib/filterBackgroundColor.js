const filterBackgroundColor = (bool, color) => {
    if (!bool || !color) return false
    return {
        backgroundColor: color.value
    }
}
module.exports = filterBackgroundColor