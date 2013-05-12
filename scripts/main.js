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
		else dash();// polictus data exists. build gui
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
      var p = element('p', 'Please enter a street address or city name');
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
		// show dash menu
		else if (_screen === 'dashboard') {
			console.log('make dashboard');
		}
		// herp derp
		// ----------------------------
		else {console.log('lol something went wrong in show()'); }

		// append to DOM
		// ----------------------------
		clear(_app);
		_app.appendChild(frag);
	}

	// the dashboard
	// this builds HTML from reading 
	function dash() {
		console.log('hello from: dash');

		// set <body> id="dashboard"
		document.getElementsByTagName('body')[0].id='dashboard';

		// get the polictus obj
		var pol = localStorage.getItem('polictus');
		pol = JSON.parse(pol);
		// console.log(pol);

		// create list of representatives
		// var representatives = element('ul');
		// for each representative..
		clear(output);
		console.log("blah" + pol['representatives']);
		for (var representative in pol['representatives']) {
			console.log("Yoo "+representative);
			// build their profile, with their data
			// var rep = element('li');
			build('representative_profile', pol['representatives'][representative]);
			// representatives.appendChild(rep);
		}
		// output.appendChild(representatives);

		// show dashboard menu
		show('dashboard');
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
		show('address_form');
		clear(output);
		output.appendChild(element('p', 'Looks like something went wrong trying to geolocate within your browser. Try entering a street address to continue'));
	}
	// enter custom address
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






	function build(_something, _data){
		console.log('hello from: build');
		// always returns a DOM obj

		if (_something === 'representative_profile') {
			// icanhaz makes the DOM elements
			var rep = ich.repTemplate(_data);
			$("#results").append(rep);
		}
		// something went wrong
		else {console.log('herp derp - from build()'); }
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
	// makes <dd> and <dt>;
	function definitionOf(_title, _definition) {
		var frag = document.createDocumentFragment();
		frag.appendChild(element('dt', _title));
		frag.appendChild(element('dd', _definition));
		return frag;
	}

	// print out stuff to the DOM
	function print(_thing) {
		output.appendChild(_thing);
	}

	//Public interface
	return{
		init : init,
		dash : dash
	}
})();