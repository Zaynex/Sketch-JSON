const filterComponentType = (type) => {
    const MSRectangleShape = /MSRectangleShape/g
    const MSTextLayer = /MSTextLayer/g

    if(MSRectangleShape.test(type)) return {name: 'rounded_rect'}
    if(MSTextLayer.test(type)) return {name: 'text_view'}
    return {
        name: type
    }
}

module.exports = filterComponentType