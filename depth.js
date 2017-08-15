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
          let type = node['<class>']
          if(~type.indexOf('Group')) {
            return [node, level + 1, x + frame.x, y + frame.y, i]
          } else {
            return [node, level + 1, x, y, i]
          }
        }).reverse()
      ]
    }
  }
  newArr = newArr.filter(v => v != undefined)
  newArr = newArr.filter((v, i, a) => v != a[i + 1])
  console.log(newArr)
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
    && name != 'row bg'
    || classType === 'MSLayerGroup'  && (name === 'Table View/Elements/Slider')
  ) {
    /**
     * hack for android two line with avator and icon
     */
    if(classType === 'MSShapeGroup' && (name === 'Rectangle-path' || name === 'Oval')) {
      console.log(style && style.fills && style.fills.length && filterFill(style))
      return
    }
    
    let tempComponentType = classType && filterComponentType(classType)
    let tempComponentName = name && filterComponentName(name)
    let tempFrame = frame && filterFrame(frame, x, y)
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


    if (tempBorders) {
      Object.assign(tempFrame, tempBorders)
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