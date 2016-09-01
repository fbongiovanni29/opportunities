var fs = require('fs')
var logStream = fs.createWriteStream('./crawler/errorlog.txt', {'flags': 'a'})
var dateTime = require('node-datetime')
var dt = dateTime.create().format('m/d/Y H:M:S')
var jsonfile = require('jsonfile')
var crawlData = require('./crawl.json')
var chalk = require('chalk')
var async = require ('async')
var _ = require('lodash')
var Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare)
var nightmare = Nightmare({ show: true }) // true displays popup electron window showing results must remove line #17

function crawl(crawlData, cb) {
  // Visual output
  console.log(chalk.blue("Starting: " + crawlData.filename))
  var currentData = require('../public/data/companies/' + crawlData.filename + '.json')
  var nightmare = new Nightmare()
  if ("iFrame" in crawlData === true) {
    nightmare.enterIFrame(crawlData.iFrame)
  }
  nightmare
    .goto(crawlData.url) // go to JSON specified url
    .wait(crawlData.query) // wait until CSS selector loads
    .evaluate(function (crawlData, dt) {
      employmentType = ["INTERN", "PART-TIME", "PART TIME", "CONTRACT"]
      newPositions = []
      // returns text in queried CSS selector
      query = document.querySelectorAll(crawlData.query) // Job title query
      links = document.querySelectorAll(crawlData.link)  // Link query
      locations = document.querySelectorAll(crawlData.locations) // Location query
      remote = document.querySelectorAll(crawlData.remote) // Location query
      /* Set query and link equal to all elements with selector
      itearte through appending text (innerText) from each element
      with job url to obj*/
      // If last element(s) with same query are not jobs
      if ("amtExtraElements" in crawlData === false) {
	var x = 0
      } else {
	var x = crawlData.amtExtraElements
      }
      var i
      for (i = 0; i < query.length - x; i++) {
	var position = new Object()
	position["@context"] = "http://schema.org"
	position["@type"] = "JobPosting"
	// if multiple locations need parsing parseLocation may be array
	if (crawlData.parseLocation instanceof Array) {
	  z = crawlData.parseLocation.length
	} else {
	  z = 1
	}
	for (y = 0; y < z; y++) {
	// if location is static or locations attribute contains correct location (e.g string locations contains "Philadelphia" not "San Francisco")
	  if ("locations" in crawlData === false || locations[i].innerText.trim() !== undefined && locations[i].innerText.trim().includes(crawlData.parseLocation[y])){
	    position.title =  query[i].innerText.trim()
	  // Add link for each title unless crawlData.link is null in which case make same as crawlData.url
	  if (crawlData.link !== null) {
	    position.url = links[i].href
	  } else {
	    position.url = crawlData.url
	  }
	  // If jobLocation is static (created in input JSON) else add location based on HTML element that contains location
	  if ("jobLocation" in crawlData === true) {
	    position.jobLocation = crawlData.jobLocation
	  } else {
	    position.jobLocation = locations[i].innerText.trim()
	  }
	  position.employmentType = "full-time"
	  for (k = 0; k < employmentType.length; k++) {
	    if (query[i].innerText.toUpperCase().trim().includes(employmentType[k])) {
	      position.employmentType = employmentType[k].toLowerCase()
	    }
	  }
	  // Default remote to false, true if if JSON val is true, if string includes parser true otherwise false
	  if ("remote" in crawlData === false) {
	      position.remote = false
	  } else if (crawlData.remote === true || remote[i].innerText.trim().includes(crawlData.parseRemote)) {
	      position.remote = true
	  } else {
	      position.remote = false
	  }
	  // If sliceTitle is array each item oterwise slice integer
	  if ("sliceTitle" in crawlData === true) {
	    if (crawlData.sliceTitle instanceof Array === true) {
	      position.title = position.title.slice(crawlData.sliceTitle[0], crawlData.sliceTitle[1])
	    } else {
	      position.title = position.title.slice(crawlData.sliceTitle)
	    }
	  }
	  newPositions.push(position)
	}
	var dt = new Date()
	var dt = dt.getFullYear() + '-' + ("0" + dt.getMonth() ).slice(-2) + '-' + ("0" + dt.getDate()).slice(-2)
	position.datePosted = dt
      }
    }
      return newPositions
    }, crawlData)
  .end()
  .then(function (newPositions) {
    // quick fix for null items (coming from parsing locations with 2 matching values from parseLocation array)
    newPositions = newPositions.filter(function(e){return e})
    // If position already in crawlData leave, update new positions and remove old
    console.log(newPositions)
    x = _.unionBy(currentData.positions, newPositions, 'title')
    currentData.positions = _.intersectionBy(x, newPositions, 'title')
    // Write to each company to json file
    var file = './public/data/companies/' + crawlData.filename + '.json'
    jsonfile.writeFile(file, currentData, {spaces: 2}, function(err) {
      if (err) {
        console.error(err)
      }
    })
    console.log(chalk.green('Finished: ' + crawlData.filename))
    cb()
  })
  .catch(function (error) {
    currentData.positions = []
    var file = './public/data/companies/' + crawlData.filename + '.json'
    jsonfile.writeFile(file, currentData, {spaces: 2}, function(err) {
      if (err) {
        console.error(err)
      }
    })
    // Write error to log and print to console
    logStream.write('-----------------------------------------------' + '\n' + crawlData.filename + '\n' + error + '\n' + dt + '\n')
    console.log(chalk.red('Error: ' + crawlData.filename + '\n' + error))
    cb()
  })
}


async.eachSeries(crawlData, crawl, function (err){
    console.log(chalk.magenta('done!'))
})
