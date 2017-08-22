import sketch from 'sketchjs'
import fs from 'fs'
import handleData from './lib/handleData'

const Androidtest = "sketch/android.sketch"
const AndroidtestModel = "data/androidtestModel.json"
const AndroidtestModelResult = "data/androidtestModelResult.json"


// const actiontest = "sketch/actiontest.sketch"
// const actiontestModel = "data/actiontestModel.json"
// const actiontestModelResult = "data/actiontestModelResult.json"

// const barSafari = "sketch/barSafari.sketch"
// const barSafariModel = "data/barSafariModel.json"
// const barSafariModelResult = "data/barSafariModelResult.json"


sketch.dump(Androidtest, (json) => {
    fs.writeFile(AndroidtestModel, JSON.stringify(JSON.parse(json), null, 4), (err) => {
        if(err) console.log(err)
    })
    let data = JSON.parse(json)
    let { pages } = data
    let symbols = pages[0].layers
    let AllResult = symbols.map((symbol) => {
        let name = symbol.name
        return { [name] : depthFirstSearch(symbol, handleData)}
    })

    fs.writeFile(AndroidtestModelResult, JSON.stringify(AllResult, null, 4), 'utf8', err => { if (err) console.log(err) })
    
})

/**
 * 
 * @param {json} 读取sketch json 文件
 * @param {function} 处理逻辑
 */
function depthFirstSearch(treeData, callback) {
    let resultArr = new Set() 
    let keyLevelStack = (treeData.layers || []).map((node) => {
        let {x, y} = node && node.frame
        return [node, 0, x, y]
    }).reverse()
    let nodeLevelLeftTop
    while ((nodeLevelLeftTop = keyLevelStack.pop())) {
        const [node, level, x, y, i] = nodeLevelLeftTop

        callback && resultArr.add(callback(node, level, x, y, i))
        if (node.layers && node.layers.length) {
            keyLevelStack = [
                ...keyLevelStack,
                ...node.layers.map((node, i) => {
                    const { frame } = node
                    return [node, level + 1, x + frame.x, y + frame.y, i]
                }).reverse()
            ]
        }
    }
    resultArr = ([...resultArr].filter(v => v != null))
    // resultArr = resultArr.filter(v => v != null || v != undefined)
    // resultArr = resultArr.filter((v,i, res) => v != res[i+1])
    // fs.writeFile(actiontestModelResult, JSON.stringify(resultArr, null, 4), 'utf8', err => { if (err) console.log(err) })
    return resultArr
    // console.log(resultArr)
}