app.main = (function(){
// Declare other classes with app.someClass = (function(){

// })();


	/* =================================== */
	var _polictus;
	/* =================================== */

	// DOM reference vars
	var output;
	var _app;
	// geocoding
	var geocoder;
	var latitude; // might not need these
	var longitude; // might not need these


	function init (){
		console.log("initializing!");

		// set up DOM references
		output = document.getElementById('results');
		_app = document.getElementById('app');
		// geocode setup
		geocoder = new google.maps.Geocoder();

		// is there polictus data?
		// ===================================
		if (localStorage.getItem('polictus') === null) show('start'); // no polictus data. create it
		else start();// polictus data exists. build gui
	}



	// app 'screens'
	// ===================================
	function show(_screen) {
		console.log('hello from: show');
		// this builds DOM elements & adds event listeners for the app interface

		// frag to hold our DOM elements
		var frag = document.createDocumentFragment();

		// initial setup
		// ----------------------------
		if (_screen === 'start') {
			// <p>Find your elected representatives</p>
			frag.appendChild(element('p','Find your elected representatives'));
      // <input type="button" value="Start" id="submitButton">
			var input = document.createElement('input');
					input.setAttribute('type','button');
					input.setAttribute('value','Start');
					input.setAttribute('id','submitButton');
					input.addEventListener('click', function() {navigator.geolocation.getCurrentPosition(success, geocodeError);}, false );
			frag.appendChild(input);
			// <br>
			frag.appendChild(document.createElement('br'));
			// <p class="app_details">We search by using your geolocation.<br><span class="mimic_link">Search for a different location</span></p>
			var p1 = element('p','We search by using your geolocation.');
					p1.className += 'app_details';
			var span1 = element('span','Search for a different location');
					span1.className += 'mimic_link';
					span1.addEventListener('click', function() {$("#address_form").slideToggle();}, false );
					p1.appendChild(document.createElement('br'));
					p1.appendChild(span1);
			frag.appendChild(p1);
			// hidden 'form'
			// <div id="address_form"> <input id="address" type="text" placeholder=" ex. 742 Evergreen Terrace, Springfield"><br> <input type="button" value="Search" id="address_btn"> </div>
      var div = element('div');
      		div.id = 'address_form';
      var p = element('p', 'Please enter a street address');
      		div.appendChild(p);
      var address = element('input');
					address.setAttribute('type','text');
					address.setAttribute('placeholder',' ex. 742 Evergreen Terrace, Springfield');
					address.setAttribute('id','address');
					address.addEventListener('keypress', function (e) {if (e.keyCode === 13) {codeAddress(); } }, false);					
					div.appendChild(address);
					div.appendChild(document.createElement('br'));
			var button = element('input');
					button.setAttribute('type','button');
					button.setAttribute('value','Search');
					button.setAttribute('id','address_btn');
					button.addEventListener('click', function() {codeAddress();}, false );
					div.appendChild(button);
      frag.appendChild(div);
			// <p class="app_details"><span class="more-info">Why not <span class="strike-through">zoidberg</span> zipcodes?</span></p>			
			var p2 = element('p');
					p2.className += 'app_details';
			var span2 = element('span');
					span2.className += 'more-info';
					// innerHTML.. :/
					span2.innerHTML = 'Why not <span class="strike-through">zoidberg</span> zipcodes?</span>';
					span2.addEventListener('click', function() {$("#zipcode-info").slideToggle();}, false );
					p2.appendChild(span2);
			frag.appendChild(p2);
		}
		// show just the address form
		// ----------------------------
		else if (_screen === 'address_form') {
			// <div id="address_form"> <input id="address" type="text" placeholder=" ex. 742 Evergreen Terrace, Springfield"><br> <input type="button" value="Search" id="address_btn"> </div>
      var div = element('div');
      		div.id = 'address_form';
      var p = element('p', 'Please enter a street address');
      		div.appendChild(p);
      var address = element('input');
					address.setAttribute('type','text');
					address.setAttribute('placeholder',' ex. 742 Evergreen Terrace, Springfield');
					address.setAttribute('id','address');
					address.addEventListener('keypress', function (e) {if (e.keyCode === 13) {codeAddress(); } }, false);
					div.appendChild(address);
					div.appendChild(document.createElement('br'));
			var button = element('input');
					button.setAttribute('type','button');
					button.setAttribute('value','Search');
					button.setAttribute('id','address_btn');
					button.addEventListener('click', function() {codeAddress();}, false );
					div.appendChild(button);
      frag.appendChild(div);			
		}
		// herp derp
		// ----------------------------
		else {console.log('lol something went wrong in show()'); }

		// append to DOM
		// ----------------------------
		clear(_app);
		_app.appendChild(frag);
	}

	function start() {
		console.log('hello from: start');
		// build gui
		
		/* dev mode */
		localStorage.removeItem('polictus');
		show('start');
	}

	/* geocoding */
	// save the coords to the global vars
	// ===================================
	function success(position) {
	  // call APIs -> build polictus obj
		_polictus = new app.polictus.Polictus(position.coords.latitude,position.coords.longitude);
	}
	// in case geo-coding fux up
	function geocodeError() {
		clear(output);
		output.appendChild(element('p', 'Looks like something went wrong trying to geolocate within your browser. Try entering a street address to continue'));
		show('address_form');
	}

	function codeAddress() {
	  var address = document.getElementById('address').value;
	  if (address !== '') {
		  geocoder.geocode( { 'address': address}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
				  // call APIs -> build polictus obj
					_polictus = new app.polictus.Polictus(results[0].geometry.location.kb,results[0].geometry.location.lb);
		    }
		    else {alert('Geocode was not successful for the following reason: ' + status); }
		  });
		}
		else { reportError('Please enter an address to continue');}
	// source:
	// https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
	}






	function buildResults(sunLightData){
		console.log('hello from: buildResults');
		
		// print(sunLightData);
		// console.log(sunLightData);
		// for (var uhh in sunLightData) {
		// 	console.log(sunLightData[uhh]);
		// }

		var data = sunLightData.results;
		// console.log(data);

		var ul = document.createElement('ul');
				ul.className += 'representatives';

		for (var representative in data) {
			// console.log(data[representative]);
			var li = document.createElement('li');
					li.appendChild(rep_profile(data[representative]));

			ul.appendChild(li);
		}

		// append finished thing to DOM
		clear(output);
		print(ul);

		// var SLData = sunLightData;
		// var SLResults = SLData.results;

		// var target = output;

		// var OSData;
		// var legislators = [];
		// clear(target);

		// for (var i = 0; i < SLResults.length; i++) {
		// 	var fName = SLResults[i].first_name;
		// 	var lName = SLResults[i].last_name;
		// 	var title = SLResults[i].title;
		// 	var crp_id = SLResults[i].crp_id;
		// 	var facebook_id = SLResults[i].facebook_id;
		// 	var twitter = SLResults[i].twitter_id;
		// 	var youtube = SLResults[i].youtube_id;
		// 	var officeAddress = SLResults[i].office;
		// 	var party = SLResults[i].party;
		// 	var phone = SLResults[i].phone;
		// 	var state = SLResults[i].state_name;
		// 	var website = SLResults[i].website;

		// 	var resultsHTML ="";

		// 	resultsHTML += "<article>";
		// 	resultsHTML += "<h2>" + title + " " + fName + " " + lName +"</h2>";
		// 	resultsHTML += "<p>";
		// 	resultsHTML += "Office Address: " + officeAddress + ", " + state + "<br>";
		// 	resultsHTML += "Phone: " + phone + "<br>";
		// 	resultsHTML += "Party: " + party + "<br>";

		// 	resultsHTML += "<a href='" + website + "'>Website</a>";
		// 	resultsHTML += "</p>";
		// 	resultsHTML += "</article>";

			// clear(target);



			// $.ajax({
			//   url: OPENSECRET_API_URL + '?method=candSummary&cid=' + crp_id + '&cycle=2012&apikey=' + OPENSECRET_API_KEY + '&output=json',
			//   context: document.body
			// }).done(function(data) {
			// 	console.log("OS: " + data);
			// });
			// var legislator = fName + " " + lName;
			// legislators.push(legislator);

		// }

		// target.innerHTML = resultsHTML;
	}

	// process data to make a profile for each representative
	function rep_profile(_data) {
		console.log('rep_profile');
		console.log(_data);

		/* get refernces to all da things */
		// name
		var name = _data['title']+'. '+ _data['first_name']+' '+_data['last_name'];
		var middle_name = _data['middle_name'];
		var nickname = _data['nickname'];
		var birthday = _data['birthday'];

		/* bioguide */
		var bioguide = _data['bioguide_id'];
		/* =================================== */

		// contact info
		var office = _data['office'];
		var phone = _data['phone'];
		var fax = _data['fax'];
		var website = _data['website'];
		var contact = _data['contact_form'];

		// political info
		var in_office = _data['in_office'];
		var state = _data['state_name'];
		var chamber = _data['chamber'];
		var district = _data['district'];
		var party = _data['party'];
		
		// social media shit
		var twitter = 'http://twitter.com/'+_data['twitter_id'];
		var facebook = 'http://facebook.com/'+_data['facebook_id'];
		var youtube = 'http://youtube.com/'+_data['youtube_id'];
		// dafuq?
		var votesmart = _data['votesmart_id'];
		var thomas = _data['thomas_id'];
		var fec = _data['fec_ids']; // federal election commitee
		var govtrack = _data['govtrack_id'];
		var crp = _data['crp_id']; // influence tracker

		/* make da elements | append da things */
		/* =================================== */
		// the big container
		var article = document.createElement('article');
				article.id += bioguide;
				article.className += 'representative_profile';
		// name
		article.appendChild(element('h2', name));
		article.appendChild(element('img','https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/SenatorGillibrandpic.jpg/220px-SenatorGillibrandpic.jpg'));
		// political info
		var political_info = element('ul');
				political_info.className += 'political_info';
				political_info.appendChild(element('li','Is currently in office: '+in_office));
				political_info.appendChild(element('li',state));
				political_info.appendChild(element('li',chamber));
				political_info.appendChild(element('li',district));
				political_info.appendChild(element('li',party));
		article.appendChild(political_info);
		// contact info
		var contact_info = element('ul');
				contact_info.className += 'contact_info';
				contact_info.appendChild(element('li',office));
				contact_info.appendChild(element('li',phone));
				contact_info.appendChild(element('li',fax));
				contact_info.appendChild(element('li',website));
				contact_info.appendChild(element('li',contact));
		article.appendChild(contact_info);
		// social media
		var social_media = element('ul');
				social_media.className += 'social_media';
				social_media.appendChild(element('li',twitter));
				social_media.appendChild(element('li',facebook));
				social_media.appendChild(element('li',youtube));
		article.appendChild(social_media);



		article.appendChild(document.createElement('hr'));
		
		// var ul = document.createElement('ul');
		// 		// ul.className += 'inline';
		// for (var info in _data) {
		// 	// console.log(info);
		// 	// console.log(_data[info]);
		// 	var li = document.createElement('li');
		// 	var p = document.createElement('p');
		// 	var h3 = document.createElement('h3');
		// 			h3.appendChild(document.createTextNode(info));
		// 	var span = document.createElement('span');
		// 			span.appendChild(document.createTextNode(_data[info]));
		// 	// append
		// 	p.appendChild(h3);
		// 	p.appendChild(span);
		// 	li.appendChild(p);
		// 	ul.appendChild(li);
		// }
		// article.appendChild(ul);

		console.log(article);
		return article;
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
	// print out stuff to the DOM
	function print(_thing) {
		// if output is not set it appends to the body
		// position: fixed; left: 0; right: 0; bottom: 0; font-size: 0.75em; padding: 1em; color: tomato;
		// console.log('print');
		// console.log(_thing);

		// var p = document.createElement('p');
		// p.appendChild(document.createTextNode(_thing));
		output.appendChild(_thing);
	}

	//Public interface
	return{
		init : init
	}
})();