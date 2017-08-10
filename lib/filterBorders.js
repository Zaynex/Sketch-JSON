const filterBorders = ({borders}) => {
    
    const [{color: {value}, thickness}] = borders
    /**
     * bc: borderColor,
     * bw: borderWidth
     */
    return {
        bc: value,
        bw: thickness
    }
}

module.exports = filterBorders