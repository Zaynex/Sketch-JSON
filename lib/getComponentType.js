import { ifLabel } from './util'

const MSRectangleShape = /(MSRectangleShape|MSShapeGroup|MSSymbolMaster|MSLayerGroup)/i
const MSTextLayer = /MSTextLayer/i
const MSCircleShape = /MSOvalShape/i

const getComponentType = (type, name, tempFrame, tempAttributedString) => {

  if (MSRectangleShape.test(type) && name.indexOf('Point') && name.indexOf('circle')) return { name: 'rounded_rect' }
  if (name == 'Point' && type == 'MSShapeGroup') return { name: 'triangleb' }
  if (
    type == 'MSShapeGroup' && ~name.indexOf('Avatar')
  ) {
    return { name: 'image_view' }
  }
  if(name == 'circle') {
    return {name: 'circle_rect'}
  }

  if (MSTextLayer.test(type)) {
    return { name: (ifLabel(tempFrame, tempAttributedString) ? 'label' : 'text_view') }
  }

  return {
    name: type
  }
}

module.exports = getComponentType