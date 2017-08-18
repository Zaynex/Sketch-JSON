import { 
    getFrame, 
    filterBackgroundColor,
    getTextDescription,
    getComponentType,
    getBorders,
    getShadow,
    getBackground,
    getFourBorderRadius
} from './index'

const iterator = (layers) => {
    let idx = 1
    let stack = []
    let newArr = []
    if(!layers || !layers.length) return
    
    for(let i = 0, len = layers.length; i < len; i++) {
        stack.push(layers[i])
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
        // if(nameType === 'MSPage' || nameType === 'MSGroup') {
        //     if(item.layers && item.layers.length) {
        //         stack = item.layers.concat(stack)
        //     }
        //     continue
        // }
        let tempComponentType = nameType && getComponentType(nameType)
        let tempFrame = frame && getFrame(frame)
        let tempBackground = hasBackgroundColor && filterBackgroundColor(!!hasBackgroundColor, backgroundColor)
        let tempAttributedString = attributedString && getTextDescription(attributedString)
        let tempBorders = style && style.borders && style.borders.length && getBorders(style)
        let tempShadow = style && style.shadows && style.shadows.length && getShadow(style)
        let tempFill = style && style.fills && style.fills.length && getBackground(style)
        let tempFourBorderRadius = path && getFourBorderRadius(path)
        
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
            tempAttributedString,
            tempComponentType, 
            {z: idx++}))


        if(item.layers && item.layers.length) {
            stack = item.layers.concat(stack)
        }
    }
    return newArr
}