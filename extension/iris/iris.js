/*
 * Javascript on background page of Iris extension
 */

// mapping from tab id to sendResponse functions
prevSendResponses = {};

// args is a list of attributes that the website wants
//   e.g. ['name', 'email', 'phone number']
// sends a dictionary with the attribute keys
//   e.g. {name: 'Kevin', email: 'kyc@mit.edu', 'phone number': '123-456'}
chrome.runtime.onMessage.addListener(function(args, sender, sendResponse) {
    // Check if this tab is one of our popups
    var prevSendResponse = prevSendResponses[sender.tab.id];
    if (prevSendResponse) {
        // TODO use password to encrypt info
        prevSendResponse({name: 'Kevin'});
        prevSendResponses[sender.tab.id] = undefined;
        sendResponse();
        return;
    }

    // Otherwise, create a new popup
    chrome.tabs.create({
        url: chrome.extension.getURL('iris.html'),
        active: false
    }, function(tab) {
        prevSendResponses[tab.id] = sendResponse;
        chrome.windows.create({
            tabId: tab.id,
            type: 'popup',
            focused: true
        });
    });
    return true;  // asynchronous sendMessage
});

// Remove closed popup tabs from prevSendResponses
chrome.tabs.onRemoved.addListener(function(tabId, info) {
    var prevSendResponse = prevSendResponses[tabId];
    if (prevSendResponse) {
        prevSendResponse({error: 'User closed window.'});
        prevSendResponses[tabId] = undefined;
    }
});
