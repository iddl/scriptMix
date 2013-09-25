var unsafeContent = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting === "addUnsafeContent") {
    	unsafeContent.push(request.content);
    } else if ( request.greeting === "getUnsafeContent"){
    	sendResponse({content : unsafeContent});
    } else {

    }
});