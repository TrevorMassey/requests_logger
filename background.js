/* NOTE: Try using this flag when starting chrome:
	--silent-debugger-extension-api
https://peter.sh/experiments/chromium-command-line-switches/
*/
var attachedTabs = {};
var allTabs = [];
var version = "1.0";
var requests = {}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Got Message: " + request.message);
		if (request.message == 'attach') {
            attachTab(sender.tab.id);
        } else if (request.message == 'detach') {
            detachTab(sender.tab.id);
        } else if (request.message = 'get_requests') {
			sendResponse({requests: requests});
		}
        return true;
    }
);

function attachTab(tabId) {
	if (attachedTabs[tabId]) {
		console.log("Already attached, skipping " + tab.id);
		return
	}
	let debuggee = {tabId: tabId}
	chrome.debugger.attach(
		debuggee, version, onAttach.bind(null, debuggee)
	)
};

function detachTab(tabId) {
	if (attachedTabs[tabId]) {
		console.log("Detatching from " + tabId);
		let debuggee = {tabId: tabId}
		chrome.debugger.detach(debuggee);
		delete attachedTabs[tabId];
	} else {
		console.log(tabId + " not in attachedTabs");
	}
};

function onAttach(debuggee) {
	let tabId = debuggee.tabId;
	console.table("in onAttach: " + tabId);
	attachedTabs[tabId] = true;
	chrome.debugger.sendCommand({tabId:tabId}, "Network.enable");
}

function onDetach(debuggee) {
	//Cleanup on even that is Fired if detatched from somewhere outside background.js
	let tabId = debuggee.tabId
	console.log("In onDetatch: " + tabId);
	delete attachedTabs[tabId];
}
chrome.debugger.onDetach.addListener(onDetach);


// Once we can listen to Network events, this is what we do with them.

function onEvent(source, method, params) {
	var requestId = params.requestId

	if (!(requestId in requests)) {
		requests[requestId] = {};
	}

	if (params.redirectResponse) {
		console.log("Got Redirect");
	} else if (method == "Network.responseReceived") {
		console.log("Trying to append Network.responseReceived");
		requests[requestId]['responseHeaders'] = params.response.headers;
		requests[requestId]['responseStatusCode'] = params.response.status;
		requests[requestId]['responseStatusText'] = params.response.statusText;
		requests[requestId]['responseEncodedDataLength'] = params.response.encodedDataLength;
		//console.table(requests[requestId]);
	} else if (method == "Network.requestWillBeSent") {
		console.log("Trying to append Network.requestWillBeSent");
		requests[requestId]['requestHeaders'] = params.request.headers;
		requests[requestId]['requestMethod'] = params.request.method;
		requests[requestId]['requestPostData'] = params.request.postData;
		requests[requestId]['requestUrl'] = params.request.url;
		requests[requestId]['requestTimestamp'] = params.timestamp;
		//console.table(requests[requestId]);
	} else {
		//console.log("ignoring " + method)
	}
}
chrome.debugger.onEvent.addListener(onEvent);