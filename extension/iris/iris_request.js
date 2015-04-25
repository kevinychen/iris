/*
 * Content script for Iris extension
 */

// Define Javascript function for websites
function iris_request(args, callback) {
    var requestDiv = document.getElementById('iris_request_div');

    var requestEvent = document.createEvent('Event');
    requestEvent.initEvent('iris_request_event', true, true);

    requestDiv.addEventListener('iris_response_event', function() {
        var response = JSON.parse(requestDiv.innerText);
        callback(response);
    });

    requestDiv.innerText = JSON.stringify(args);
    requestDiv.dispatchEvent(requestEvent);
};

// Insert message passing divs
// http://stackoverflow.com/questions/11431337/sending-message-to-chrome-extension-from-a-web-page
var requestDiv = document.createElement('div');
requestDiv.id = 'iris_request_div';
requestDiv.style.display = 'none';

requestDiv.addEventListener('iris_request_event', function() {
    var args = JSON.parse(requestDiv.innerText);

    chrome.runtime.sendMessage(args, function(response) {
        var responseEvent = document.createEvent('Event');
        responseEvent.initEvent('iris_response_event', true, true);

        requestDiv.innerText = JSON.stringify(response);
        requestDiv.dispatchEvent(responseEvent);
    });
});
document.documentElement.appendChild(requestDiv);

// Insert iris_request() function into page.
var script = document.createElement('script');
script.textContent = iris_request.toString();
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);
