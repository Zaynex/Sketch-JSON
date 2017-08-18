import sketch from 'sketchjs'
import { 
    getFrame, 
    filterBackgroundColor,
    getTextDescription,
    getComponentType,
    getBorders,
    getShadow,
    getBackground,
    getFourBorderRadius
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
        let tempComponentType = nameType && getComponentType(nameType)
        let tempFrame = frame && getFrame(frame)
        let tempBackground = hasBackgroundColor && filterBackgroundColor(!!hasBackgroundColor, backgroundColor)
        let tempAttributedString = attributedString && getTextDescription(attributedString)
        let tempBorders = style && style.borders && style.borders.length && getBorders(style)
        let tempShadow = style && style.shadows && style.shadows.length && getShadow(style)
        let tempFill = style && style.fills && style.fills.length && getBackground(style)
        let tempFourBorderRadius = path && getFourBorderRadius(path)
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
