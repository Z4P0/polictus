# Polictus


Find out your representative and their financial backers

--

Live site:
[http://polict.us](http://polict.us)

Check out `notes.txt` to see TODOs, Bugs to fix and feature ideas

--

### The Set-Up

Determine location --> Call sunlight --> Call wikipedia --> Call govtrack

All of this information gets gathered and stored in JSON object (called polictus). The **Polictus** object is then saved using localStorage and parsed to populate the page with information

`polictus = {
	citizen : {
		name : "patriot",
		district : "25", // if this isn't known we show the start up screen
		email : "email@address.com",
		interests : [
			// used to notify users of bills that might affect them
			// + highlight bills/vote that they care about
		]
	},
	representatives : [
		// this would get populated on startup
		{
			name: "some thing",
			[all sunlight info],
			bio : "[wikipedia text]",
			picture : "[url from wikipedia]"
			[all other API info we get]
		},
		{
			name: "other senator",
			[all other info]
		}
	],
	reader : 0
}`


##### index.html
	header (Polictus w/ tagline)
	has a loading.gif
	info on why not to use zipcodes
	and the footer

##### on Initial load (the first visit)
	the loading.gif is cleared then replaced with:
	- button to use geolocation (HTML5) to make API calls
	- 'hidden' input area where you can search for a specific city or address
	either way the APIs are called and used to populate the **Polictus** object

##### Dashboard view
the **Polictus** object is then parsed and used to build the 'Dashboard'



--

APIs/Services used
	- HTML5 Geolocation
	- Google Geocoder - for address input
	- Sunlight API
	- Wikipedia
	- Govtrack
	
Web Technology
	- Geolocation
	- localStorage
	- Responsive Design
	- SASS

Libraries
	- ICANHAZ.js
	- Modernizr
	- JQuery (and xdomain plugin)


--
### Thank Yous
A **HUGE** thanks goes out to the Sunlight team for prodividing such a great service that serves as one of the backbones of this project