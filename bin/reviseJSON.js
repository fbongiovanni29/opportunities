var fs = require('fs');

var pathName = process.argv[2];

if (pathName) {
  if (fs.lstatSync(pathName).isDirectory()) {
    formatAll(pathName);
  } else {
    formatFile(pathName)
  }
} else {
  function getFileName(path) {
    return path.substring(path.lastIndexOf('/') + 1, path.length);
  }

  var node = getFileName(process.argv[0]);
  var script = getFileName(process.argv[1]);

  console.log("Usage: " + node + " " + script + " <filename or directory>");
  console.log("NOTE: non standard attribute will not be copied to the revised object.")
}

function formatAll(dirName) {
  fs.readdir(dirName, processCompanies);

  function processCompanies(err, files) {
    if (err) {
      console.log(err);
      return;
    }

    files = files.filter(isJsonFile);
    files = files.map(addPath);
    files.forEach(formatFile);
  }

  function addPath(fileName) {
    return dirName + '/' + fileName;
  }
}

function formatFile(fileName) {
  try {
    var text = fs.readFileSync(fileName, "utf8");
    var opportunties = JSON.parse(text);
  } catch (e) {
    console.log("ERROR: file: " + fileName + " error: " + e.message);
    return false;
  }

  var city = "philadelphia";

  var newOpportunties = {
    "company": "",
    "type": [],
    "url": "",
    "webSiteUrl": "",
    "technologies": [],
    "locations": {},
    "positions": []
  };

  if ('company' in opportunties) {
    newOpportunties.company = opportunties.company;
  }
  if ('type' in opportunties) {
    newOpportunties.type = opportunties.type;
  }
  if ('url' in opportunties) {
    newOpportunties.url = opportunties.url;
  }
  if ('webSiteUrl' in opportunties) {
    newOpportunties.webSiteUrl = opportunties.webSiteUrl;
  }
  if ('technologies' in opportunties) {
    newOpportunties.technologies = opportunties.technologies;
  }
  if ('locations' in opportunties) {
    newOpportunties.locations = opportunties.locations;
  } else if ('address' in opportunties) {
    city = opportunties.address.replace(/, (PA|NJ|DE).*$/i, '');
    city = city.replace(/^.*, /, '').toLowerCase();

    newOpportunties.locations[city] = {
      "@context": "http://schema.org",
      "@type": "Place",
      "address": opportunties.address,
      "geo": {
        "@context": "http://schema.org",
        "@type": "Place",
        "latitude": opportunties.geo.latitude,
        "longitude": opportunties.geo.longitude
      }
    }
  }
  if ('positions' in opportunties) {
    newOpportunties.positions = opportunties.positions.map(reformatPosition);
  }

  try {
    var out = fs.createWriteStream(fileName, {
      encoding: "utf8"
    });
    out.write(JSON.stringify(newOpportunties, null, 2));
    out.write("\n");
    out.end();
  } catch (e) {
    console.log("ERROR: Couldn't write content out to: " + fileName + "");
    console.log("ERROR: " + e.message);
    return false;
  }

  function reformatPosition(position) {
    var newPosition = {
      "@context": "http://schema.org",
      "@type": "JobPosting",
      "employmentType": "full-time",
      "title": "",
      "alternateName": "",
      "url": opportunties.url,
      "jobLocation": city,
      "remote": false,
      "datePosted": ""
    };

    if ('employmentType' in position) {
      newPosition.employmentType = position.employmentType;
    }
    if ('title' in position) {
      newPosition.title = position.title;
    }
    if ('alternateName' in position) {
      newPosition.alternateName = position.alternateName;
    }
    if ('url' in position) {
      newPosition.url = position.url;
    }
    if ('jobLocation' in position) {
      newPosition.jobLocation = position.jobLocation;
    }
    if ('remote' in position) {
      newPosition.remote = position.remote;
    }
    if ('datePosted' in position) {
      newPosition.datePosted = position.datePosted;
    }

    return newPosition;
  }
}

function isJsonFile(file) {
  return file.endsWith('.json');
}
