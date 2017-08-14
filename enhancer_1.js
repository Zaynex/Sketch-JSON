import sketch from 'sketchjs'
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
import fs from 'fs'
import font_sketch from './font_sketch.json'
const log = console.log.bind(console)


const dfs = (data) => {
    if(!data || !data.length) return
    let newArr = [] 
    let stack = []
     //    Now the stack is copy data
    data.forEach(v => {
        stack.push(v)
    })

    let idx = 1
    let _page
    let multiX
    let multiY
    while(stack.length) {
        // 获得最外层的object
        // _page = stack.pop()
        _page = stack.shift()
        const { 
            frame, 
            hasBackgroundColor, 
            backgroundColor,
            attributedString,
            style,
            name
        } = _page
        const classType = _page['<class>']         

        // 由于 子组件的left 和 top 是相对于该包裹层的layershape，还需要加上 layershape 本身的 left 和 top
        // 或者让每个 layerShape 设置相对定位，剩下的子组件绝对定位
        if(classType === 'MSLayerGroup') {
            // 记录上一层级的(x, y)
            let {left, top} = filterFrame(frame)
            multiX += left
            multiY += top
            log(multiX, multiY)
        }


        // 匹配到时获取它的值，但后面还是要遍历，这样就可以直接获得子层需要的元素        
        if(
               classType != 'MSGroup'
            && classType != 'MSPage'
            && classType != 'MSSymbolInstance'
            // && classType != 'MSSymbolMaster'
            && classType != 'MSLayerGroup'
        ) {
            let tempComponentType = classType && filterComponentType(classType)
            let tempComponentName = name && filterComponentName(name)
            // let tempFrame = frame && filterFrame(frame)
            let tempFrame = frame && filterFrame(frame, multiX, multiY)
            let tempBackground = hasBackgroundColor && filterBackgroundColor(!!hasBackgroundColor, backgroundColor)
            let tempAttributedString = attributedString && filterTextDescription(attributedString)
            let tempBorders = style && style.borders && style.borders.length && filterBorders(style)
            let tempShadow = style && style.shadows && style.shadows.length && filterShadow(style)
            let tempFill = style && style.fills && style.fills.length && filterFill(style)
            let tempFourBorderRadius
            if(classType === 'MSShapeGroup' && (~name.indexOf('Rectangle') || ~name.indexOf('Mask')|| ~name.indexOf('Base'))) {
                let path = _page.layers && _page.layers[0].path
                log(' I am getting path')
                tempFourBorderRadius = path && filterFourBorderRadius(path)      
            }

            // 针对最外包裹层的 hack
            if(classType === 'MSSymbolMaster') {
                newArr.push(Object.assign(tempFrame, tempComponentType, {left: 0, top: 0}))
            } 
            else {
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
                    tempComponentName,
                    tempBackground, 
                    tempAttributedString,
                    tempComponentType, 
                    {z: idx++}))
            }
                
            
        }
        // 最后一个判断是取消 rectangle 里面的圆角，已经在上层中计算出来
        if(_page.layers && _page.layers.length && !_page.layers[0].path) {
            stack = _page.layers.concat(stack)
            // stack.push(_page.layers)
        }
    }
    return newArr
}


sketch.dump('font.sketch', function(json){
    fs.writeFile('font_test.json', json, 'utf8', function(err){
        if(err) console.log(err)
    })
    let data = JSON.parse(json)
    
    let { pages } = data

    let newArr = dfs(pages)
    console.log(newArr)
    fs.writeFile('font_result.json', JSON.stringify(newArr, null, 4), 'utf8', function(err) {
        if(err) {
            log(err)
        }
    })
})