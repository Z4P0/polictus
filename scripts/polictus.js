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
	// sunlight
	var SUNLIGHT_API_URL = "http://congress.api.sunlightfoundation.com/";
	// eric's key
	// var SUNLIGHT_API_KEY = "6cd4ec29bfbf46819f41b6ae97b575af";
	// luis' key
	var SUNLIGHT_API_KEY = '&apikey=380054b03efa4f4191c92664fc42904d';

	
	// opensecret
	var OPENSECRET_API_URL = "http://www.opensecrets.org/api/";
	var OPENSECRET_API_KEY = "c22a9e40689163468d0501d8ee887c8d";
	///http://congress.api.sunlightfoundation.com/bills?apikey=6cd4ec29bfbf46819f41b6ae97b575af
	//http://www.opensecrets.org/api/?method=candSummary&cid=N00007360&cycle=2005&apikey=c22a9e40689163468d0501d8ee887c8d&output=json


	// Data holders
	var sunLightData;
	var openSecretData;



	function Polictus (_latitude,_longitude) {
	 	console.log('hello from: Polictus');

	 	// make our polictus obj
	 	var polictus = {
	 		"citizen" : {
	 			"name" : "Patriot",
	 			"district" : "",
	 			"email" : "",
	 			"interests" : []
	 		},
	 		"representatives" : []
	 	}
	 	// store it
		localStorage.setItem('polictus', JSON.stringify(polictus));
	 	

	 	// make Sunlight API call
		$.ajax({
		  url: SUNLIGHT_API_URL + 'legislators/' + 'locate?latitude='+ _latitude + '&longitude=' + _longitude + SUNLIGHT_API_KEY ,
		  context: document.body
		}).done(
			function(data){
				parseJSON('sunlight', data);
			}
		);

		/* ----------- process ------------ */
		/* sunlight > wikipedia > gov track & influence explorer */
		/* when done..  */
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
				callWikipedia(wikiurl);

				// push representative info to the polictus obj
				pol.representatives.push(rep);
			}

			// save polictus obj
			localStorage.setItem('polictus', JSON.stringify(pol));
 		} // end if..loop
 	}

	function callWikipedia(_wikiURL) {
		// makes wiki call
		// console.log('hello from: callWikipedia: '+_wikiURL);

		$.ajax({
			url: _wikiURL,
				type: 'GET',
				success: function(res) {
					parseWiki(res.responseText);
			}
		});		
	}

	function parseWiki(_rawHTML) {
		// this func parses it for:
		// - summary bio
		// - image url
		console.log('parseWiki');
		var start = _rawHTML.split(/(<table class="infobox vcard")/)[2];
		if (start === undefined) {
			// alert('thing');
			console.log(_rawHTML);
		}
		var image_url = 'https:'+start.split(/(src=")/)[2].split(/(")\s/)[0];
		var bio_summary = start.split(/(<\/table>)/)[2].split(/(<table )/)[0];
		/* confirmed that the above is working fine (y) */
		// console.log(image_url);
		// console.log(bio_summary);

		// get our saved Politicus object
		var pol = JSON.parse(localStorage.getItem('polictus'));
		var reps = pol.representatives;

		// which representative is the wiki data for?
		for (var representative in reps) {
			// setup regex test
			// - we have to remove special characters like: é
			var _name = reps[representative]['last_name'].replace('é', 'e');
			var name = new RegExp(_name);
			console.log(name);

			// if the the last name can be found in the bio_summary we have the right match
			if (name.test(bio_summary)) {
				// console.log('wiki for: '+reps[representative]['last_name']);
				// console.log(bio_summary);
				// add the info to the polictus obj
				reps[representative]['profile_picture'] = image_url;
				reps[representative]['bio'] = bio_summary;
			}
		}


		// save polictus obj
		localStorage.setItem('polictus', JSON.stringify(pol));

		// build dashboard
		console.log('commented out call to dash()');
		// app.main.dash();
	}


	// ===================================
  return {
    Polictus : Polictus
  }
})();