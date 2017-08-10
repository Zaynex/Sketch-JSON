const filterFourBorderRadius = path => {
    const {points: [{
        cornerRadius
    }]} = path
    /**
     * bd: border-radius
     */
    return {
        bd: cornerRadius
    }
}

module.exports = filterFourBorderRadius
