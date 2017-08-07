import sketch from 'sketchjs'
import 'babel-core'
const fs = require('fs')
const hack = require('./hack.js')
const LOCAL = process.cwd()
const IOS = 'iOS_test.sketch'
const Android = 'Android_test.sketch'


sketch.dump(LOCAL + '/iOS_test.sketch', (json) => {
    hack.handle(json)
})

// sketch.dump(LOCAL + '/iOS_test.sketch',function(json){
//     fs.writeFile('ios_test.json', json,'utf8',(err)=>{
//         if(err) throw err;
//         console.log('saved')
//     })
// })

// fs.readFile(LOCAL + '/ios_test.json', (err, data) => {
//     console.log('start read')
//     // console.log(data.toString())
//     hack.handle(data.toString())
// })
