const _ = require('lodash')
// const test_data = require('./symbol')
const fs = require('fs')
const test_data = require('./component_1.json')
const log = console.log.bind(console)

/**
 * 这部分函数主要用于展开对象
 * 由于结果是需要展开所有组件，通过标记 zIndex 来实现组件的重叠组合
 */

const Bsort = (arr) => {
    arr.sort(function(a, b){
        return b - a
    })
    return arr
}

function flatten1(object, separator = '.') {
    let i = 1
	const walker = (child, path = []) => {

		return Object.assign({}, ...Object.keys(child).map(
            key => {
                if(_.isObject(child[key])) {
                    key === 'layers' && (child['<class>'] === 'MSLayerGroup' || child['<class>'] === 'MSPage') 
                    && Object.assign(child[key], {zIndex: i++})
                   return walker(child[key], path.concat([key]))
                } else {
                   return {[path.concat([key]).join(separator)] : child[key]}
                }
            }
		))
	}

	return Object.assign({}, walker(object))
}


const getKeys = object => Object.keys(object)

const getDeepKey = (arr) => {
    let tempArr = []
    let rex = /layers/g
    arr.forEach((v) => {
        let ifarr = v.toString().match(rex)
        ifarr && ifarr.length > 0 && tempArr.push(ifarr.length) 
    })
    // log(tempArr)
    // log(getMix(tempArr))
    return Bsort(tempArr)[0]
}


// let result = flatten1(test_data)
// // log(typeof result)
// let result_json = JSON.stringify(result, null, 4)
// fs.writeFile('component_result.json', result_json, 'utf8', (err) => {
//     if(err) throw err
//         log('done')
// })
// log(result)


let test_data1 = [{
    x: 1,
    y: 1,
    '<class>': 'MSLayerGroup',
    name: 'compon1',
    layers: [
        {
            x:1,
            y:1,
            '<class>': 'MSLayerGroup',  
            name: 'compon2',
            layers: {
                x: 1,
                y:1,
                '<class>': 'MSLayerGroup',
                name: 'compon3',              
                layers: [
                    {x: 1,
                    y:1,
                    '<class>': 'MSLayerGroup'}
                ]
            }
        }
    ]
}]

let test_arr = test_data1.reduce((prev, curr) => {
    return [...prev, ...curr.name]
})
log(test_arr)
// log(flatten1(data))