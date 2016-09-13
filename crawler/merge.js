var jsonfile = require('jsonfile')
var fs = require('fs')

fs.readdir('./data/companies/', function(err, files) {
  for (i = 0; i < files.length; i++) {
    arr = []
    jsonfile.readFile('./data/companies/' + files[i], function(err, obj) {
      console.log("Writing: " + obj.filename)
      arr.push(obj)
      jsonfile.writeFile('./crawl.json', arr, {spaces: 2}, function (err) {
        if (err){
          console.error(err)
        }
      })
    })
  }
})
