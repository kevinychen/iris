const SERVER = 'https://simple.mit.edu:8107/api/users/';

/*
 * loginData is a dictionary of user credentials
 *   e.g. {user: 'Kevin', pass: 'secret'}
 * args is a list of attributes that the website wants
 *   e.g. ['name', 'email', 'phone number']
 * sends a dictionary with the attribute keys
 *   e.g. {name: 'Kevin', email: 'kyc@mit.edu', 'phone number': '123-456'}
 */
function retrieveInfo(loginData, args, callback) {
    $.get(SERVER + loginData.user, function(res) {
        var info = {userId: res.userId};
        for (var key in args) {
            info[args[key]] = res[args[key]];
        }
        callback(info);
    });
}

function getState(callback) {
    chrome.tabs.getCurrent(function(myTab) {
        var backgroundPage = chrome.extension.getBackgroundPage();
        var currReq = backgroundPage.openRequests[myTab.id];
        callback(myTab, backgroundPage.openRequests, currReq);
    });
}

function myURL(page) {
    return chrome.extension.getURL(page);
}

