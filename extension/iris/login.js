/*
 * loginData is a dictionary of user credentials
 *   e.g. {user: 'Kevin', pass: 'secret'}
 * args is a list of attributes that the website wants
 *   e.g. ['name', 'email', 'phone number']
 * sends a dictionary with the attribute keys
 *   e.g. {name: 'Kevin', email: 'kyc@mit.edu', 'phone number': '123-456'}
 */
function retrieveInfo(loginData, args, callback) {
    $.get("https://simple.mit.edu:8107/api/users/" + loginData.user, function(res) {
        var info = {userId: res.userId};
        for (var key in args) {
            info[args[key]] = res[args[key]];
        }
        callback(info);
    });
}

chrome.tabs.getCurrent(function(myTab) {
    var backgroundPage = chrome.extension.getBackgroundPage();
    var currReq = backgroundPage.openRequests[myTab.id];

    if (currReq.tab.url == chrome.extension.getURL('profile.html')) {
        $('#profile').show();
    } else {
        $('#requester').text($.url(currReq.tab.url).attr('host'));
        for (var key in currReq.args) {
            var el = $('<li>').text(currReq.args[key]);
            $('#requested_info').append(el);
        }
        $('#status').show();
    }

    document.getElementById('form').onsubmit = function(e) {
        e.preventDefault(); // Prevent submission

        var userID = document.getElementById('user').value;
        var password = document.getElementById('pass').value;
        retrieveInfo({
            user: userID,
            pass: password
        }, currReq.args, function(info) {
            chrome.tabs.sendMessage(currReq.tab.id, info);
            backgroundPage.openRequests[myTab.id] = undefined;
            window.close();
        });
    };
});

$('#user').focus();
