/*
File: contentScriptHttp.js

Description:
    Content script behavior for Https pages

Authors:
    Ivan DiLernia <ivan@idilernia.com>
*/


var unsafeContent = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command === "addUnsafeContent") {
    	unsafeContent.push(request.content);
    } else if ( request.command === "getUnsafeContent"){
    	sendResponse({content : unsafeContent});
    } else {

    }
});