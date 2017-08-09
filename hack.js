import _ from 'lodash'
const fs = require('fs')
/**
 * map Object
 * { symbol.name1 => {x, y, height, width, zindex},
 *   symbol.name2 => {x, y, height, width, zindex}
 * }
 */

exports.handle = (json) => {
    let log =console.log.bind(console)    
    let map = new Map()
    let names = []

    // string => obj
    // let data = JSON.parse(json)


    let data = json
    let pages = data.pages
    let newMap = new Map()
    let tempObj = {}
    const DEFAULTBACKGROUND = '#FFF'
    
    let filterFrame = (name, frame, i) => {
        const { width, height, x, y} = frame
        tempObj = Object.assign({}, {width, height, x, y})
        newMap.set(names[i], tempObj)
    }

    let filterStyle = (style) => {
        // log(style)
        style.borders && style.borders.map((border) => {
            if(border.isEnabled === 1) {
                Object.assign(tempObj, {borderColor:border.color.value})
            }
        })
        style.fills && style.fills.map((fill) => {
            if(fill.isEnabled === 1) {
                Object.assign(tempObj, {fillColor: fill.color.value})
            }
        })
        let textStyle = style.textStyle
        textStyle && Object.assign(tempObj, 
            {   fontColor: textStyle.NSColor.color,
                fontFamily: textStyle.NSFont.name,
                fontSize: textStyle.NSFont.attributes.NSFontSizeAttribute
            })
    }
    let logStyle = (layer) => {
        // let textStyle
        // let attributedString
        // layer.style && layer.style.borders && layer.style.borders.map((border) => {
        //     if(border.isEnabled === 1) {
        //         log("Border:")
        //         log("Color: " + border.color.value)
        //         log("Thickness: " + border.thickness)
        //     }
        // })

        // layer.style && layer.style.fills && layer.style.fills.map((fill) => {
        //     if(fill.isEnabled === 1) {
        //         log('Fill: ' + fill.color && fill.color.value)
        //     }
        // })

        // if(textStyle = (layer.style &&layer.style.textStyle)) {
        //     log("Text Color: " + textStyle.NSColor.color)
        //     log("Font Name: " + textStyle.NSFont.name)
        //     log("Font Family: " + textStyle.NSFont.family)
        //     log("Font Size: " + textStyle.NSFont.attributes.NSFontSizeAttribute)
        // }

        // if(attributedString = layer.attributedString) {
        //     log("Text: " + layer.attributedString.value.text)
        // }

        if(layer['<class>'] === 'MSShapeGroup') {
            _.isArray(layer.layers) && layer.layers.map((shape) => {
                if(shape['<class>'] === 'MSRectangLeShape') {
                    let radis
                    radis = shape.paths && shape.paths.map((p) => p.cornerRadius)
                    // log("Radius: " + radis)          
                }
            })
        }
    }

    let filterTextDescription = (layers) => {
        const { attributedString } = layers
        log(attributedString)
        // layer.attributedString && layer.attributedString.value &&
        // Object.assign(tempObj, {TextDescription: layer.attributedString.value.text})
    }

    let filterLayers = (layers) => {
        let frame
        let style
        let name

        _.isArray(layers) && layers.map((layer, i) => {
            const { name, style, frame} = layer
            if(layer['<class>'] === 'MSLayerGroup') {
                // filterLayers(layer.layers)
                return
            }
            // filterFrame(name, frame)
            // filterBackground(layer)
        })

        // _.isArray(layers) && layers.map((layer) => {
        //     if(layer['<class>'] === 'MSLayerGroup') {
        //         filterLayers(layer.layers)
        //         return
        //     }
        //     log('Layer: ' + layer.name)
        //     log("class: " + layer['<class>'])

        //     frame = layer.frame
        //     logFrame(frame, '\t')
        //     style = layer.style
        //     logStyle(layer)
        // })
    }

    let filterBackground = (symbol, i) => {
        const { hasBackgroundColor, backgroundColor} = symbol
        hasBackgroundColor === 1 ?
        Object.assign(tempObj, {backgroundColor: backgroundColor.value}) :
        Object.assign(tempObj, {backgroundColor: DEFAULTBACKGROUND})
        // newMap.set(names[i], tempObj)
    }

    pages.map((page) => {
        let symbols = page.layers
        let frame
        symbols.map((symbol, i) => {
            const {name , layers, style } = symbol
            map.set(name, symbol)
            frame = map.get(name).frame
            names.push(name)
            filterFrame(name, frame, i)
            // filterStyle(style)
            // filterBackground(symbol, i)
            // filterTextDescription(layers)
            // filterLayers(layers, i)
            // iterateLayers(symbol.layers)
        })
        log(newMap)
    })
}
