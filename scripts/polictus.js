app.polictus = (function () {
	/**
	 * polictus.js
	 *
	 * this powers the whole app.
	 * this makes all the API calls
	 * creates the polictus obj that stores all da info
	 */

	// API vars
	// ===================================

	var PROXY_URL = "proxy.php?filename=";
	// sunlight
	var SUNLIGHT_API_URL = "http://congress.api.sunlightfoundation.com/";
	// var SUNLIGHT_API_KEY = "6cd4ec29bfbf46819f41b6ae97b575af"; // eric's key
	var SUNLIGHT_API_KEY = '&apikey=380054b03efa4f4191c92664fc42904d'; // luis' key


	// govtrack
	var GOVTRACK_API_URL = 'http://www.govtrack.us/api/v2/';


	// opensecret
	var OPENSECRET_API_URL = "http://www.opensecrets.org/api/";
	var OPENSECRET_API_KEY = "c22a9e40689163468d0501d8ee887c8d";
	///http://congress.api.sunlightfoundation.com/bills?apikey=6cd4ec29bfbf46819f41b6ae97b575af
	//http://www.opensecrets.org/api/?method=candSummary&cid=N00007360&cycle=2005&apikey=c22a9e40689163468d0501d8ee887c8d&output=json
	// ===================================



	function Polictus (_latitude,_longitude) {
	 	// make our polictus obj
	 	var polictus = {
	 		"citizen" : {
	 			"name" : "Patriot",
	 			"district" : "",
	 			"email" : "",
	 			"interests" : []
	 		},
	 		"representatives" : [],
	 		"ready" : 0
	 	}
	 	// store it
		localStorage.setItem('polictus', JSON.stringify(polictus));
	 	
	 	// ================ debugging =================
	 	console.log('latitude: '+_latitude+'\nlongitude: '+_longitude);
	 	// ============================================

	 	// make Sunlight API call
		$.ajax({
		  url: SUNLIGHT_API_URL + 'legislators/' + 'locate?latitude='+ _latitude + '&longitude=' + _longitude + SUNLIGHT_API_KEY ,
		  context: document.body
		}).done(
			function(data){
				console.log(data);
				parseJSON('sunlight', data);
			}
		);

		/* ----------- process ------------ */
		/* sunlight --> wikipedia --> gov track & influence explorer */
	}
 	/* ============== end constructor =============== */



 	/* Parsers (JSON, HTML) */
 	/* =================================== */
 	function parseJSON(_from, _data) {
 		// single function to parse all our JSON returns

		// get our saved Politicus object
		var pol = JSON.parse(localStorage.getItem('polictus'));

 		if (_from === 'sunlight') {
			var data = _data.results;
			
			// for each rep
			for (var representative in data) {
				// make a new object > push it to the Politicus object
				var rep = {};

				// copy the info over from sunlight
				for (var info in data[representative]) {
					rep[info] = data[representative][info];
				}

				// wikipedia info
				var wikiurl = 'https://en.wikipedia.org/wiki/'+data[representative]['first_name']+'_'+data[representative]['last_name'];
				// make sure we have a valid wiki url
				wikiurl = wikiurl.replace(' ','_'); // replace empty strings with underscores: _
				wikiurl = wikiurl.replace('é','e'); // é --> e
				rep.wikipedia = wikiurl;
				// make wikipedia call
				// makes wiki call
				$.ajax({
					url: wikiurl,
						type: 'GET',
						success: function(res) {
							parseWiki(res.responseText);
					}
				});					

				// push representative info to the polictus obj
				pol.representatives.push(rep);
			}

			// save polictus obj
			localStorage.setItem('polictus', JSON.stringify(pol));
 		} else if (_from === 'govtrack') {
 			var numBills = 10;
 			// parse govtrack json
 			// console.log('parse govtrack');
 			var GTbioguide_id = _data.objects[0].person.bioguideid;
 			// console.log(_data);
 			// console.log(pol);

 			for (var i = 0; i < pol.representatives.length; i++) {
 				if(pol.representatives[i].bioguide_id == GTbioguide_id){
 					// this is slooooooooow
 					// pol.representatives[i].bills = _data.objects.splice(100-numBills, numBills);
 					pol.representatives[i].bills = _data.objects;

 				}
 			};
 			localStorage.setItem('polictus', JSON.stringify(pol));
 			console.log("pol2");

 			console.log(pol);
 		} // end if..loop
 	}

	function parseWiki(_rawHTML) {
		// this func parses it for:
		// summary bio & image url
		var start = _rawHTML.split(/(<table class="infobox vcard")/)[2];
		var image_url = 'https:'+start.split(/(src=")/)[2].split(/(")\s/)[0];
		var bio_summary = start.split(/(<\/table>)/)[2].split(/(<table )/)[0];
				bio_summary = bio_summary.replace('<p>','').replace('</p>',''); // parse off <p> and </p>
				/* confirmed that the above is working fine (y) */
				/* it's getting the right url that's the issue */

		// get our saved Politicus object
		var pol = JSON.parse(localStorage.getItem('polictus'));
		var reps = pol.representatives;

		// which representative is the wiki data for?
		var rep;		

		for (var representative in reps) {
			// setup regex test
			// - we have to remove special characters like: é
			var _name = reps[representative]['last_name'].replace('é', 'e');
			var name = new RegExp(_name);

			// if the the last name can be found in the bio_summary we have the right match
			if (name.test(bio_summary)) {
				// add the info to the polictus obj
				reps[representative]['profile_picture'] = image_url;
				reps[representative]['bio'] = bio_summary;
				// we know who we're working with
				rep = reps[representative];
			}
		}

		// save polictus obj
		localStorage.setItem('polictus', JSON.stringify(pol));

		// call govtrack API for their last 10 votes
		var govtrack_url = GOVTRACK_API_URL + 'vote_voter/?person='+rep.govtrack_id+'&limit=5&order_by=-created';
		// console.log("YOOOOO: " + PROXY_URL + govtrack_url);
		// $.getJSON( govtrack_url, function ( data ) { console.log(data); } );
		$.ajax(
		{
		  type: "GET",
		  url: PROXY_URL + govtrack_url,
		  contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(data){
          	parseJSON('govtrack', data);
          }

		  // dataType: "jsonp"
		  //we are specifying our callback in the url
		});

		// build dashboard
		
		/* dash() only runs after all profiles are complete */
		app.main.dash();
	}


	// ===================================
  return {
    Polictus : Polictus
  }
})();