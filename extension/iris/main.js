/*
 * Javascript on background page of Iris extension
 */

// mapping from Iris websites to login request info
openRequests = {};

// loginData is a dictionary of user credentials
//   e.g. {user: 'Kevin', pass: 'secret'}
// args is a list of attributes that the website wants
//   e.g. ['name', 'email', 'phone number']
// sends a dictionary with the attribute keys
//   e.g. {name: 'Kevin', email: 'kyc@mit.edu', 'phone number': '123-456'}
function retrieveInfo(loginData, args, callback) {
    // TODO currently hardcoded
    if (loginData.user === 'Kevin') {
        callback({name: 'Kevin', email: 'kyc@mit.edu'});
    } else {
        callback({name: 'guest', email: 'idunno@gmail.com'});
    }
}

chrome.runtime.onMessage.addListener(function(args, sender, sendResponse) {
    // Check if this tab is one of our popups
    var openRequest = openRequests[sender.tab.id];
    if (openRequest) {
        var credentials = args;
        retrieveInfo(credentials, openRequest.args, function(info) {
            chrome.tabs.sendMessage(openRequest.tab.id, info, function(response) {});
            openRequests[sender.tab.id] = undefined;
            sendResponse();
        });
        return;
    }

    // Otherwise, create a new popup and store this website's info
    chrome.tabs.create({
        url: chrome.extension.getURL('login.html'),
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
        url: chrome.extension.getURL('login.html'),
        active: true
    });
});
