import sketch from 'sketchjs'
import 'babel-core'
const fs = require('fs')
const hack = require('./hack.js')
const test_data = require('./component_1.json')
const LOCAL = process.cwd()
const IOS = 'iOS_test.sketch'
const Android = 'Android_test.sketch'



sketch.dump(LOCAL + '/component_2.sketch',function(json){
    fs.writeFile('component_2.json', json,'utf8',(err)=>{
        if(err) throw err;
        console.log('saved')
    })
})

// fs.readFile(LOCAL + '/ios_test.json', (err, data) => {
//     console.log('start read')
//     // console.log(data.toString())
//     hack.handle(data.toString())
// })
