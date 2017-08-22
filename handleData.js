import {
  getFrame,
  getComponentName,
  getTextDescription,
  getComponentType,
  getBorders,
  getShadow,
  getBackground,
  getFourBorderRadius
} from './lib'
import ICON_MAP from './iconMap.js'

let idx = 0
function handleData(node, level, x, y, i) {
  if(!node) return
  let {
    frame,
    attributedString,
    style,
    resizingType,
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
    // || (classType == 'MSLayerGroup' && name == 'more')
    // || (classType == 'MSLayerGroup' && name == 'menu')
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
      (classType == 'MSLayerGroup' && name == 'icon-avatar')
    ) {
      tempFourBorderRadius = {
        br: Math.round(tempFrame.width / 2)
      }
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
    if (classType == 'MSShapeGroup' && name == 'Oval') {
      node.layers = []
      return Object.assign(tempFrame, tempFourBorderRadius, { name: 'image_view' })
    }

    if (classType == 'MSShapeGroup' && name == 'Rectangle-path') {
      node.layers = []
      return ICON_MAP(name, tempFrame, tempFill)
      // return Object.assign(tempFrame, tempIcon, { is: iconSize(), tc: tempFill.bg, o: tempFill.o, icon: DEFAULTICON })
    }

    if (name == 'icon-avatar') {
      console.log(tempFourBorderRadius)
      node.layers = []
      return Object.assign(tempFrame, tempFourBorderRadius, { name: 'image_view', z: 1000 })
    }

    /**
     * 这部分逻辑与 android 的相冲突，需要修改下sketch文件
     * 重新制定下规则
     */
    // if (classType == 'MSShapeGroup' && name == 'Mask') {
    //   node.layers = []
    //   console.log(tempFourBorderRadius)
    //   // return Object.assign(tempFrame, tempFourBorderRadius, tempComponentType)
    //   return Object.assign(tempFrame, tempFourBorderRadius, tempComponentName, { name: 'image_view', z: 1000 })
    // }

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
     * for icons start
     */
    if (name == 'Refresh') {
      // 给下面的数组清0 ，不进入子组件循环
      node.layers = []
      return ICON_MAP(name, tempFrame)
    }
    if (classType == 'MSShapeGroup' && (name == 'Search Icon')) {

      node.layers = []
      return ICON_MAP(name, tempFrame, tempFill)
      // return Object.assign(tempFrame, tempIcon, { icon: 'ci-yql-search' }, { is: iconSize(), tc: tempFill.bg })
    }
    if (name == 'Clear') {
      node.layers = []
      return ICON_MAP(name, tempFrame, tempFill)
      // return Object.assign(tempFrame, tempIcon, { icon: 'mb-times-circle-filled' }, { is: iconSize(), tc: tempFill.bg })
    }

    if (name == 'Arrow' && classType == 'MSLayerGroup') {
      node.layers = []
      return ICON_MAP(name, tempFrame)
      // return Object.assign(tempFrame, { left: left - 5, top: top - 2 }, tempIcon, { icon: 'fa-angle-right' }, { is: iconSize(), tc: bg })
    }

    if ((classType == 'MSShapeGroup' && name.indexOf('Icon') == 0)) {
      node.layers = []
      // default icon 
      return ICON_MAP(name, tempFrame)
      // return Object.assign(tempFrame, tempIcon, { icon: 'mb-widget-icon-label' })
    }







    /**
     * material design icon 
     */
    if (name == 'icon-share') {
      node.layers = []
      return ICON_MAP(name, tempFrame)
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-share' })
    }
    if (name == 'icon-upload') {
      node.layers = []
      return ICON_MAP(name, tempFrame)      
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-cloud_upload' })
    }
    if (name == 'icon-copy') {
      node.layers = []
      return ICON_MAP(name, tempFrame)            
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-content_copy' })
    }
    if (name == 'icon-print') {
      node.layers = []
      return ICON_MAP(name, tempFrame)      
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-print' })
    }
    if (name == 'mic') {
      node.layers = []
      return ICON_MAP(name, tempFrame)      
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-mic' })
    }
    /** 会存在 search组件是一个 LayerGroup，但是 icon也是 LayerGroup */
    if (classType == 'MSLayerGroup' && name == 'search' && node.layers[0].name == 'Shape') {
      node.layers = []
      return ICON_MAP(name, tempFrame)
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-search' })
    }
    if (name == 'icon-reply') {
      node.layers = []
      return ICON_MAP(name, tempFrame)
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-reply' })
    }
    if (name == 'icon-archive') {
      node.layers = []
      return ICON_MAP(name, tempFrame)      
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-archive' })
    }
    // if (name == 'Imported Layers') {
    //   node.layers = []
    //   return Object.assign(tempFrame, tempIcon, { icon: 'md-mail_outline' })
    // }

    /**
     * material design App bar 
     */
    if (classType == 'MSLayerGroup' && name == 'icon-more') {
      node.layers = []
      return ICON_MAP(name, tempFrame)
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-more_vert', tc: '#fff' })
    }
    if (classType == 'MSLayerGroup' && name == 'icon-menu') {
      node.layers = []
      return ICON_MAP(name, tempFrame)
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-menu', tc: '#fff' })
    }

    if (classType == 'MSLayerGroup' && name == 'Back') {
      // icon 位置渲染会出现问题, 手动调
      let tc = node.layers && node.layers.length && getBackground(node.layers[node.layers.length - 1].style).bg
      node.layers = []
      return ICON_MAP(name, tempFrame, {bg: tc})
      // return Object.assign(tempFrame, tempIcon, { left: left, top: top - 3, icon: 'fa-angle-left' }, { tc, is: 36 })
    }

    if (name == 'icon-arrow') {
      node.layers = []
      return ICON_MAP(name, tempFrame)
      // return Object.assign(tempFrame, tempIcon, { icon: 'md-arrow_drop_up' })
    }
    if (name == 'icon-hangouts' || name == 'icon-gplus' || name == 'icon-gmail' || name == 'icon-more-h' || name == 'icon-message' || name == 'icon-mail') {
      node.layers = []
      return ICON_MAP(name, tempFrame)
      // return Object.assign(tempFrame, tempIcon, { icon: DEFAULTICON })
    }
    /**
     * for icons end
     */



    /**
     * for Line
     * 将其宽度或者高度设为border-width
     */
    if (classType === 'MSShapeGroup' && ~name.indexOf('Line')) {
      let { bs, bc } = tempBorders
      let { width, height, left, top } = tempFrame
      let tempLineStyle = { name: 'rounded_rect', bg: bc, bs: 0 }

      if (+height == 3 && (+height < +width)) {
        return Object.assign(tempLineStyle, tempFrame, { height: bs })
      }
      return Object.assign(tempLineStyle, { width: bs, left: left, height: +height + 2, top: +top - 2 })
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
      { z: idx++, resizingType }))
  }
}

module.exports = handleData