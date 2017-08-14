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


let newArr = []

sketch.dump('font.sketch', function (json) {
  let data = JSON.parse(json)
  let { pages } = data
  depthFirstSearch(pages[0], handleData)

})


function depthFirstSearch(treeData, callback) {

  let keyLevelStack = (treeData.layers || []).map((node) => {
    const { x, y } = node.frame
    return [node, 0, x, y]
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
          return [node, level + 1, x + (frame && frame.x || 0), y + (frame && frame.y || 0), i]
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
  ) {
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
      { z: level, i: i}))
  }
}