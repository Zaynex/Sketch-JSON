const MSRectangleShape = /(MSRectangleShape|MSShapeGroup|MSSymbolMaster|MSLayerGroup)/i
const MSTextLayer = /MSTextLayer/i
const MSCircleShape = /MSOvalShape/i
const ifLabel = (tempFrame, tempAttributedString) => {
    return (tempFrame.height == tempAttributedString.lh ? true : false)
}
const filterComponentType = (type, name, tempFrame, tempAttributedString) => {

    if (MSRectangleShape.test(type) && name.indexOf('Icon') && name.indexOf('App Icon') && name.indexOf('Point')) return { name: 'rounded_rect' }
    if (name == 'Point' && type == 'MSShapeGroup') return {name: 'triangleb'}
    if (
        type == 'MSShapeGroup' && ~name.indexOf('Avatar')
        || 
        type =='MSLayerGroup' && ~name.indexOf('App Icon')
    ) { 
        return { name: 'image_view'} 
    }

    if (MSTextLayer.test(type)) {
        return { name: (ifLabel(tempFrame, tempAttributedString) ? 'label' : 'text_view') }
    }

    if (MSCircleShape.test(type)) return { name: 'circle_rect' }
    return {
        name: type
    }
}

module.exports = filterComponentType