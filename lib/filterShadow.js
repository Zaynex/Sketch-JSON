const filterShadow = ({shadows}) => {
    const [{
            color:{value},
            offsetX,
            offsetY
        }
    ] = shadows

    
    return {
        shadowColor: value,
        shadowOffsetX: offsetX,
        shadowOffsetY: offsetY
    }
}

module.exports = filterShadow