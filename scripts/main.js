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
		      var p = element('p', 'Please enter a street address or city name and state');
      		div.appendChild(p);
		      var address = element('input');
					address.setAttribute('type','text');
					address.setAttribute('placeholder',' ex. Oakland NJ');
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
			// <article id="zipcode-info">
			var article = element('article');
					article.id='zipcode-info';
					// <h2>Don't Use Zipcodes</h2>
					var h2 = element('h2','Don\'t Use Zipcodes');
					article.appendChild(h2);
					var p3 = element('p','A zip code may intersect multiple Congressional districts, so locating by zip may return multiple representatives, and possibly more than 2 senators if the zip code crosses state borders.');
					article.appendChild(p3);
					var p4 = element('p','The first complication is probably obvious: zip codes and congressional districts aren\'t the same thing. A zip code can span more than one district (or even more than one state!), so if you want to support zip lookups for your users, you\'ll have to support cases where more than one matching district is returned.');
					article.appendChild(p4);
					var p5 = element('p','Zip codes are lines, in other words, while congressional districts are polygons. This means that mapping zips to congressional districts is an inherently imperfect process.');
					article.appendChild(p5);
					var p6 = element('p','The government uses something called a zip code tabulation area (ZCTA) to approximate the geographic footprint of a given zip as a polygon, and this is what we use to map zip codes to congressional districts. But it really is just an approximation -- it\'s far from perfect.');
					article.appendChild(p6);
					// <p><small>Source: <a href="http://sunlightfoundation.com/blog/2012/01/19/dont-use-zipcodes/">Don't Use Zipcodes</a></small></p>
					var p7 = element('p','Source: ');
					p7.className = 'small';
					p7.appendChild(element('a','http://sunlightfoundation.com/blog/2012/01/19/dont-use-zipcodes/'));
					article.appendChild(p7);
					// <hr>
					article.appendChild(element('hr'));
			frag.appendChild(article);
		}
		// show just the address form
		// ----------------------------
		else if (_screen === 'address_form') {
			// <div id="address_form"> <input id="address" type="text" placeholder=" ex. 742 Evergreen Terrace, Springfield"><br> <input type="button" value="Search" id="address_btn"> </div>
      var div = element('div');
      		div.id = 'address_form';
      		div.style.display = 'block';
      var p = element('p', 'Please enter a city or street address to continue');
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
	function dash() {
		// we have to make sure the all the data is ready
		// get the polictus obj
		var pol = JSON.parse(localStorage.getItem('polictus'));

		/**
		 * we increment the polictus.ready value by 1
		 * until it matches the length of representatives we have
		 * - this prevents us from building DOM elements with information missing
		 */
		if (pol.ready === pol.representatives.length-1) {
			// object is ready

			// set <body> id="dashboard"
			document.getElementsByTagName('body')[0].id='dashboard';
			
			// clear our target object
			clear(output);

			// for each representative..
			for (var representative in pol['representatives']) {
				// build their profile, with their data
				build('representative_profile', pol['representatives'][representative]);
			}

			/**
			 * since we're hacking the info from wikipedia
			 * it comes with the raw <a href="#"> tags in it
			 * we need to cancel those default actions
			 * - we set their hrefs to javascript: void(0);
			 */
			var bios = document.getElementsByClassName('bio');
			for (var i = 0; i < bios.length; i++) {
				var links = bios[i].getElementsByTagName('a');
				for (var j = 0; j < links.length; j++) {links[j].href='javascript: void(0);'; };
			};

			// show dashboard menu
			show('dashboard');
			console.log(pol);
		}
		else {
			// increment
			pol.ready++;
			// save
			localStorage.setItem('polictus', JSON.stringify(pol));
		}
	}



	/* geocoding */
	// save the coords to the global vars
	// ===================================
	function success(position) {
	  // call APIs -> build polictus obj
		_polictus = new app.polictus.Polictus(position.coords.latitude,position.coords.longitude);
	}
	// in case geo-coding fux up/user doesn't want to allow geolocation
	function geocodeError() {
		show('address_form');
	}
	// enter custom address
	function codeAddress() {
	  var address = document.getElementById('address').value;
	  if (address !== '') {
		  geocoder.geocode( { 'address': address}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		    	// DEBUG
		    	console.log(results[0]);

				  // call APIs -> build polictus obj
					_polictus = new app.polictus.Polictus(results[0].geometry.location.jb,results[0].geometry.location.kb);
				}
		    else {alert('Geocode was not successful for the following reason: ' + status); }
		  });
		}
		else { reportError('Please enter an address to continue');}
	// source:
	// https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
	}






	function build(_something, _data){
		if (_something === 'representative_profile') {
			// icanhaz makes the DOM elements
			var rep = ich.repTemplate(_data);
			$("#results").append(rep);
		}
		// something went wrong
		else {console.log('herp derp - from build()'); }
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