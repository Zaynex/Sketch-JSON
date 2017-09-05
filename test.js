const fs = require("fs")
fs.readdir('../sketchfile', (err, data) => {
  data = data.filter((v) => {
    return v.includes('.sketch')
  })
})