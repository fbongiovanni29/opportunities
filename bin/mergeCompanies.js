var fs = require('fs');

var fileName = process.argv[2];
var dirName = process.argv[3];

if (fileName && dirName) {
  var text = fs.readFileSync(fileName, "utf8");
  var geoData = JSON.parse(text);
  var counties = geoData.features;

  counties.forEach(processCounty);

  mergeAll(dirName);

  function mergeAll(dirName) {
    var companies = [];

    fs.readdir(dirName, processCompanies);

    function processCompanies(err, files) {
      if (err) {
        console.log(err);
        return;
      }

      files = files.filter(isJsonFile);
      files.sort(caseInsensitiveSort);
      files.forEach(addCompany);

      function addCompany(fileName) {
        var company = readCompany(dirName + "/" + fileName);

        companies.push(company);
      }

      writeCompanyMerge('all-companies.json', companies);
    }
  }

  function processCounty(county) {
    // "properties": { "STATE_NAME": "New Jersey", "STATE_FIPS": "34", "CNTY_FIPS": "007", "FIPS": "34007", "AREA_SQMI": 227.423213, "State": "NJ", "Co_Name": "Camden" }
    var geoPoints = county.geometry.coordinates[0];
    if (Object.keys(geoPoints).length == 1) {
      geoPoints = geoPoints[0];
    }
    var countyLimits = [];
    var insideCounty = [];

    // Convert county boundary data into the array/object structure we need.
    for (var index in geoPoints) {
      countyLimits[index] = {
        "longitude": null,
        "latitude": null
      };
      countyLimits[index].longitude = geoPoints[index][0];
      countyLimits[index].latitude = geoPoints[index][1];
    }

    fs.readdir(dirName, processCompanies);

    function processCompanies(err, files) {
      if (err) {
        console.log(err);
        return;
      }

      files = files.filter(isJsonFile);
      files.sort(caseInsensitiveSort);
      files.forEach(checkCompany);

      function checkCompany(fileName) {
        var company = readCompany(dirName + "/" + fileName);

        if ('geo' in company) {
          if (isPointInRegion(countyLimits, company.geo)) {
            insideCounty.push(company);
          }
        } else if ('locations' in company) {
          for (var locationName in company.locations) {
            var location = company.locations[locationName];
            if (('geo' in location) && isPointInRegion(countyLimits, location.geo)) {
              insideCounty.push(company);
            }
          }
        }
      }

      if (insideCounty.length > 0) {
        var newFileName = county.properties.State.toLowerCase() + "-" + county.properties.Co_Name.toLowerCase() + ".json";
        newFileName = newFileName.replace(/\s+/g, '-');
        writeCompanyMerge(newFileName, insideCounty);
      }
      console.log(county.properties.State.toLowerCase() + "-" + county.properties.Co_Name.toLowerCase() + "\t" + insideCounty.length);
    }

  }

  function isJsonFile(file) {
    return file.endsWith('.json');
  }

  function caseInsensitiveSort(a, b) {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
  }

  // converted c code from this page http://www.codeproject.com/Tips/84226/Is-a-Point-inside-a-Polygon
  function isPointInRegion(region, point) {
    var c = false;
    var i, j;
    for (i = 0, j = region.length - 1; i < region.length; j = i++) {
      if (((region[i].longitude > point.longitude) != (region[j].longitude > point.longitude)) &&
        (point.latitude < (region[j].latitude - region[i].latitude) * (point.longitude - region[i].longitude) / (region[j].longitude - region[i].longitude) + region[i].latitude)) {
        c = !c;
      }
    }
    return c;
  }

  function readCompany(fileName) {
    var text = fs.readFileSync(fileName, "utf8");
    var company = JSON.parse(text);
    var locations = JSON.stringify(company.locations, null, 2);
    locations = locations.replace(/"([\w]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
    company.locations = JSON.parse(locations);

    return company;
  }

  function writeCompanyMerge(fileName, companies) {
    var out = fs.createWriteStream(fileName, {
      encoding: "utf8"
    });
    out.write(JSON.stringify(companies, null, 2));
    out.write("\n");
    out.end(); // currently the same as destroy() and destroySoon()
  }

} else {
  function getFileName(path) {
    return path.substring(path.lastIndexOf('/') + 1, path.length);
  }
  var node = getFileName(process.argv[0]);

  var script = getFileName(process.argv[1]);

  console.log("Usage: " + node + " " + script + " <geodata> <dirname>");
}
