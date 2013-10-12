/*
File: contentScriptHttp.js

Description:
    Popup display code

Authors:
    Ivan DiLernia <ivan@idilernia.com>
*/


var contentDisplay = function(){

	var maxLen = 45,
	$summary, $content;

	/*
	*	Displays summary in popup
	*/
	var displaySummary = function(status){
		$summary.html(Mustache.render($('#summary-template').html(), status));
	},

	/*
	*	Displays links downloaded using a non-HTTPS connection
	*/
	displayContent = function(data) {
		// clear old links
		$content.html('');

		// add links
		for (var i = 0; i < data.length; i++) {
			var url = data[i].url;

			// template object
			var content = {
				name : url.length > maxLen ? truncateMiddle(url, maxLen) : url,
				href : url,
				icon : scriptMix.requestTypes[data[i].type].icon
			}
			
			// render template
			var html = Mustache.render($('#content-template').html(), content);

			$(html).appendTo($content).click(function(){
				chrome.tabs.create({url: $(this).attr('href')});
				return false;
			});
		}

	},

	displayPopup = function(data){
		var status = scriptMix.analyzeContent(data);
		displaySummary(status);
		displayContent(data);
	};

	initialize = function(){
		$summary = $('#summary');
		$content = $('#content-links');
	}

	return {
		displayPopup : displayPopup,
		initialize : initialize
	}

}();

// Run script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {

	contentDisplay.initialize();

	chrome.tabs.query({'active': true}, function(tabs) {
		scriptMix.getUnsafeContent(tabs[0].id, function(data){
			contentDisplay.displayPopup(data);
  		});
  	});
});
