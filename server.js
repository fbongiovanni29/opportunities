var express = require('express')
var app = express()
var all = require('./public/data/all-companies.json')

app.use(express.static(__dirname + '/public/'))

app.use("/#/", function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/api', function(req, res, next) {
    res.json(all)
})

app.listen(3000, function() {
    console.log('your app is listening on port 3000')
})
