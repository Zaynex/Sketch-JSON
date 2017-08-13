const filterComponentType = (type) => {
    const MSRectangleShape = /MSRectangleShape/g
    const MSTextLayer = /MSTextLayer/g
    const MSShapeGroup = /MSShapeGroup/g
    const MSLayerGroup = /MSLayerGroup/g
    if(MSRectangleShape.test(type) 
        || MSShapeGroup.test(type)
        || MSLayerGroup.test(type)
    ) return {name: 'rounded_rect'}
    if(MSTextLayer.test(type)) return {name: 'text_view'}
    return {
        name: type
    }
}

module.exports = filterComponentType