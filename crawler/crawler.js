var fs = require('fs')
var logStream = fs.createWriteStream('errorlog.txt', {'flags': 'a'})
var dateTime = require('node-datetime')
var dt = dateTime.create().format('m/d/Y H:M:S')
var jsonfile = require('jsonfile')
var data = require('./crawl.json')
var chalk = require('chalk')
var async = require ('async')
var _ = require('lodash')
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false }) // true displays popup electron window showing results must remove line #17

function crawl(data, cb) {
  // Visual output
  console.log(chalk.blue("Starting: " + data.filename))
  var currentData = require('./data/companies/' + data.filename + '.json')
  var nightmare = new Nightmare()
  nightmare
    .goto(data.url) // go to JSON specified url
    .wait(data.query) // wait until CSS selector loads
    .evaluate(function (data, dt) {
      arr = []
      // returns text in queried CSS selector
      query = document.querySelectorAll(data.query) // Job title query
      links = document.querySelectorAll(data.link)  // Link query
      locations = document.querySelectorAll(data.locations) // Location query
      remote = document.querySelectorAll(data.remote) // Location query
      /* Set query and link equal to all elements with selector
      itearte through appending text (innerText) from each element
      with job url to obj*/
      // If last element(s) with same query are not jobs
      if ("amtExtraElements" in data === false) {
	var x = 0
      } else {
	var x = data.amtExtraElements
      }
      var i
      for (i = 0; i < query.length - x; i++) {
	var obj = new Object()
	obj["@context"] = "http://schema.org"
	obj["@type"] = "JobPosting"
	// if multiple locations need parsing parseLocation may be array
	if (data.parseLocation instanceof Array) {
	  z = data.parseLocation.length
	} else {
	  z = 1
	}
	for (y = 0; y < z; y++) {
	// if location is static or locations attribute contains correct location (e.g string locations contains "Philadelphia" not "San Francisco")
	  if ("locations" in data === false || locations[i].innerText.trim() !== undefined && locations[i].innerText.trim().includes(data.parseLocation[y])){
	    obj.title =  query[i].innerText.trim()
	  // If jobLocation is static (created in input JSON) else add location based on HTML element that contains location
	  if (data.link !== null) {
	    obj.url = links[i].href
	  } else {
	    obj.url = data.url
	  }
	  if ("jobLocation" in data === true) {
	    obj.jobLocation = data.jobLocation
	  } else {
	    obj.jobLocation = locations[i].innerText.trim()
	  }
	  // Default remote to false, true if if JSON val is true, if string includes parser true otherwise false
	  if ("remote" in data === false) {
	      obj.remote = false
	  } else if (data.remote === true || remote[i].innerText.trim().includes(data.parseRemote)) {
	      obj.remote = true
	  } else {
	      obj.remote = false
	  }
	  // if url is picked up by HTML element or is declared in JSON
	  arr.push(obj)
	}
	var dt = new Date()
	var dt = dt.getFullYear() + '-' + ("0" + dt.getMonth() ).slice(-2) + '-' + ("0" + dt.getDate()).slice(-2)
	obj.datePosted = dt
      }
    }
      return arr
    }, data)
  .end()
  .then(function (arr) {
    // If position already in data leave, update new positions and remove old
    console.log(arr)
    x = _.unionBy(currentData.positions, arr, 'title')
    currentData.positions = _.intersectionBy(x, arr, 'title')
    // Write to each company to json file
    var file = '../companies/' + data.filename + '.json'
    jsonfile.writeFile(file, currentData, {spaces: 2}, function(err) {
      if (err) {
	console.error(err)
      }
    })
    console.log(chalk.green('Finished: ' + data.filename))
    cb()
  })
  .catch(function (error) {
    // Write error to log and print to console
    logStream.write('-----------------------------------------------' + '\n' + data.filename + '\n' + error + '\n' + dt + '\n')
    console.log(chalk.red('Error: ' + data.filename + '\n' + error))
    cb()
  })
}


async.eachSeries(data, crawl, function (err){
    console.log(chalk.magenta('done!'))
})
