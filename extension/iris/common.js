const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 400;

localCache = chrome.extension.getBackgroundPage().localCache;
mockData = chrome.extension.getBackgroundPage().mockData;

function retrieveEncrypted(userID, callback) {
    callback(mockData[userID]);
}

function decrypt(password, encrypted) {
    return encrypted;
}

function update(userID, password, decrypted) {
    mockData[userID] = decrypted;
}

function register(userID, password, decrypted, callback) {
    mockData[userID] = decrypted;
    callback();
}

function filterInfo(decrypted, service, request) {
    var info = {};
    for (var request_type in request) {
        var attributes = request[request_type];
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            if (decrypted.services && decrypted.services[service] &&
                    attr in decrypted.services[service]) {
                // info specific to service
                info[attr] = decrypted.services[service][attr];
            } else {
                info[attr] = decrypted[attr];
            }
        }
    }
    // ensure userID and nonce fields are correct
    info.userID = decrypted.userID;
    info.nonce = undefined;
    return info;
}

function getCurrentRequest(callback) {
    chrome.tabs.getCurrent(function(myTab) {
        var backgroundPage = chrome.extension.getBackgroundPage();
        callback(backgroundPage.openRequests[myTab.id]);
    });
}

function myURL(page) {
    return chrome.extension.getURL(page);
}

