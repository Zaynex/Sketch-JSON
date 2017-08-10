const filterFill = ({fills}) => {
    const [{
        color: {
            value
        }
    }] = fills
    /**
     * bg: backgroundColor
     */
    return {
        bg: value
    }
}

module.exports = filterFill