/*
File: background.js

Description:
    Background routines and request listener code.

Authors:
    Ivan DiLernia <ivan@idilernia.com>
*/

/*
*	onBeforeRequest event handler
*/
onHttpRequest = function(details){

	function checkUrl(data){
		console.log(details.url);
		if(data === undefined) return;
		scriptMix.addUnsafeContent(details.tabId, details);
	}

	chrome.tabs.get(details.tabId, checkUrl);
};

/*
*	Hooking up webRequest event handler
*/
var filter = {
	urls : ["http://*/*"]
};
var opt_extraInfoSpec = [];
chrome.webRequest.onBeforeRequest.addListener( onHttpRequest, filter);

/*
*	Check for unsafe content when page finished loading
*/
chrome.tabs.onUpdated.addListener(function( tabId , info ) {
    if( info.status == "complete"){
    	chrome.tabs.query({'active': true}, function(tabs) {
			if(tabs[0].id == tabId){
				setTimeout(scriptMix.refreshStatus,100);
			}
		});
    } 
});

/*
*	Check for unsafe content at defined intervals
*	Temporary code. Useful for getting unsafe AJAX requests after page load.
*/
setInterval(function(){
	scriptMix.refreshStatus();
}, 2000);

/*
*	Update indicator on tab switch
*/
chrome.tabs.onActivated.addListener(function( tabId , info ) {
	scriptMix.refreshStatus();
});