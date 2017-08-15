const MSRectangleShape = /(MSRectangleShape|MSShapeGroup|MSSymbolMaster|MSLayerGroup)/i
const MSTextLayer = /MSTextLayer/i
const MSCircleShape = /MSOvalShape/i
const filterComponentType = (type) => {
    
    if(MSRectangleShape.test(type)) return {name: 'rounded_rect'}
    if(MSTextLayer.test(type)) return {name: 'text_view'}
    if(MSCircleShape.test(type)) return {name: 'circle_rect'}
    return {
        name: type
    }
}

module.exports = filterComponentType