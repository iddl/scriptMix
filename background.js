var scriptMix = function(){

	/*
	*	Extension icons
	*/
	var statuses = {
		0 : {
			icon : "images/good.png"
		},
		1 : {
			icon : "images/warning.png"
		},
		2 : {
			icon : "images/bad.png"
		}
	},

	/*
	*	Indicates severity of each non-HTTPS objects retrieved using non-HTTPS
	*	Eg. downloading an image is less severe than downloading a JS script using
	*	non HTTPS connection.
	*/
	unsafeObjectSeverity = {
		"main_frame" : 1,
		"sub_frame" : 1,
		"stylesheet" : 1,
		"image" : 1,
		"object" : 1,
		"xmlhttprequest" : 1,
		"script" : 2,
		"other" : 1
	},

	/*
	*	Analyzes non-HTTPS traffic and deter
	*/
	analyzeContent = function(content){
		var maxSeverity = 0;
		for(var i=0; i<content.length; i++){
			var severity = unsafeObjectSeverity[content[i].type];
			if(severity > maxSeverity) {
				maxSeverity = severity;
			}
		}
		return maxSeverity;
	},

	/*
	*	Retrieves content that was downloaded using a non-HTTPS connection
	*/
	getUnsafeContent = function(tab,callback){
		chrome.tabs.sendMessage(tab, {greeting: "getUnsafeContent"}, function(response) {
			if(response !== undefined) {
				return callback(response.content);
			}
		});
	},

	/*
	*	Notifies a tab that content was downloaded using a non-HTTPS connection
	*/
	addUnsafeContent = function(tab, content){
		chrome.tabs.sendMessage(tab, {greeting: "addUnsafeContent", content : content});
	},

	/*
	*	Refresh indicator status based on current tab
	*/
	refreshStatus = function(){
		chrome.tabs.query({'active': true}, function(tabs) {
			getUnsafeContent(tabs[0].id, function(data){
				setStatus(analyzeContent(data))
			});
		});
	},

	/*
	*	Sets the status icon
	*/
	setStatus = function(status){
		chrome.browserAction.setIcon({path : statuses[status].icon });
	};

	return {
		addUnsafeContent : addUnsafeContent,
		refreshStatus : refreshStatus
	}

}();

/*
*	onBeforeRequest event handler
*/
onHttpRequest = function(details){
 
	function checkUrl(data){
		if(data === undefined) return;
		if(data.url.substring(0,5) === 'https'){
			scriptMix.addUnsafeContent(details.tabId, details);
		}
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