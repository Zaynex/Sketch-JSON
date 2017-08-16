import {
  filterFrame,
  filterComponentName,
  filterBackgroundColor,
  filterTextDescription,
  filterComponentType,
  filterBorders,
  filterShadow,
  filterFill,
  filterFourBorderRadius
} from './lib'
import sketch from 'sketchjs'
import fs from 'fs'

let newArr = []
sketch.dump('font.sketch', function (json) {
  fs.writeFile('font_result.json', JSON.stringify(JSON.parse(json), null, 4), (err) =>{
    if(err) console.log(err)
  })
  let data = JSON.parse(json)
  let { pages } = data
  if(pages[0].layers.length == 0 || (pages[0] && pages[0].layers && pages[0].layers.length && pages[0].layers[0]['<class>'] === 'MSSymbolInstance')) {
    depthFirstSearch(pages[1], handleData)
  }else {
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
          // let type = node['<class>']
          // if(~type.indexOf('Group')) {
            return [node, level + 1, x + frame.x, y + frame.y, i]
          // } else {
          //   return [node, level + 1, x, y, i]
          // }
        }).reverse()
      ]
    }
  }
  newArr = newArr.filter(v => v != undefined)
  newArr = newArr.filter((v, i, a) => v != a[i + 1])
  fs.writeFile('font_model.json', JSON.stringify(newArr, null, 4), 'utf8', err => {if(err) console.log(err)})
  // console.log(newArr)
}

let idx = 0
function handleData(node, level, x, y, i) {
  let {
    frame,
    hasBackgroundColor,
    backgroundColor,
    attributedString,
    style,
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
    || (classType == 'MSSymbolMaster' && name == 'Basic Elements/Controls/Edit Menu')
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
    || (classType == 'MSLayerGroup' && name =='more')
    || (classType == 'MSLayerGroup' && name =='menu')
    
  ) {
    /**
     * hack for android two line with avator and icon
     */
    if(classType === 'MSShapeGroup' && (name === 'Rectangle-path' || name === 'Oval')) {
      console.log(style && style.fills && style.fills.length && filterFill(style))
      return
    }
    /** hack for android two line with avator and icon */
    if(name == 'row bg' || name == 'row bounds') {
      return
    }
    
    let tempComponentType = classType && filterComponentType(classType)
    let tempComponentName = name && filterComponentName(name)
    let tempFrame = frame && filterFrame(frame, x, y)
    tempFrame = {...tempFrame, left:x, top: y}
    let tempBackground = hasBackgroundColor && filterBackgroundColor(!!hasBackgroundColor, backgroundColor)
    let tempAttributedString = attributedString && filterTextDescription(attributedString)
    let tempBorders = style && style.borders && style.borders.length && filterBorders(style)
    let tempShadow = style && style.shadows && style.shadows.length && filterShadow(style)
    let tempFill = style && style.fills && style.fills.length && filterFill(style)
    let tempFourBorderRadius
    if (classType === 'MSShapeGroup' && (~name.indexOf('Rectangle') || ~name.indexOf('Mask') || ~name.indexOf('Base') || ~name.indexOf('Path'))) {
      let path = node.layers && node.layers[0].path
      tempFourBorderRadius = path && filterFourBorderRadius(path)
    }
    console.log(name)


    if(classType === 'MSRectangleShape' && name == 'Point') {
      return Object.assign(tempFrame, {name: 'triangleb'})
    }
    /**
     * for icons start
     */
    let tempIcon = {z: level,name: 'icon_button'}
    if(name == 'Refresh') {
      // 给下面的数组清0 ，不进入子组件循环
      node.layers = []      
      return Object.assign(tempFrame, tempIcon, {icon: 'fa-repeat'})
    }
    if(classType == 'MSShapeGroup' && (name == 'Search Icon')) {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'ci-yql-search'} )
    }
    if(name == 'Clear') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'mb-times-circle-filled'})
    }
    if(name == 'icon-share') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'fa-share'})
    }
    if(name == 'icon-upload') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'md-cloud_upload'})
    }
    if(name == 'icon-copy') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'mb-duplicate'})
    }
    if(name == 'icon-print') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'md-print'})
    }
    if(name == 'mic') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'md-mic'})
    }
    /** 会存在 search组件是一个 LayerGroup，但是 icon也是 LayerGroup */
    if(classType == 'MSLayerGroup' && name == 'search' && node.layers[0].name == 'Shape') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'md-search'})
    }
    if(name == 'reply icon') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'md-reply'})
    }
    if(name == 'archive icon') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'md-archive'})
    }
    if(name == 'Imported Layers') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'md-mail_outline'})
    }
    if(classType == 'MSLayerGroup' && name == 'more') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'md-more_vert', tc: '#fff'})
    }
    if(classType == 'MSLayerGroup' && name == 'menu') {
      node.layers = []
      return Object.assign(tempFrame, tempIcon, {icon: 'md-menu', tc: '#fff'})
    }
    /**
     * for icons end
     */

    if (tempBorders) {
      Object.assign(tempFrame, tempBorders)
    } else {
      Object.assign(tempFrame, {bs: 0})
    }
    if (tempShadow) {
      Object.assign(tempFrame, tempShadow)
    }
    if (tempFill) {
      Object.assign(tempFrame, tempFill)
    }
    if (tempFourBorderRadius) {
      Object.assign(tempFrame, tempFourBorderRadius)
    }
    return (Object.assign(tempFrame,
      tempComponentName,
      tempBackground,
      tempAttributedString,
      tempComponentType,
      { z: level}))
  }
}