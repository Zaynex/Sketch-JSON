import {
  filterFrame,
  filterComponentName,
  filterTextDescription,
  filterComponentType,
  filterBorders,
  filterShadow,
  filterFill,
  filterFourBorderRadius
} from './lib'
import sketch from 'sketchjs'
import fs from 'fs'


/** pass */
const quickAction = "sketch/quickAction.sketch"
const quickActionModel = "data/quickActionModel.json"
const quickActionModelResult = "data/quickActionResult.json"

const notification = 'sketch/notification.sketch'
const notificationModel = 'data/notificationModel.json'
const notificationModelResult = "data/notificationModelResult.json"

const widgetBase = "sketch/widgetBase.sketch"
const widgetBaseModel = "data/widgetBaseModel.json"
const widgetBaseResult = "data/widgetBaseResult.json"

const modalOne = "sketch/modalOne.sketch"
const modalOneModel = "data/modalOneModel.json"
const modalOneModelResult = "data/modalOneModelResult.json"

const modalTwo = "sketch/modalTwo.sketch"
const modalTwoModel = "data/modalTwoModel.json"
const modalTwoModelResult = "data/modalTwoModelResult.json"

const modalMult = "sketch/modalMult.sketch"
const modalMultModel = "data/modalMultModel.json"
const modalMultModelResult = "data/modalMultModelResult.json"

const Prompt = "sketch/Prompt.sketch"
const PromptModel = "data/PromptModel.json"
const PromptModelResult = "data/PromptModelResult.json"

const barSafari = "sketch/barSafari.sketch"
const barSafariModel = "data/barSafariModel.json"
const barSafariModelResult = "data/barSafariModelResult.json"

const barSearch = "sketch/barSearch.sketch"
const barSearchModel = "data/barSearchModel.json"
const barSearchModelResult = "data/barSearchModelResult.json"

const normalNested = "sketch/normalNested.sketch"
const normalNestedModel = "data/normalNestedModel.json"
const normalNestedModelResult = "data/normalNestedResult.json"

const thumbMessage = "sketch/thumbMessage.sketch"
const thumbMessageModel = "data/thumbMessageModel.json"
const thumbMessageModelResult = "data/thumbMessageModelResult.json"

const tabFour = "sketch/tabFour.sketch"
const tabFourModel = "data/tabFourModel.json"
const tebFourModelResult = "data/tabFourModelResult.json"

const tabFive = "sketch/tabFive.sketch"
const tabFiveModel = "data/tabFiveModel.json"
const tabFiveModelResult = "data/tabFiveModelResult.json"

const elementSlide = "sketch/elementSlide.sketch"
const elementSlideModel = "data/elementSlideModel.json"
const elementSlideModelResult = "data/elementSlideModelResult.json"

const editMenu = "sketch/editMenu.sketch"
const editMenuModel = "data/editMenuModel.json"
const editMenuModelResult = "data/editMenuModelResult.json"

const actionSheet = "sketch/actionSheet.sketch"
const actionSheetModel = "data/actionSheetModel.json"
const actionSheetModelResult = "data/actionSheetModelResult.json"


/**
 * 圆角问题
 */

const controlTwo = "sketch/controlTwo.sketch"
const controlTwoModel = "data/controlTwoModel.json"
const controlTwoModelResult = "data/controlTwoModelResult.json"

const controlThree = "sketch/controlThree.sketch"
const controlThreeModel = "data/controlThreeModel.json"
const controlThreeModelResult = "data/controlThreeModelResult.json"


/**
 *  need to fix
 */
const barIcon = "sketch/barIcon.sketch"
const barIconModel = "data/barIconModel.json"
const barIconModelResult = "data/barIconModelResult.json"

const barSubtitle = "sketch/barSubtitle.sketch"
const barSubtitleModel = "data/barSubtitleModel.json"
const barSubtitleModelResult = "data/barSubtitleModelResult.json"
/**
 *  need to fix
 */



let newArr = []
sketch.dump(actionSheet, function (json) {
  fs.writeFile(actionSheetModel, JSON.stringify(JSON.parse(json), null, 4), (err) => {
    if (err) console.log(err)
  })
  let data = JSON.parse(json)
  let { pages } = data
  if (pages[0].layers.length == 0 || (pages[0] && pages[0].layers && pages[0].layers.length && pages[0].layers[0]['<class>'] === 'MSSymbolInstance')) {
    depthFirstSearch(pages[1], handleData)
  } else {
    depthFirstSearch(pages[0], handleData)
  }
})


