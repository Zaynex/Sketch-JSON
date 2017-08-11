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
import fs from 'fs'

sketch.dump('./font.sketch',function(json){
    fs.writeFile('font_sketch.json', json, 'utf8', (err) => {
        if(err) {console.log(err)}
    })
    let { pages: [{layers}] } = JSON.parse(json)
    let resultArr = []
    let obj = {}

    const iterator = (layer) => {
        const {layers} = layer
        let tempObj = {}    
        
        if(layers && layers.length) {
            Object.assign(obj, ...layers.map((inlayer) => iterator(inlayer)))
        } 
        let idx = 1
        let tempArr= []
        const { 
                frame, 
                hasBackgroundColor, 
                backgroundColor,
                attributedString,
                style,
                name,
                path
            } = layer
        const nameType = layer['<class>']
        let tempComponentType = nameType && filterComponentType(nameType)
        let tempFrame = frame && filterFrame(frame)
        let tempBackground = hasBackgroundColor && filterBackgroundColor(!!hasBackgroundColor, backgroundColor)
        let tempAttributedString = attributedString && filterTextDescription(attributedString)
        let tempBorders = style && style.borders && style.borders.length && filterBorders(style)
        let tempShadow = style && style.shadows && style.shadows.length && filterShadow(style)
        let tempFill = style && style.fills && style.fills.length && filterFill(style)
        let tempFourBorderRadius = path && filterFourBorderRadius(path)
        if(tempBorders) {
            Object.assign(tempObj, tempBorders)
        }
        if(tempShadow) {
            Object.assign(tempObj, tempShadow)            
        }
        if(tempFill) {
            Object.assign(tempObj, tempFill)
        }
        if(tempFourBorderRadius) {
            Object.assign(tempObj, tempFourBorderRadius)
        }
        if(tempFrame) {
            Object.assign(tempObj, tempFrame)
        }
        if(tempBackground) {
            Object.assign(tempObj, tempBackground)
        }
        if(tempAttributedString) {
            Object.assign(tempObj, tempAttributedString)
        }
        if(tempComponentType) {
            Object.assign(tempObj, tempComponentType)        
        }
        
        return Object.assign({}, obj,tempObj,
            {z: idx++})
            
    }
    
    layers.map((layer) => {
        obj = {}
        return resultArr.push(iterator(layer))
    })

    fs.writeFile('font.json', JSON.stringify(resultArr, null, 4), 'utf8', (err) => {
        if(err) console.log(err)
    })
})
