import sketch from 'sketchjs'
import fs from 'fs'
import handleData from './lib/handleData'
import { ignoreSymbol } from './lib/default'

fs.readdir('../sketchfile', (err, fileName) => {
    fileName = fileName.filter((v) => {
        return v.includes('.sketch')
    })
    fileName.forEach(v => {
        sketch.dump(`../sketchfile/${v}`, (json) => {
            fs.writeFile(`data/${v}_full.json`, JSON.stringify(JSON.parse(json), null, 2), (err) => {
                if (err) console.log(err)
            })
            let data = JSON.parse(json)
            let { pages } = data
            let symbols = pages[0].layers

            let AllResult = symbols.map((symbol) => {
                let name = symbol.name
                if (!ignoreSymbol.includes(name) && symbol['<class>'] == 'MSSymbolMaster') {
                    return { [name]: depthFirstSearch(symbol, handleData) }
                }
            }).filter(v => !!v)
            fs.writeFile(`data/${v}_result.json`, JSON.stringify(AllResult, null, 2), 'utf8', err => { if (err) console.log(err) })
        })
    })
})

/**
 *
 * @param {json} 读取sketch json 文件
 * @param {function} 处理逻辑
 */
function depthFirstSearch (treeData, callback) {
    let resultArr = new Set()
    let keyLevelStack = (treeData.layers || []).map((node) => {
        let { x, y } = node && node.frame
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
    resultArr = ([...resultArr].filter(v => !!v))
    return resultArr
}