var scriptMix = function(){

	/*
	*	Statuses info.
	*	There are 3 statuses for now:
	*	1) all content downloaded
	*/
	var statuses = {
		0 : {
			icon : "images/good.png",
			text : "All content was downloaded safely."
		},
		1 : {
			icon : "images/warning.png",
			text : "Some content was loaded using a non-HTTPS connection."
		},
		2 : {
			icon : "images/bad.png",
			text : "Scripts were loaded using a non-HTTPS connection."
		}
	},

	/*
	*	Various info about types of requests.
	*	Eg. Severity: downloading an image is less severe than downloading 
	*	a JS script using non HTTPS connection.
	*/
	requestTypes = {
		"main_frame" : {
			severity : 1,
			icon : "icon-file-text-alt"
		},
		"sub_frame" : {
			severity : 1,
			icon : "icon-file-text-alt"
		},
		"stylesheet" : {
			severity : 1,
			icon : "icon-eye-open"
		},
		"image" : {
			severity : 1,
			icon : "icon-picture"
		},
		"object" : {
			severity : 1,
			icon : "icon-download"
		},
		"xmlhttprequest" : {
			severity : 1,
			icon : "icon-download"
		},
		"script" : {
			severity : 2,
			icon : "icon-cogs"
		},
		"other" : {
			severity : 1,
			icon : "icon-link"
		}
	},

	/*
	*	Analyzes non-HTTPS traffic and deter
	*/
	analyzeContent = function(content){
		var maxSeverity = 0;
		for(var i=0; i<content.length; i++){
			var severity = requestTypes[content[i].type].severity;
			if(severity > maxSeverity) {
				maxSeverity = severity;
			}
		}
		return statuses[maxSeverity];
	},

	/*
	*	Retrieves content that was downloaded using a non-HTTPS connection
	*/
	getUnsafeContent = function(tab, callback){
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
		chrome.browserAction.setIcon({path : status.icon });
	};

	return {
		addUnsafeContent : addUnsafeContent,
		getUnsafeContent : getUnsafeContent,
		analyzeContent : analyzeContent,
		refreshStatus : refreshStatus,
		requestTypes : requestTypes
	}

}();
