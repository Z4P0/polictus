app.polictus = (function () {
	/**
	 * polictus.js
	 *
	 * this powers the whole app.
	 * this makes all the API calls
	 * creates the polictus obj that stores all da info
	 */

	var DATA = {"results":[{"bioguide_id":"S000480","birthday":"1929-08-14","chamber":"house","contact_form":"http://www.louise.house.gov/index.php?option=com_content&task=view&id=506&Itemid=150","crp_id":"N00001311","district":25,"facebook_id":"RepLouiseSlaughter","fax":"202-225-7822","fec_ids":["H6NY03031"],"first_name":"Louise","gender":"F","govtrack_id":"400378","in_office":true,"last_name":"Slaughter","middle_name":"McIntosh","name_suffix":null,"nickname":null,"office":"2469 Rayburn House Office Building","party":"D","phone":"202-225-3615","state":"NY","state_name":"New York","thomas_id":"01069","title":"Rep","twitter_id":"louiseslaughter","votesmart_id":26991,"website":"http://www.louise.house.gov","youtube_id":"louiseslaughter"},{"bioguide_id":"S000148","birthday":"1950-11-23","chamber":"senate","contact_form":"http://www.schumer.senate.gov/Contact/contact_chuck.cfm","crp_id":"N00001093","district":null,"facebook_id":"chuckschumer","fax":"202-228-3027","fec_ids":["S8NY00082"],"first_name":"Charles","gender":"M","govtrack_id":"300087","in_office":true,"last_name":"Schumer","lis_id":"S270","middle_name":"E.","name_suffix":null,"nickname":null,"office":"322 Hart Senate Office Building","party":"D","phone":"202-224-6542","senate_class":3,"state":"NY","state_name":"New York","state_rank":"senior","thomas_id":"01036","title":"Sen","twitter_id":"chuckschumer","votesmart_id":26976,"website":"http://www.schumer.senate.gov","youtube_id":"SenatorSchumer"},{"bioguide_id":"G000555","birthday":"1966-12-09","chamber":"senate","contact_form":"http://www.gillibrand.senate.gov/contact/","crp_id":"N00027658","district":null,"facebook_id":"KirstenGillibrand","fax":"202-225-1168","fec_ids":["H6NY20167"],"first_name":"Kirsten","gender":"F","govtrack_id":"412223","in_office":true,"last_name":"Gillibrand","lis_id":"S331","middle_name":"E.","name_suffix":null,"nickname":null,"office":"478 Russell Senate Office Building","party":"D","phone":"202-224-4451","senate_class":1,"state":"NY","state_name":"New York","state_rank":"junior","thomas_id":"01866","title":"Sen","twitter_id":null,"votesmart_id":65147,"website":"http://www.gillibrand.senate.gov","youtube_id":"KirstenEGillibrand"}],"count":3,"page":{"count":3,"per_page":20,"page":1}};


	// API vars
	// ===================================
	// sunlight
	var SUNLIGHT_API_URL = "http://congress.api.sunlightfoundation.com/";
	// eric's key
	// var SUNLIGHT_API_KEY = "6cd4ec29bfbf46819f41b6ae97b575af";
	// luis' key
	var SUNLIGHT_API_KEY = '380054b03efa4f4191c92664fc42904d';

	
	// opensecret
	var OPENSECRET_API_URL = "http://www.opensecrets.org/api/";
	var OPENSECRET_API_KEY = "c22a9e40689163468d0501d8ee887c8d";
	///http://congress.api.sunlightfoundation.com/bills?apikey=6cd4ec29bfbf46819f41b6ae97b575af
	//http://www.opensecrets.org/api/?method=candSummary&cid=N00007360&cycle=2005&apikey=c22a9e40689163468d0501d8ee887c8d&output=json





	// wikipedia
	// ----------------------------
	// example for getting HTML
	// http://en.wikipedia.org/w/index.php?action=render&title=Main_Page
	var WIKIPEDIA_API_URL = 'http://en.wikipedia.org/w/index.php';
	var WIKIPEDIA_API_ACTION = '?action=render';	
	var WIKIPEDIA_API_TITLES = '&title=Kirsten_Gillibrand';
	console.log(
		WIKIPEDIA_API_URL+
		WIKIPEDIA_API_ACTION+
		WIKIPEDIA_API_TITLES
	);



	// Data holders
	var sunLightData;
	var openSecretData;




	/* KEEP THIS FOR LATER: */
	/* getting stuff based on geolocation
	http://congress.api.sunlightfoundation.com/legislators/locate?latitude=43.0854174&longitude=-77.65863490000001&apikey=380054b03efa4f4191c92664fc42904d
	*/


















/**
 * we must have a location in order to find the correct representative
 * it is how we initialize everything.
 * we need to know the proper representatives
 */

	function Polictus (_latitude,_longitude) {
	 	console.log('hello from: Polictus');
	 	console.log(_latitude +' | '+_longitude);

	 	var polictus = {
	 		"citizen" : {
	 			"name" : "Patriot",
	 			"interests" : []
	 		},
	 		"representatives" : []
	 	}
	 	console.log(polictus);
	/*
	polictus = {
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
		]
	}
	 */

	}



	// ===================================

	function callAPIs(){
		var zipQuery = $("#zipcode").val();

		$.ajax({
		  url: SUNLIGHT_API_URL + 'legislators/' + 'locate?zip='+ zipQuery +'&apikey=' + SUNLIGHT_API_KEY ,
		  context: document.body
		}).done(function(data) {
			console.log(data);

			buildResults(data);
			// buildSunlight(data);
		});

		// USING PROXY
		// ----------------------------
		// var PROXY_URL = "feed_proxy.php?filename=";

		// // var ATOM_URL = "http://earthquake.usgs.gov/earthquakes/feed/v0.1/summary/2.5_month.atom";
		// var ATOM_URL = "http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topsongs/limit=10/xml";

		// $.ajax(
		// {
		// 		type: "GET",
		// 		url: PROXY_URL + ATOM_URL,
		// 		dataType: "xml",
		// 		success:function(xml){onLoaded(xml);}
		// });

	}


 	/* Parsers (JSON, HTML) */
 	/* =================================== */
	function parseWiki(_rawHTML) {
		// the stuff we want is hidden in html returned by wikipedia
		// this func parses it for:
		// - summary bio
		// - image url
		// (additional the wikipedia URL is provided)
		// when done it saves the info to the polictus object
	}

	// ===================================
  return {
    Polictus : Polictus
  }
})();