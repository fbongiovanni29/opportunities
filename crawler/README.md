### Crawls data using [NightmareJS](https://github.com/segmentio/nightmare) which runs on top of headless Electron browser.

To crawl website fill out JSON accordingly:
 ```javascript
 {
    "filename": "company", // Name of company  w/o extension
    "url": "http://www.example.com/careers", // url to visit
    "parseLocation": ["Philadelphia", "Malvern"], // optional - array string(s) to parse "locations" that will be added
    "locations": ".location", // optional css selector for for parsing locations
    "parseRemote": "Remote", // optional - what "remote" will be parsed for
    "remote": ".remote a", // optional - css selector for querying remote options
    "query": "#available-jobs", // css selector to query for title
    "link": "#available-jobs a" // css selector to query for link to each title - null will make "url" default to each
 }
```
then in crawler directory run:
```bash
$ npm start
```

## TODO:
+ Check [angel.co](http://angel.co) for new positions

### Parse employment type better
+ [Tuva](https://tuvalabs.com/jobs/)
+ [Chatterblast](http://chatterblast.com/careers/)

### Extra item after each department type
+ [Seer Interactive](http://www.seerinteractive.com/careers/)

### Requires Navigation
+ [CHOP](https://www.chop.edu.apply2jobs.com/)
+ [Thomson Reuters](https://toc.taleo.net/careersection/2/moresearch.ftl?iniurl.src=CWS-10140)
+ [Elsevier](https://www.elsevier.com/about/careers/tech)
+ [FIS](https://financialsystemsjobs.sungard.com/search-jobs)
+ [radial](http://radialcareers.force.com/careers)
+ [Think Brownstone](https://www.thinkbrownstone.com/careers/) (for locations & employment type)

### Electron not loading properly
+ [Cerner](http://cerner.com/About_Cerner/Careers/) - possibly due to Angular bindings
+ [URBN](https://career4.successfactors.com/career?company=URBN) - URL loads different page than Chrome
+ [Velora](http://www.velorastudios.com/jobs) - Nightmare doesn't read elements (possibly due to old version of HTML)

### Large mix of tech/non-tech postions
+ [Morgan Lewis](https://sjobs.brassring.com/TGWebHost/home.aspx?partnerid=25936&siteid=5172)
+ [Willis Towers Watson](https://willis-towers-watson.jobs.net/search?facetcitystate=philadelphia%2Cpa)

### No tech positions currently
+ [Billy Penn](https://billypenn.com/jobs/)
+ [National Constitution Center](https://billypenn.com/jobs/)

### No positions listed currently
+ [AboutOne](http://www.aboutone.com/jobs/)
+ [Agile Trailblazers](https://agiletrailblazers.workable.com/)
+ [Arcisphere](http://arcisphere.com/careers/)
+ [Azavea](http://jobs.azavea.com/)
+ [Compliance-Implementation-Services](http://www.cisbydeloitte.com/careers/)
+ [CopyCat](http://careers.stackoverflow.com/jobs?company=Copycat)
+ [Drakontas](https://angel.co/drakontas/job)
+ [Globo](https://globolanguage.hyrell.com/UI/Views/Applicant/VirtualStepCareers.aspx)
+ [GlobeTopper](https://angel.co/globetopper/jobs)
+ [GoEmerchant](http://www.goemerchant.com/careers.aspx)
+ [IntroNet](https://secure.intro.net/jobs)
+ [KPIinterface](http://www.kpinterface.com/careers.html)
+ [Municibid](https://municibid.com/jobs/)
+ [Nightkitchen](http://www.whatscookin.com/about/careers)
+ [PHLCVB](http://www.discoverphl.com/about-PHLCVB/employment/)
+ [Plan Management Corp](http://www.optiontrax.com/about-us/working-here/)
+ [PromptWorks](http://www.promptworks.com/jobs/)
+ [Pulsar Informatics](http://www.pulsarinformatics.com/about.html#anchor_positions)
+ [punk ave](http://jobs.punkave.com/)
+ [rda corp](http://rdacorp.com/en/Careers/Current%20Openings)
+ [regdesk](https://angel.co/regdesk/jobs)
+ [savana](http://savanainc.com/company/careers/)
+ [specticast](http://www.specticast.com/en/contents/careers)
+ [stock4good](https://angel.co/stock4good/jobs)
+ [the wilson concept](http://thewilsonconcept.com/careers/)
+ [wildbit](http://wildbit.com/jobs)

Not located in Philly area
+ [Offshorent](http://offshorent.com/careers)


### Blocked by robots.txt
+ [AppNexus](http://www.appnexus.com/en/company/careers/open-roles)
+ [Aramark](https://allcareers-aramark.icims.com/jobs/search?ss=1&searchLocation=12781-12822-)
+ [Nasdaq-OMX](https://careersus-nasdaq.icims.com/jobs/search?ss=1&searchLocation=12781-12822-philadelphia)
+ [University of Pennsylvania Human Resources Department](https://jobs.hr.upenn.edu/postings/search)
