const filterBorders = ({borders}) => {
    
    const [{color: {value}, thickness}] = borders
    /**
     * bc: borderColor,
     * bs: borderWidth
     */
    return {
        bc: value,
        bs: thickness || 0
    }
}

module.exports = filterBorders