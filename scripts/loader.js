var app = {}; //global var

//wait until main document is loaded
window.addEventListener("load",function(){
	//start dynamic loading
	Modernizr.load([{
		//load all libraries and scripts
		load: ["http://code.jquery.com/jquery-2.0.0.min.js","scripts/polictus.js","scripts/main.js"],

		//called when all files have finished loading and executing
		complete: function(){
			console.log("all files loaded!");

			//run init
			app.main.init();

		}
	}
	]); //end Modernizer.load
}); //end addEventListener