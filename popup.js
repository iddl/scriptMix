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

	var displaySummary = function(status){
		$summary.text(status.text);
	},

	displayContent = function(data) {
		// clear old links
		$content.html('');

		// add links
		for (var i = 0; i < data.length; i++) {
			var url = data[i].url;

			// prepare link content
			var content = {
				name : url.length > maxLen ? truncateMiddle(url, maxLen) : url,
				href : url,
				icon : scriptMix.requestTypes[data[i].type].icon
			}
			
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

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {

	contentDisplay.initialize();

	chrome.tabs.query({'active': true}, function(tabs) {
		scriptMix.getUnsafeContent(tabs[0].id, function(data){
			contentDisplay.displayPopup(data);
  		});
  	});
});
