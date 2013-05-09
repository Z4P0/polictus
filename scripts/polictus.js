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










	/**
	 * we must have a location in order to find the correct representative
	 * it is how we initialize everything.
	 * we need to know the proper representatives
	 */
	function Polictus (_latitude,_longitude) {
	 	console.log('hello from: Polictus');
	 	// console.log(_latitude +' | '+_longitude);

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

				// name
				rep.name = data[representative]['first_name']+' '+data[representative]['last_name'];
				rep.title = data[representative]['title'];
				rep.middle_name = data[representative]['middle_name'];
				rep.nickname = data[representative]['nickname'];
				rep.birthday = data[representative]['birthday'];

				/* bioguide */
				rep.bioguide = data[representative]['bioguide_id'];
				/* =================================== */

				// contact info
				rep.office = data[representative]['office'];
				rep.phone = data[representative]['phone'];
				rep.fax = data[representative]['fax'];
				rep.website = data[representative]['website'];
				rep.contact = data[representative]['contact_form'];

				// political info
				rep.in_office = data[representative]['in_office'];
				rep.state = data[representative]['state_name'];
				rep.chamber = data[representative]['chamber'];
				rep.district = data[representative]['district'];
				rep.party = data[representative]['party'];
				
				// social media shit
				rep.twitter = 'http://twitter.com/'+data[representative]['twitter_id'];
				rep.facebook = 'http://facebook.com/'+data[representative]['facebook_id'];
				rep.youtube = 'http://youtube.com/'+data[representative]['youtube_id'];
				// dafuq?
				rep.votesmart = data[representative]['votesmart_id'];
				rep.thomas = data[representative]['thomas_id'];
				rep.fec = data[representative]['fec_ids']; // federal election commitee
				rep.govtrack = data[representative]['govtrack_id'];
				rep.crp = data[representative]['crp_id']; // influence tracker


				// prep to make wikipedia call
				var wikiurl = 'https://en.wikipedia.org/wiki/'+data[representative]['first_name']+'_'+data[representative]['last_name'];
				rep.wikipedia = wikiurl;

				// push
				pol.representatives.push(rep);

				$.ajax({
					url: wikiurl,
						type: 'GET',
						success: function(res) {
							parseWiki(res.responseText);
					}
				});

			}

			// save
			localStorage.setItem('polictus', JSON.stringify(pol));
 		} // end if..loop
 	}





	function parseWiki(_rawHTML) {
		// this func parses it for:
		// - summary bio √
		// - image url √

		// get our saved Politicus object
		var pol = JSON.parse(localStorage.getItem('polictus'));
		var reps = pol.representatives;
		// console.log(reps);
		// for (var representative in reps) {
			// console.log(reps[representative]);
		// }

		var start = _rawHTML.split(/(<table class="infobox vcard")/)[2];
		var image_url = 'https:'+start.split(/(src=")/)[2].split(/(")\s/)[0];
		var bio_summary = start.split(/(<\/table>)/)[2].split(/(<table )/)[0];

		console.log(pol);
	}


	// ===================================
  return {
    Polictus : Polictus
  }
})();