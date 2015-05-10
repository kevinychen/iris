const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 400;
const SERVER = 'https://simple.mit.edu:8107/api/users/';

localCache = chrome.extension.getBackgroundPage().localCache;

function retrieveEncrypted(userID, callback) {
    if (localCache.encrypted && localCache.encrypted.userId == userID) {
        return callback(localCache.encrypted);
    }
    $.get(SERVER + userID, function(data) {
        localCache.encrypted = data;
        localCache.decrypted = undefined;
        callback(data);
    });
}

function decrypt(password, encrypted) {
    if (localCache.decrypted && localCache.encrypted === encrypted &&
            password === '') {
        return localCache.decrypted;
    }
    try {
        localCache.decrypted = JSON.parse(sjcl.decrypt(
                    password, encrypted.encryptionParams));
        return localCache.decrypted;
    } catch (err) {
        return undefined;  // wrong password
    }
}

function update(userID, password, decrypted) {
    var encrypted_data = sjcl.encrypt(password, JSON.stringify(decrypted));
    var post_params = {
        encryption_params: encrypted_data,
        data: '-',
        signature: 0,  // TODO return encrypted_data^d
    };
    $.post(SERVER + userID, post_params);
}

function register(userID, password, decrypted, callback) {
    // TODO generate random params
    var rsa_params = {n: "391", e: "5", d: "141"};
    decrypted.auth_key = rsa_params.d;

    var encrypted_data = sjcl.encrypt(password, JSON.stringify(decrypted));
    var put_params = {
        user_id: userID,
        auth: {e: rsa_params.e, n: rsa_params.n},
        encryption_params: encrypted_data,
        data: '-',
    };
    $.ajax({
        url: SERVER,
        type: 'PUT',
        data: put_params,
        success: function(res) {
            callback();
        }
    });
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
    info.services = undefined;
    info.auth_key = undefined;
    info.signature = 0;  // TODO return decrypted^d
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

