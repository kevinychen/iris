/*
 * Javascript on background page of Iris extension
 */

// mapping from Iris websites to login request info
openRequests = {};

chrome.runtime.onMessage.addListener(function(args, sender, sendResponse) {
    // Create a popup and store this website's info
    chrome.tabs.create({
        url: myURL('login.html'),
        active: false
    }, function(tab) {
        openRequests[tab.id] = {
            args: args,
            tab: sender.tab
        };
        chrome.windows.create({
            tabId: tab.id,
            type: 'popup',
            width: 500,
            height: 400,
            focused: true
        });
    });
});

// Remove closed popup tabs from prevSendResponses
chrome.tabs.onRemoved.addListener(function(tabId, info) {
    var openRequest = openRequests[tabId];
    if (openRequest) {
        chrome.tabs.sendMessage(openRequest.tab.id, {
            error: 'User closed window.'
        });
        openRequests[tabId] = undefined;
    }
});

// Browser action opens profile page
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({
        url: myURL('profile.html'),
        active: true
    });
});
