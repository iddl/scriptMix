/*
File: contentScriptHttp.js

Description:
    Content script behavior for Http pages

Authors:
    Ivan DiLernia <ivan@idilernia.com>
*/


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.command === "getUnsafeContent"){
    	sendResponse({content : []});
    }
});