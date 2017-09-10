import {
  getFrame,
  getComponentName,
  getTextDescription,
  getComponentType,
  getBorders,
  getShadow,
  getBackground,
  getFourBorderRadius
} from './index'
import ICON_MAP from './iconMap.js'

let idx = 0
function handleData (node, level, x, y, i) {
  if (!node) return
  let {
    frame,
    attributedString,
    style,
    resizingType,
    resizingConstraint,
    name
  } = node
  let classType = node['<class>']
  let tempFrame = { ...(frame && getFrame(frame)), left: x, top: y }
  let tempComponentName = name && getComponentName(name)
  let tempAttributedString = attributedString && getTextDescription(attributedString, tempFrame)
  let tempShadow = style && getShadow(style)
  let tempFill = style && getBackground(style)
  let tempComponentType = classType && getComponentType(classType, name, tempFrame, tempAttributedString)
  let tempBorders = style && getBorders(style, tempComponentType, name)
  const childNodeLayers = node.layers && node.layers.length && node.layers[0]

  // 目前不支持四角设定边框暂时先按照sketh文件名过滤
  const ignoreCircleComponent = 'filter-br'
  let tempFourBorderRadius = !name.includes(ignoreCircleComponent) && childNodeLayers && getFourBorderRadius(childNodeLayers)
  // 过滤 sketch 组件里面的 base
  if (name == 'Popover') {
    node.layers.splice(0, 1)
  }


  /**
   * 将矩形转换为圆形
   * 在 sketch 的 layer中，使用圆形画可自动识别
   */
  const ifCircle = (childNodeLayers, name) => {
    return (childNodeLayers && childNodeLayers['<class>'] == 'MSOvalShape') || name.includes('Knob') ? true : false
  }

  tempFourBorderRadius = childNodeLayers && ifCircle(childNodeLayers, name) ? { ...tempFourBorderRadius, br: Math.round(tempFrame.width / 2) } : tempFourBorderRadius

  /**
   * 去掉ShapeGroup中可能存在的下层layer
   */
  if (classType == 'MSShapeGroup') {
    node.layers = []
  }

  /** material design two lines with avatar and icon */
  if (classType == 'MSShapeGroup' && (name == 'Oval_img' || name == 'Mask_img')) {
    node.layers = []
    return { ...tempFrame, ...tempFourBorderRadius, resizingConstraint: resizingConstraint, name: 'image_view', z: 1000 }
  }

  /**
   * IOS control Two 组件
   * 去掉白色的BG
   * 增加边框
   */
  if (name === 'BG' && style.fills && style.fills.length == 0) {
    return
  }


  /**
   * IOS control_popover
   */
  if (name == 'Point') {
    Object.assign(tempFrame, tempComponentType, { tc: tempFill.bg })
  }

  /**
   * *****************
   *  for icon
   * *****************
   */
  if (name.includes('icon')) {
    // 给下面的数组清0 ，不进入子组件循环
    node.layers = []
    return { ...ICON_MAP(name, tempFrame, tempFill, tempBorders), resizingConstraint }
  }



  /**
   * for Line
   * 将其宽度或者高度设为border-width
   */
  if (classType == 'MSShapeGroup' && ~name.indexOf('mb-line')) {
    let { left, top } = tempFrame
    let { bs, bc } = tempBorders
    let lineType = name === 'mb-line-ha' ? 'hr' : 've'
    // 有个问题 5px差值
    let fix = Math.round((10 - bs) / 2)
    const defaultLine = { ...tempFrame, bc: bc, bs: 0, name: lineType, z: 300 }
    if (lineType == 'hr') {
      return { ...defaultLine, height: 10, top: top - fix + 1 }
    } else {
      return { ...defaultLine, width: 10, left: left - fix }
    }
  }


  tempBorders && Object.assign(tempFrame, tempBorders)
  tempShadow && Object.assign(tempFrame, tempShadow)

  if (tempFill && name.indexOf('Label')) {
    Object.assign(tempFrame, tempFill)
  }

  tempFourBorderRadius && Object.assign(tempFrame, tempFourBorderRadius)

  return (Object.assign(tempFrame,
    tempComponentName,
    tempAttributedString,
    tempComponentType,
    { z: idx++, resizingType, resizingConstraint }))
}

module.exports = handleData