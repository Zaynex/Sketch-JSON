const fs = require('fs')
const test_data = require('./component_2.json')
const log = console.log.bind(console)

const filterFrame = (frame) => {
    const { width, height, x, y} = frame
    return {
        width,
        height,
        x,
        y
    }
}

const filterBackgroundColor = (bool, color) => {
    if (!bool || !color) return false
    return {
        backgroundColor: color.value
    }
}

const filterTextDescription = (attributedString) => {
    const { value } = attributedString
    const {
        text,
        attributes: [{
            NSFont: {
                attributes: {
                    NSFontSizeAttribute
                },
                family
            },
            NSColor: {
                color
            },
            NSParagraphStyle: {
                style: {
                    maximumLineHeight,
                    lineSpacing,
                    lineHeightMultiple    
                }
            }
        }]
    } = value
    return {
        fontColor: color,
        textDescription: text,
        fontSize: NSFontSizeAttribute,
        fontFamily: family,
        lineHeight: maximumLineHeight
    }
}

const filterComponentName = (name) => {
    return { name }
}

const filterComponentType = (type) => {
    const DIV = /Shape/g
    const P = /Text/g

    if(DIV.test(type)) 
        return { type: 'div'}
    if(P.test(type))
        return {type: 'p'}
    return {type}
}
const filterBorders = (borders) => {
    
    const [{color: {value}, thickness}] = borders
    
    return {
        borderColor: value,
        borderWidth: thickness
    }
}

const filterShadow = (shadows) => {
    const [{
            color:{value},
            offsetX,
            offsetY
        }
    ] = shadows

    return {
        shadowColor: value,
        shadowOffsetX: offsetX,
        shadowOffsetY: offsetY
    }
}

const arrayToObject = (array) =>
   array.reduce((obj, item) => {
     obj[item.name] = item
     return obj
}, {})

const iterator = (treeNodes) => {
    let idx = 1
    let stack = []
    let newArr = []
    if(!treeNodes || !treeNodes.length) return
    
    for(let i = 0, len = treeNodes.length; i < len; i++) {
        stack.push(treeNodes[i])
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
         } = item
        const nameType = item['<class>']


        let tempFrame = frame && filterFrame(frame)
        let tempBackground = hasBackgroundColor && filterBackgroundColor(!!hasBackgroundColor, backgroundColor)
        let tempAttributedString = attributedString && filterTextDescription(attributedString)
        let tempComonentName = name && filterComponentName(name)
        let tempComponentType = nameType && filterComponentType(nameType)
        let tempBorders = style && style.borders && style.borders.length && filterBorders(style.borders)
        let tempShadow = style && style.shadows && style.shadows.length && filterShadow(style.shadows)

        if(tempBorders) {
            Object.assign(tempFrame, tempBorders)
        }
        if(tempShadow) {
            Object.assign(tempFrame, tempShadow)            
        }

        newArr.push(Object.assign(tempFrame, 
            tempBackground, 
            tempComonentName,
            tempAttributedString,
            tempComponentType, 
            {zindex: idx++}))

        if(item.layers && item.layers.length) {
            stack = item.layers.concat(stack)
        }
    }
    return newArr
}

const { pages } = test_data

let result = iterator(pages)
const resultObject = arrayToObject(result)
fs.writeFile('result.json', JSON.stringify(resultObject, null, 4), 'utf8', (err) => {
    console.log(err)
})
// log(iterator(pages))




