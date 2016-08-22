var data = require('../all-companies.json')
var chalk = require('chalk')

console.log(data[0].positions[0].url)

for (var i = 0; i < data.length; i++) {
    console.log(data[i].company)
    for (j = 0; j < data[i].positions.length; j++) {
      if (data[i].positions[j].url === undefined) {
	console.log(chalk.red(data[i].positions[j].url))
      }
    }
}
