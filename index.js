// require('babel-polyfill')
var fs = require('fs')
import sketch from 'sketchjs'
const lol = process.cwd()
const IOS = 'iOS_test.sketch'
const Android = 'Android_test.sketch'

sketch.dump(lol + '/iOS_test.sketch',function(json){
    fs.writeFile('ios_test.json', json,'utf8',(err)=>{
        if(err) throw err;
        console.log('saved')
        console.log()
    })
})