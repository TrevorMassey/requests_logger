// keyName must match patch.js
var keyName = "all_requests_unique_key"

document.addEventListener('to-background', function(event){
    console.log('Routing message to background.js')
    console.table(event.detail)
    chrome.runtime.sendMessage(event.detail, function(response){
		console.log("Response received");
		console.table(response);
		if (response.requests){
			localStorage.setItem(keyName, JSON.stringify(response.requests));
		}
	});
})

var s1 = document.createElement('script');
s1.src = chrome.runtime.getURL('patch.js');
s1.id = 'delete_me';
elem = (document.head || document.documentElement).appendChild(s1);
console.log("Added Scripts");
