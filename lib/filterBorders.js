const filterBorders = ({borders}) => {
    
    const [{color: {value}, thickness}] = borders
    /**
     * bc: borderColor,
     * bs: borderWidth
     */
    return {
        bc: value,
        bs: thickness
    }
}

module.exports = filterBorders