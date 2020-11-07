// Convenience funcs that selenium can call

// keyName must match content.js
var keyName = "all_requests_unique_key"

function attach_debugger(){
	console.log("Raising Event");
	let data = {message: 'attach'};
	let event = new CustomEvent('to-background', {detail: data});
	document.dispatchEvent(event);
};

function detach_debugger(){
	console.log("Raising Event");
	let data = {message: 'detach'};
	let event = new CustomEvent('to-background', {detail: data});
	document.dispatchEvent(event);
};

function update_requests() {
   console.log("Raising Event");
   let data = {message: 'get_requests'}
   let event = new CustomEvent('to-background', {detail: data});
   document.dispatchEvent(event);
};

function read_requests() {
	return localStorage.getItem(keyName);
};

function clear_requests() {
	localStorage.removeItem(keyName)
};

//Clean up so you cant see the script tag after execution
document.getElementById("delete_me").remove();