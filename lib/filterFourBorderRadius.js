const filterFourBorderRadius = path => {
    const {points: [{
        cornerRadius
    }]} = path
    /**
     * br: border-radius
     */
    return {
        br: cornerRadius
    }
}

module.exports = filterFourBorderRadius
