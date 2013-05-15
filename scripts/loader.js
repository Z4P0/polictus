var app = {}; //global var

//wait until main document is loaded
window.addEventListener("load",function(){
	//start dynamic loading
	Modernizr.load([{
		//load all libraries and scripts
		load: ["http://code.jquery.com/jquery-2.0.0.min.js","scripts/icanhaz.js","scripts/jquery.xdomainajax.js","scripts/polictus.js","scripts/main.js"],

		//called when all files have finished loading and executing
		complete: function(){
			//run init
			app.main.init();

			// analytics
			// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			// (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			// m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			// })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			// ga('create', 'UA-40919126-1', 'polict.us');
			// ga('send', 'pageview');
		}
	}
	]); //end Modernizer.load
}); //end addEventListener