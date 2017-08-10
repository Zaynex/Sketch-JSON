import sketch from 'sketchjs'
import 'babel-core'
import fs from 'fs'
// import hack from './hack'
// import test_data from './component_1.json'
const LOCAL = process.cwd()
// const IOS = 'iOS_test.sketch'
// const Android = 'Android_test.sketch'


sketch.dump(LOCAL + '/demo1.sketch',function(json){
    fs.writeFile('demo1.json', json,'utf8',(err)=>{
        if(err) throw err;
        console.log('saved')
    })
})


fs.readFile(LOCAL + '/ios_test.json', (err, data) => {
    console.log('start read')
    hack.handle(data.toString())
})
