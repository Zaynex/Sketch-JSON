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
  if (
    classType != 'MSGroup'
    && classType != 'MSPage'
    && classType != 'MSSymbolInstance'
    && classType != 'MSSymbolMaster'
    && classType != 'MSLayerGroup'
    && name != 'Path'
    && name != 'Text'
    && name != 'Text Bound'
    || ~name.indexOf('icon')
  ) {
    let tempFrame = { ...(frame && getFrame(frame)), left: x, top: y }
    let tempComponentName = name && getComponentName(name)
    let tempAttributedString = attributedString && getTextDescription(attributedString, tempFrame)
    let tempShadow = style && getShadow(style)
    let tempFill = style && getBackground(style)
    let tempComponentType = classType && getComponentType(classType, name, tempFrame, tempAttributedString)
    let tempBorders = style && getBorders(style, tempComponentType, name)
    let tempFourBorderRadius
    // 过滤 sketch 组件里面的 base
    if (name == 'Popover') {
      node.layers.splice(0, 1)
    }
    /**
     * 如果是矩形的遮罩层，必须带上 4个border边框属性
     */
    if (
      classType === 'MSShapeGroup' && (name == 'Mask_img' || name == ('Popover-rc') || ~name.indexOf('Rectangle') || ~name.indexOf('Base') || ~name.indexOf('Path') || name == 'Search Bar' || name == 'button bg')
    ) {
      let path = node.layers.length && node.layers[0].path
      if (name == 'Popover') {
        let fixedRadius = node.layers[0].fixedRadius
        tempFourBorderRadius = getFourBorderRadius(path, fixedRadius)
      }
      else {
        tempFourBorderRadius = path && getFourBorderRadius(path)
      }
    }

    /**
     * 将矩形转换为圆形
     */
    if (
      // knob 是 slider 里面的圆形
      classType == 'MSShapeGroup' && (name == 'Unread' || name == 'Knob' || name == 'Oval_img') ||
      (classType == 'MSLayerGroup' && name == 'icon-avatar') || name == 'circle'
    ) {
      tempFourBorderRadius = {
        br: Math.round(tempFrame.width / 2)
      }
    }

    /**
     * 去掉ShapeGroup中可能存在的下层layer
     */
    if (classType == 'MSShapeGroup') {
      node.layers = []
    }

    /** material design two lines with avatar and icon */
    if (classType == 'MSShapeGroup' && (name == 'Oval_img' || name == 'Mask_img')) {
      node.layers = []
      return Object.assign(tempFrame, tempFourBorderRadius, { resizingConstraint: resizingConstraint }, { name: 'image_view' }, { z: 1000 })
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
     * IOS edit Menu
     */
    if (name == 'Point') {
      Object.assign(tempFrame, tempComponentType, { tc: tempFill.bg })
    }

    /**
     * *****************
     *  for icon
     * *****************
     */
    if (~name.indexOf('icon')) {
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
      const defaultLine = { ...tempFrame, bc: bc, bs: 0, name: lineType, z: 100 }
      if (lineType == 'hr') {
        return { ...defaultLine, height: 10, top: top - fix + 1 }
        // return Object.assign(tempFrame, {height: 10, top: top - 5 - 4, bc: bc, bs: 0, name: lineType})
      } else {
        return { ...defaultLine, width: 10, left: left - fix }
        // return Object.assign(tempFrame, {width: 10, left: left - 4, bc: bc, bs: 0, name: lineType})
      }
    }


    tempBorders && Object.assign(tempFrame, tempBorders)

    tempShadow && Object.assign(tempFrame, tempShadow)

    if (tempFill && name.indexOf('Label')) {
      Object.assign(tempFrame, tempFill)
    }


    if (classType == 'MSLayerGroup' && ~name.indexOf('App Icon')) {
      // 避免颜色被覆盖

      let style = node.layers && node.layers.length && node.layers[0].style
      let background = getBackground(style)
      // ui 给的数据
      Object.assign(tempFrame, background, { br: 4 })
      node.layers = []
    }

    tempFourBorderRadius && Object.assign(tempFrame, tempFourBorderRadius)

    return (Object.assign(tempFrame,
      tempComponentName,
      tempAttributedString,
      tempComponentType,
      { z: idx++, resizingType, resizingConstraint }))
  }
}

module.exports = handleData