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

let idx = 0
function handleData(node, level, x, y, i) {
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
    || (classType == 'MSLayerGroup' && name == 'reply icon')
    || (classType == 'MSLayerGroup' && name == 'archive icon')
    || (classType == 'MSLayerGroup' && name == 'more')
    || (classType == 'MSLayerGroup' && name == 'menu')
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
  ) {

    let tempFrame = { ...(frame && getFrame(frame)), left: x, top: y } 
    let tempComponentName = name && getComponentName(name)
    let tempAttributedString = attributedString && getTextDescription(attributedString)
    let tempShadow = style && getShadow(style)
    let tempFill = style && getBackground(style)
    let tempComponentType = classType && getComponentType(classType, name, tempFrame, tempAttributedString)
    let tempBorders = style && getBorders(style, tempComponentType, name)
    let tempFourBorderRadius
    const DEFAULTICON = 'md-message'
    /**
     * icon的默认样式
     */
    let tempIcon = { z: 1000, name: 'icon_button' }
    let iconSize = () => {
      let { width, height } = tempFrame
      return +width > +height ? +width : +height
    }

    if (
      classType === 'MSShapeGroup' && (~name.indexOf('Rectangle') || ~name.indexOf('Mask') || ~name.indexOf('Base') || ~name.indexOf('Path') || name == 'Search Bar')
    ) {
      let path = node.layers && node.layers[0].path
      tempFourBorderRadius = path && getFourBorderRadius(path)
    }
    if (classType == 'MSLayerGroup' && name == 'icon-avatar') {
      tempFourBorderRadius = { br: tempFrame.width / 2 }
    }

    /**
     * 将矩形转换为圆形：添加 border-radius
     */
    if (classType == 'MSShapeGroup' && (name == 'Unread' || name == 'Avatar' || name == 'Knob' || name == 'Mask' || name == 'Oval')) {
      let { width } = frame
      tempFourBorderRadius = {
        br: parseInt(width / 2, 10)
      }
    }

    /** material design two lines with avatar and icon */
    if (classType == 'MSShapeGroup' && name == 'Oval') {
      node.layers = []
      return Object.assign(tempFrame, tempFourBorderRadius, { name: 'image_view' })
    }

    if (classType == 'MSShapeGroup' && name == 'Rectangle-path') {
      console.log(tempFill)
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { is: iconSize(), tc: tempFill.bg, o: tempFill.o, icon: DEFAULTICON })
    }

    if (name == 'icon-avatar') {
      console.log(tempFourBorderRadius)
      node.layers = []
      return Object.assign(tempFrame, tempFourBorderRadius, { name: 'image_view', z: 1000 })
    }

    if (classType == 'MSShapeGroup' && name == 'Mask') {
      node.layers = []
      console.log(tempFourBorderRadius)
      // return Object.assign(tempFrame, tempFourBorderRadius, tempComponentType)
      return Object.assign(tempFrame, tempFourBorderRadius, tempComponentName, { name: 'image_view', z: 1000 })
    }

    /**
     * IOS control Two 组件
     * 去掉白色的BG
     * 增加边框
     */
    if (name === 'BG' && style.fills && style.fills.length == 0) {
      return
    }
    // console.log(name, tempFill)


    /**
     * IOS edit Menu
     */
    if (name == 'Point') {
      Object.assign(tempFrame, tempComponentType, { tc: tempFill.bg })
    }

    /**
     * for icons start
     */
    // 可以把icons保存在一个数组里，然后map 去读取，这样的话会更好
    if (name == 'Refresh') {
      // 给下面的数组清0 ，不进入子组件循环
      node.layers = []
      // return { ...ICON_MAP[name] }
      return Object.assign(tempFrame, tempIcon, { icon: 'fa-repeat' }, { is: iconSize() })
    }
    if (classType == 'MSShapeGroup' && (name == 'Search Icon')) {

      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'ci-yql-search' }, { is: iconSize(), tc: tempFill.bg })
    }
    if (name == 'Clear') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'mb-times-circle-filled' }, { is: iconSize(), tc: tempFill.bg })
    }

    if (name == 'Arrow' && classType == 'MSLayerGroup') {
      node.layers = []
      const bg = "#C7C7CC"
      let { left, top } = tempFrame
      return Object.assign(tempFrame, { left: left - 5, top: top - 2 }, tempIcon, { icon: 'fa-angle-right' }, { is: iconSize(), tc: bg })
    }

    if ((classType == 'MSShapeGroup' && name.indexOf('Icon') == 0)) {
      node.layers = []
      // default icon 
      return Object.assign(tempFrame, tempIcon, { icon: 'mb-widget-icon-label' })
    }







    /**
     * material design icon 
     */
    if (name == 'icon-share') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-share' })
    }
    if (name == 'icon-upload') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-cloud_upload' })
    }
    if (name == 'icon-copy') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-content_copy' })
    }
    if (name == 'icon-print') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-print' })
    }
    if (name == 'mic') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-mic' })
    }
    /** 会存在 search组件是一个 LayerGroup，但是 icon也是 LayerGroup */
    if (classType == 'MSLayerGroup' && name == 'search' && node.layers[0].name == 'Shape') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-search' })
    }
    // if (name == 'reply icon') {
    //   node.layers = []
    //   return Object.assign(tempFrame, tempIcon, { icon: 'md-reply' })
    // }
    // if (name == 'archive icon') {
    //   node.layers = []
    //   return Object.assign(tempFrame, tempIcon, { icon: 'md-archive' })
    // }
    // if (name == 'Imported Layers') {
    //   node.layers = []
    //   return Object.assign(tempFrame, tempIcon, { icon: 'md-mail_outline' })
    // }


    /**
     * material design App bar 
     */
    if (classType == 'MSLayerGroup' && name == 'icon-more') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-more_vert', tc: '#fff' })
    }
    if (classType == 'MSLayerGroup' && name == 'icon-menu') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-menu', tc: '#fff' })
    }

    if (classType == 'MSLayerGroup' && name == 'Back') {
      // icon 位置渲染会出现问题, 手动调
      let { left, top } = tempFrame
      let tc = node.layers && node.layers.length && getBackground(node.layers[node.layers.length - 1].style).bg
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { left: left, top: top - 3, icon: 'fa-angle-left' }, { tc, is: 36 })
    }

    if (name == 'icon-arrow') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-arrow_drop_up' })
    }
    if (name == 'icon-hangouts' || name == 'icon-gplus' || name == 'icon-gmail' || name == 'icon-more-h' || name == 'icon-message' || name == 'icon-mail') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: DEFAULTICON })
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