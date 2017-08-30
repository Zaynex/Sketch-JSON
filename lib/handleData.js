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
function handleData(node, level, x, y, i) {
  if(!node) return
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
    || (classType == 'MSLayerGroup' && name == 'Table View/Elements/Slider')
    || (classType == 'MSLayerGroup' && name == 'Refresh')
    // material design icon
    || (classType == 'MSLayerGroup' && name == 'icon-share')
    || (classType == 'MSLayerGroup' && name == 'icon-upload')
    || (classType == 'MSLayerGroup' && name == 'icon-copy')
    || (classType == 'MSLayerGroup' && name == 'icon-print')
    || (classType == 'MSLayerGroup' && name == 'mic')
    || (classType == 'MSLayerGroup' && name == 'search')
    || (classType == 'MSLayerGroup' && name == 'icon-reply')
    || (classType == 'MSLayerGroup' && name == 'icon-archive')
    || (classType == 'MSLayerGroup' && ~name.indexOf('App Icon'))
    || (classType == 'MSLayerGroup' && name == 'Back')
    || (classType == 'MSLayerGroup' && name == 'Arrow')
    || (classType == 'MSLayerGroup' && name == 'icon-arrow')
    || (classType == 'MSLayerGroup' && name == 'icon-avatar')
    || (classType == 'MSLayerGroup' && name == 'icon-hangouts')
    || (classType == 'MSLayerGroup' && name == 'icon-gmail')
    || (classType == 'MSLayerGroup' && name == 'icon-gplus')
    || (classType == 'MSLayerGroup' && name == 'icon-message')
    || (classType == 'MSLayerGroup' && name == 'icon-gplus')
    || (classType == 'MSLayerGroup' && name == 'icon-more-h')
    || (classType == 'MSLayerGroup' && name == 'icon-mail')
    || (classType == 'MSLayerGroup' && name == 'icon-more')
    || (classType == 'MSLayerGroup' && name == 'icon-menu')
    || (classType == 'MSLayerGroup' && name == 'icon-add')
  ) {
    let tempFrame = { ...(frame && getFrame(frame)), left: x, top: y }
    let tempComponentName = name && getComponentName(name)
    let tempAttributedString = attributedString && getTextDescription(attributedString)
    let tempShadow = style && getShadow(style)
    let tempFill = style && getBackground(style)
    let tempComponentType = classType && getComponentType(classType, name, tempFrame, tempAttributedString)
    let tempBorders = style && getBorders(style, tempComponentType, name)
    let tempFourBorderRadius
    // 过滤 sketch 组件里面的 base
    if(name == 'Popover') {
      node.layers.splice(0, 1)
    }
    /**
     * 如果是矩形的遮罩层，必须带上 4个border边框属性
     */
    if (
      classType === 'MSShapeGroup' && (~name.indexOf('Rectangle') || ~name.indexOf('Mask') || ~name.indexOf('Base') || ~name.indexOf('Path') || name == 'Search Bar')
    ) {
      let path = node.layers && node.layers[0].path
      tempFourBorderRadius = path && getFourBorderRadius(path)
    }


    /**
     * 将矩形转换为圆形
     */
    if (
      classType == 'MSShapeGroup' && (name == 'Unread' || name == 'Avatar' || name == 'Knob' || name == 'Oval') ||
      (classType == 'MSLayerGroup' && name == 'icon-avatar') ||
      (name == 'icon-add bg')
    ) {
      tempFourBorderRadius = {
        br: Math.round(tempFrame.width / 2)
      }
    }

    if(classType == 'MSShapeGroup') {
      node.layers= []
    }
    /**
     * material design list sheet
     * 可能对会IOS造成影响
     */
    if(classType == 'MSTextLayer' && (name == 'Share' || name == 'Upload' || name == 'Copy' || name == 'Print this page')) {
      console.log(name)
      let {top } = tempFrame
      tempFrame = {...tempFrame, top: top + 5}
    }


    /** material design two lines with avatar and icon */
    if (classType == 'MSShapeGroup' && name == 'Oval' || name == 'icon-avatar') {
      node.layers = []
      return Object.assign(tempFrame, tempFourBorderRadius, {resizingConstraint: resizingConstraint}, { name: 'image_view' }, {z: 1000})
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
     * *****************
     *  for icon start
     * *****************
     * *****************
     */
    if (
      name == 'Refresh'
      || (classType == 'MSShapeGroup' && name.indexOf('Icon') == 0)
      || (name == 'Arrow' && classType == 'MSLayerGroup')
      || (name == 'icon-share')
      || (name == 'icon-upload')
      || (name == 'icon-copy')
      || (name == 'icon-print')
      || (name == 'mic')
      || (classType == 'MSLayerGroup' && name == 'search' && node.layers[0].name == 'Shape')
      || (name == 'icon-reply')
      || (name == 'icon-archive')
      || (name == 'icon-add')
      || (classType == 'MSLayerGroup' && name == 'icon-more')
      || (classType == 'MSLayerGroup' && name == 'icon-menu')
      || (name == 'icon-arrow')
      || name == 'mb-back' || name == 'mb-home' || name == 'mb-recent'
      || (name == 'icon-hangouts' || name == 'icon-gplus' || name == 'icon-gmail' || name == 'icon-more-h' || name == 'icon-message' || name == 'icon-mail' || name == 'mb-icon')
    ) {
      // 给下面的数组清0 ，不进入子组件循环
      node.layers = []
      return ICON_MAP(name, tempFrame)
    }
    if (
      classType == 'MSShapeGroup' && (name == 'Search Icon')
      || name == 'Clear'
      || (classType == 'MSShapeGroup' && name == 'Rectangle-path')
    ) {
      node.layers = []
      return ICON_MAP(name, tempFrame, tempFill)
    }
    /**
     * *****************
     * *****************
     *  for icon end
     * *****************
     * *****************
     */


    if (classType == 'MSLayerGroup' && name == 'Back') {
      // icon 位置渲染会出现问题, 手动调
      let tc = node.layers && node.layers.length && getBackground(node.layers[node.layers.length - 1].style).bg
      node.layers = []
      return ICON_MAP(name, tempFrame, {bg: tc})
    }


    /**
     * for Line
     * 将其宽度或者高度设为border-width
     */
    if(classType == 'MSShapeGroup'&& ~name.indexOf('mb-line')) {
      let {left , top } = tempFrame
      let { bs, bc } = tempBorders
      let lineType = name === 'mb-line-ha' ? 'hr' : 've'
      // 有个问题 5px差值
      let fix = Math.round((10 - bs) / 2)
      const defaultLine = {...tempFrame, bc: bc, bs:0, name: lineType}
      if(lineType == 'hr') {
        return {...defaultLine, height:10, top: top - fix + 1}
        // return Object.assign(tempFrame, {height: 10, top: top - 5 - 4, bc: bc, bs: 0, name: lineType})
      }else {
        return {...defaultLine, width: 10, left: left - fix}
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