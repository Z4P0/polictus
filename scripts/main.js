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

		var submitButton = $("#submitButton");
		var sunLightData;
		var openSecretData;

		submitButton.click(function(){
			var zipQuery = $("#queryBox").val();

			$.ajax({
			  url: SUNLIGHT_API_URL + 'legislators/' + 'locate?zip='+ zipQuery +'&apikey=' + SUNLIGHT_API_KEY ,
			  context: document.body
			}).done(function(data) {
				console.log(data);
				buildResults(data);
				// buildSunlight(data);
			});
		});

		
	}
	function buildResults(sunLightData){
		var SLData = sunLightData;
		var SLResults = SLData.results;

		var target = $("section#main.content div.wrapper");

		// var OSData;
		// var legislators = [];

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

			var html ="";

			html += "<article>";
			html += "<h2>" + title + " " + fName + " " + lName +"</h2>";
			html += "<p>";
			html += "Office Address: " + officeAddress + ", " + state + "<br>";
			html += "Phone: " + phone + "<br>";
			html += "Party: " + party + "<br>";

			html += "<a href='" + website + "'>Website</a>";
			html += "</p>";
			html += "</article>";

			target.append(html);


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
	function buildSunlight(data){
		var target = $("section#main.content div.wrapper");
		var results = data.results;
		var curPage = data.page.page;

		console.log(data);
		// console.log(results.length);

		for (var i = 0; i < results.length; i++) {
			var result = results[i];
			console.log(result);
			var html = "";

			var billTitle = result.official_title;
			var introDate = result.introduced_on;
			var pages = result.last_version.pages;
			var link = result.urls.congress;

			html += "<article>";
			html += "<h2>" + billTitle + "</h2>";
			html += "<p>";
			html += "Introduced on: " + introDate + "<br>";
			html += "Number of pages: " + pages + "<br>";
			html += "<a href='" + link + "'>Link</a>";
			html += "</p>";
			html += "</article>";

			target.append(html);


		};



	}

	//Public interface
	return{
		init : init
		//someVar : someVar,
		//someFunc : someFunc
	}
})();