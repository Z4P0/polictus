// Declare other classes with app.someClass = (function(){

// })();


app.main = (function(){
	// API vars
	// ===================================
	var SUNLIGHT_API_URL = "http://congress.api.sunlightfoundation.com/";
	// eric's key
	// var SUNLIGHT_API_KEY = "6cd4ec29bfbf46819f41b6ae97b575af";
	// luis' key
	var SUNLIGHT_API_KEY = '380054b03efa4f4191c92664fc42904d';
	var OPENSECRET_API_URL = "http://www.opensecrets.org/api/";
	var OPENSECRET_API_KEY = "c22a9e40689163468d0501d8ee887c8d";
	///http://congress.api.sunlightfoundation.com/bills?apikey=6cd4ec29bfbf46819f41b6ae97b575af
	//http://www.opensecrets.org/api/?method=candSummary&cid=N00007360&cycle=2005&apikey=c22a9e40689163468d0501d8ee887c8d&output=json

	// DOM reference vars
	var output;
	// Data holders
	var sunLightData;
	var openSecretData;


	// dummy data (14411)
//	/*
var DATA = {
  "results": [
    {
      "bioguide_id": "C001092",
      "birthday": "1950-05-20",
      "chamber": "house",
      "contact_form": null,
      "crp_id": "",
      "district": 27,
      "facebook_id": "467047586692268",
      "fax": null,
      "fec_ids": [
          "H8NY29032"
      ],
      "first_name": "Chris",
      "gender": "M",
      "govtrack_id": "412563",
      "in_office": true,
      "last_name": "Collins",
      "middle_name": null,
      "name_suffix": null,
      "nickname": null,
      "office": "1117 Longworth House Office Building",
      "party": "R",
      "phone": "202-225-5265",
      "state": "NY",
      "state_name": "New York",
      "thomas_id": "02151",
      "title": "Rep",
      "twitter_id": "RepChrisCollins",
      "votesmart_id": "",
      "website": "http://chriscollins.house.gov"
    },
    {
      "bioguide_id": "S000148",
      "birthday": "1950-11-23",
      "chamber": "senate",
      "contact_form": "http://www.schumer.senate.gov/Contact/contact_chuck.cfm",
      "crp_id": "N00001093",
      "district": null,
      "facebook_id": "chuckschumer",
      "fax": "202-228-3027",
      "fec_ids": [
          "S8NY00082"
      ],
      "first_name": "Charles",
      "gender": "M",
      "govtrack_id": "300087",
      "in_office": true,
      "last_name": "Schumer",
      "lis_id": "S270",
      "middle_name": "E.",
      "name_suffix": null,
      "nickname": null,
      "office": "322 Hart Senate Office Building",
      "party": "D",
      "phone": "202-224-6542",
      "senate_class": 3,
      "state": "NY",
      "state_name": "New York",
      "state_rank": "senior",
      "thomas_id": "01036",
      "title": "Sen",
      "twitter_id": "chuckschumer",
      "votesmart_id": 26976,
      "website": "http://www.schumer.senate.gov",
      "youtube_id": "SenatorSchumer"
    },
    {
      "bioguide_id": "G000555",
      "birthday": "1966-12-09",
      "chamber": "senate",
      "contact_form": "http://www.gillibrand.senate.gov/contact/",
      "crp_id": "N00027658",
      "district": null,
      "facebook_id": "KirstenGillibrand",
      "fax": "202-225-1168",
      "fec_ids": [
          "H6NY20167"
      ],
      "first_name": "Kirsten",
      "gender": "F",
      "govtrack_id": "412223",
      "in_office": true,
      "last_name": "Gillibrand",
      "lis_id": "S331",
      "middle_name": "E.",
      "name_suffix": null,
      "nickname": null,
      "office": "478 Russell Senate Office Building",
      "party": "D",
      "phone": "202-224-4451",
      "senate_class": 1,
      "state": "NY",
      "state_name": "New York",
      "state_rank": "junior",
      "thomas_id": "01866",
      "title": "Sen",
      "twitter_id": null,
      "votesmart_id": 65147,
      "website": "http://www.gillibrand.senate.gov",
      "youtube_id": "KirstenEGillibrand"
    }
  ],
  "count": 3,
  "page": {
    "count": 3,
    "per_page": 20,
    "page": 1
  }
};


	function init (){
		console.log("initializing!");
		output = document.getElementById('results');

		var submitButton = $("#submitButton");

		// start app
		// ===================================
		// press Enter to submit
		// document.getElementById('zipcode').addEventListener('keypress', function (e) {if (e.keyCode === 13) validate(); }, false)
		// click on 'submit'
		submitButton.click(function(){
			// validate();
			buildResults(DATA);
		  navigator.geolocation.getCurrentPosition(success, reportError);
		});
	}



	// geocoding
	// ===================================
	function success(position) {
	  var s = output;
	  
	  if (s.className == 'success') {
	    // not sure why we're hitting this twice in FF, I think it's to do with a cached result coming back    
	    return;
	  }
	  
	  s.innerHTML = "found you!";
	  s.className = 'success';
	  
	  var mapcanvas = document.createElement('div');
	  mapcanvas.id = 'mapcanvas';
	  mapcanvas.style.height = '400px';
	  mapcanvas.style.width = '560px';
	    
	  document.querySelector('article').appendChild(mapcanvas);
	  
	  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	  var myOptions = {
	    zoom: 15,
	    center: latlng,
	    mapTypeControl: false,
	    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  };
	  var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
	  
	  var marker = new google.maps.Marker({
	      position: latlng, 
	      map: map, 
	      title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
	  });
	}

function error(msg) {
  var s = output;
  s.innerHTML = typeof msg == 'string' ? msg : "failed";
  s.className = 'fail';
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


	function buildResults(sunLightData){
		console.log('hello from: buildResults');
		console.log(sunLightData);

		var SLData = sunLightData;
		var SLResults = SLData.results;

		var target = $("#results");

		// var OSData;
		// var legislators = [];
		target.html("");

		for (var i = 0; i < SLResults.length; i++) {
			var fName = SLResults[i].first_name;
			var lName = SLResults[i].last_name;
			var title = SLResults[i].title;
			var crp_id = SLResults[i].crp_id;
			var facebook_id = SLResults[i].facebook_id;
			var twitter = SLResults[i].twitter_id;
			var youtube = SLResults[i].youtube_id;
			var officeAddress = SLResults[i].office;
			var party = SLResults[i].party;
			var phone = SLResults[i].phone;
			var state = SLResults[i].state_name;
			var website = SLResults[i].website;

			var resultsHTML ="";

			resultsHTML += "<article>";
			resultsHTML += "<h2>" + title + " " + fName + " " + lName +"</h2>";
			resultsHTML += "<p>";
			resultsHTML += "Office Address: " + officeAddress + ", " + state + "<br>";
			resultsHTML += "Phone: " + phone + "<br>";
			resultsHTML += "Party: " + party + "<br>";

			resultsHTML += "<a href='" + website + "'>Website</a>";
			resultsHTML += "</p>";
			resultsHTML += "</article>";

			// clear(target);

			target.append(resultsHTML);


			// $.ajax({
			//   url: OPENSECRET_API_URL + '?method=candSummary&cid=' + crp_id + '&cycle=2012&apikey=' + OPENSECRET_API_KEY + '&output=json',
			//   context: document.body
			// }).done(function(data) {
			// 	console.log("OS: " + data);
			// });
			// var legislator = fName + " " + lName;
			// legislators.push(legislator);

		};
	}

	function validate() {
		// get DOM value
		var input = document.getElementById('zipcode').value;
		
		// make sure it's a string
		if (typeof input === 'string') {
			// test for an empty string
			if (input.length === 0 ) { reportError('Please enter a zipcode to begin. Try 14411'); }
			else {
				// trim empty space off of the beginning and end
				var trimmedInput = trim(input);
				if (trimmedInput.length !== 5) reportError('There is a problem with the input you have entered');
				else {
					var isValid = true;
					// make sure the input is a zipcode
					for (var i = 0; i < trimmedInput.length; i++) {
						// if they can't be parses to ints, it's not valid
						if (!parseInt(trimmedInput[i])) {
							isValid = false;

							// weird error when zipcodes start with 0
							if (parseInt(trimmedInput[i]) === 0) isValid = true;
						}
					} // end for loop

					// now that we tested it..
					if (isValid) callAPIs();
					else reportError('There is a problem with the zipcode you entered: '+trimmedInput+' is not a valid zipcode.');
				}
			}
		}
		// idk how you would get to the error below but whatevs
		else {reportError('you done goofed');}
	}

	// prints out error message to user
	function reportError(_text) {
		// get DOM reference
		// var output = document.getElementById('results');
		// clear the node
		clear(output);
		// appened msg to output
		p = document.createElement('p');
		p.className += 'error';
		// if no _text, give default
		if (arguments.length !== 0) p.appendChild(document.createTextNode(_text));
		else p.appendChild(document.createTextNode('Something went wrong'));
		output.appendChild(p);
	}


	/* utils */
	/* =================================== */
	// trim empty space
	function trim(str) {
		// source:
		// http://stackoverflow.com/questions/3000649/trim-spaces-from-start-and-end-of-string
	  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}
	// clear nodes
	function clear(_element) {
	  while( _element.hasChildNodes() ) {
	    _element.removeChild( _element.firstChild );
	  }
	}
	// returns a custom element
	function element(_element, _text) {
		var ele = document.createElement(_element);

		// if we have a 2nd parameter
		if (_text !== undefined) {
			if (_element === 'img') ele.setAttribute('src', _text);
			else {
				if (_element === 'a') ele.setAttribute('href', _text);
				var text = document.createTextNode(_text);
				ele.appendChild(text);
			}
		}
		return ele;
	}

	//Public interface
	return{
		init : init
		//someVar : someVar,
		//someFunc : someFunc
	}
})();