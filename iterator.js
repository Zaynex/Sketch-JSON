import fs from 'fs'
import sketch from 'sketchjs'
import { 
    filterFrame, 
    filterBackgroundColor,
    filterTextDescription,
    filterComponentType,
    filterBorders,
    filterShadow,
    filterFill,
    filterFourBorderRadius
} from './lib'
const log = console.log.bind(console)
const LOCAL = process.cwd()

const iterator = ({pages}) => {
    let idx = 1
    let stack = []
    let newArr = []
    if(!pages || !pages.length) return
    
    for(let i = 0, len = pages.length; i < len; i++) {
        stack.push(pages[i])
    }

    let item
    while(stack.length) {
        item = stack.shift()
        const { 
            frame, 
            hasBackgroundColor, 
            backgroundColor,
            attributedString,
            style,
            name,
            path
         } = item
        const nameType = item['<class>']
        if(nameType === 'MSPage' || nameType === 'MSGroup') {
            if(item.layers && item.layers.length) {
                stack = item.layers.concat(stack)
            }
            continue
        }
        let tempComponentType = nameType && filterComponentType(nameType)
        let tempFrame = frame && filterFrame(frame)
        let tempBackground = hasBackgroundColor && filterBackgroundColor(!!hasBackgroundColor, backgroundColor)
        let tempAttributedString = attributedString && filterTextDescription(attributedString)
        let tempBorders = style && style.borders && style.borders.length && filterBorders(style)
        let tempShadow = style && style.shadows && style.shadows.length && filterShadow(style)
        let tempFill = style && style.fills && style.fills.length && filterFill(style)
        let tempFourBorderRadius = path && filterFourBorderRadius(path)
        
        if(tempBorders) {
            Object.assign(tempFrame, tempBorders)
        }
        if(tempShadow) {
            Object.assign(tempFrame, tempShadow)            
        }
        if(tempFill) {
            Object.assign(tempFrame, tempFill)
        }
        if(tempFourBorderRadius) {
            Object.assign(tempFrame, tempFourBorderRadius)
        }
        
        newArr.push(Object.assign(tempFrame, 
            tempBackground, 
            // tempComonentName,
            tempAttributedString,
            tempComponentType, 
            {z: idx++}))


        if(item.layers && item.layers.length) {
            stack = item.layers.concat(stack)
        }
    }
    return newArr
    // return arrayToObject(newArr)
}


import test_data from './font.json'

let result = iterator(test_data)
// log(result)


fs.writeFile('result_font.json', JSON.stringify(result, null, 4), 'utf8', (err) => {
    console.log(err)
})




