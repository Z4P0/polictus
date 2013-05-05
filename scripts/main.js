// Declare other classes with app.someClass = (function(){

// })();


app.main = (function(){

	var SUNLIGHT_API_URL = "http://congress.api.sunlightfoundation.com/";
	var SUNLIGHT_API_KEY = "6cd4ec29bfbf46819f41b6ae97b575af";
	var OPENSECRET_API_URL = "http://www.opensecrets.org/api/"
	var OPENSECRET_API_KEY = "c22a9e40689163468d0501d8ee887c8d";
	///http://congress.api.sunlightfoundation.com/bills?apikey=6cd4ec29bfbf46819f41b6ae97b575af
	//http://www.opensecrets.org/api/?method=candSummary&cid=N00007360&cycle=2005&apikey=c22a9e40689163468d0501d8ee887c8d&output=json


	function init (){
		console.log("initializing!");
		document.getElementById('zipcode').addEventListener('keypress', function (e) {if (e.keyCode === 13) validate(); }, false)

		var submitButton = $("#submitButton");
		var sunLightData;
		var openSecretData;

		submitButton.click(function(){
			validate();
		});

		
	}
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
	}
	function buildResults(sunLightData){
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
						if (!parseInt(trimmedInput[i])) isValid = false;
					};
					
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
		var output = document.getElementById('results');
		// clear the node
		clear(output);
		// appened msg to output
		p = document.createElement('p');
		p.className += 'error';
		p.appendChild(document.createTextNode(_text));
		output.appendChild(p);
		// console.log(_text);
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

	//Public interface
	return{
		init : init
		//someVar : someVar,
		//someFunc : someFunc
	}
})();