function depthFirstSearch(treeData, callback) {

  let keyLevelStack = (treeData.layers || []).map((node) => {
    return [node, 0, 0, 0]
  }).reverse()
  let nodeLevelLeftTop
  while ((nodeLevelLeftTop = keyLevelStack.pop())) {
    const [node, level, x, y, i] = nodeLevelLeftTop

    callback && newArr.push(callback(node, level, x, y, i))
    if (node.layers && node.layers.length) {
      keyLevelStack = [
        ...keyLevelStack,
        ...node.layers.map((node, i) => {
          const { frame } = node
          return [node, level + 1, x + frame.x, y + frame.y, i]
        }).reverse()
      ]
    }
  }
  newArr = newArr.filter(v => v != undefined)
  newArr = newArr.filter((v, i, a) => v != a[i + 1])
  fs.writeFile(actionSheetModelResult, JSON.stringify(newArr, null, 4), 'utf8', err => { if (err) console.log(err) })
  console.log(newArr)
}













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
    
  ) {
    /**
     * hack for android two line with avator and icon
     */
    if (classType === 'MSShapeGroup' && (name === 'Rectangle-path' || name === 'Oval')) {
      // console.log(style && style.fills && style.fills.length && filterFill(style))
      return
    }
    /** hack for android two line with avator and icon */
    if (name == 'row bg' || name == 'row bounds') {
      return
    }

    let tempComponentName = name && filterComponentName(name)
    let tempFrame = frame && filterFrame(frame, x, y)
    tempFrame = { ...tempFrame, left: x, top: y }
    let tempAttributedString = attributedString && filterTextDescription(attributedString)
    let tempBorders = style && filterBorders(style)
    let tempShadow = style && style.shadows && style.shadows.length && filterShadow(style)
    let tempFill = style && style.fills && style.fills.length && filterFill(style)

    let tempComponentType = classType && filterComponentType(classType, name, tempFrame, tempAttributedString)
    let tempFourBorderRadius

    if (
      classType === 'MSShapeGroup' && (~name.indexOf('Rectangle') || ~name.indexOf('Mask') || ~name.indexOf('Base') || ~name.indexOf('Path') || name == 'Search Bar')
    ) {
      let path = node.layers && node.layers[0].path
      tempFourBorderRadius = path && filterFourBorderRadius(path)
    }


    /**
     * 将矩形转换为圆形：添加 border-radius
     */
    if(classType == 'MSShapeGroup' && (name == 'Unread' || name == 'Avatar' || name == 'Knob')) {
      console.log(name)
      let { width } = frame
      tempFourBorderRadius = {
        br: parseInt(width/2, 10)
      }   
    }


    /**
     * IOS control Two 组件
     * 去掉白色的BG
     * 增加边框
     */
    if(name === 'BG' && style.fills &&  style.fills.length == 0) {
      return
    }
    // console.log(name, tempFill)


    /**
     * IOS edit Menu
     */
    if(name == 'Point') {
      Object.assign(tempFrame, tempComponentType, {tc: tempFill.bg})
    }

    /**
     * for icons start
     */
    let tempIcon = { z: 1000, name: 'icon_button' }
    let iconSize = () => {
      let {width, height} = tempFrame
      return +width > +height ? +width : +height
    }
    if (name == 'Refresh') {
      // 给下面的数组清0 ，不进入子组件循环
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'fa-repeat' }, {is: iconSize()})
    }
    if (classType == 'MSShapeGroup' && (name == 'Search Icon')) {
      
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'ci-yql-search' }, {is: iconSize(), tc: tempFill.bg})
    }
    if (name == 'Clear') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'mb-times-circle-filled' }, {is: iconSize(), tc: tempFill.bg})
    }

    if(name == 'Arrow' && classType == 'MSLayerGroup') {
      node.layers = []      
      const bg = "#C7C7CC"
      let {left, top} = tempFrame
      return Object.assign(tempFrame, {left: left - 5, top: top - 2}, tempIcon, {icon: 'fa-angle-right'}, {is: iconSize(), tc: bg})
    }

    if((classType == 'MSShapeGroup' && name.indexOf('Icon') == 0)) {
      node.layers = []     
      // default icon 
      return Object.assign(tempFrame, tempIcon, {icon: 'mb-widget-icon-label'})
    }
    







    if (name == 'icon-share') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'fa-share' })
    }
    if (name == 'icon-upload') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-cloud_upload' })
    }
    if (name == 'icon-copy') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'mb-duplicate' })
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
    if (name == 'reply icon') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-reply' })
    }
    if (name == 'archive icon') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-archive' })
    }
    if (name == 'Imported Layers') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-mail_outline' })
    }
    if (classType == 'MSLayerGroup' && name == 'more') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-more_vert', tc: '#fff' })
    }
    if (classType == 'MSLayerGroup' && name == 'menu') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, { icon: 'md-menu', tc: '#fff' })
    }

    if (classType == 'MSLayerGroup' && name == 'Back') {
      // icon 位置渲染会出现问题
      let tc = node.layers && node.layers.length && filterFill(node.layers[node.layers.length - 1].style).bg
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'md-chevron_left'}, {tc, is: 36})
    }

    /**
     * for icons end
     */



    /**
     * for Line
     * 将其宽度或者高度设为border-width
     */
    if (classType === 'MSShapeGroup' && ~name.indexOf('Line')) {
      let { bs,bc } = tempBorders
      let {width, height, left, top} = tempFrame
      let tempLineStyle = {name: 'rounded_rect', bg: bc, bs: 0}

      if(+height == 3 && (+height < +width)) {
        return Object.assign(tempLineStyle, tempFrame, { height: bs})
      }
      return Object.assign(tempLineStyle, { width: bs, left: left, height: +height + 2, top: +top - 2})        
    }


    
    if (tempBorders) {
      Object.assign(tempFrame, tempBorders)
    }

    if (tempShadow) {
      Object.assign(tempFrame, tempShadow)
    }
    
    if (tempFill && name.indexOf('Label')) {
      Object.assign(tempFrame, tempFill)
    }

    
    if(classType == 'MSLayerGroup' && ~name.indexOf('App Icon')) {
    // 避免颜色被覆盖
      
      let style = node.layers && node.layers.length && node.layers[0].style
      let background = filterFill(style)
      // ui 给的数据
      Object.assign(tempFrame, background, {br: 4})
      node.layers = []
    }

    if (tempFourBorderRadius) {
      Object.assign(tempFrame, tempFourBorderRadius)
    }
    return (Object.assign(tempFrame,
      tempComponentName,
      tempAttributedString,
      tempComponentType,
      { z: idx++, resizingType}))
  }
}