// http://stackoverflow.com/questions/10340481/popup-window-in-chrome-extension
profile_login = false;

document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var userID = document.getElementById('user').value;
    var password = document.getElementById('pass').value;
    chrome.runtime.sendMessage({
        user: userID,
        pass: password
    }, function() {
        if (!profile_login) {
            window.close();
        }
    });
};

chrome.tabs.getCurrent(function(tab) {
    var backgroundPage = chrome.extension.getBackgroundPage();
    var currentRequest = backgroundPage.openRequests[tab.id];
    profile_login = !currentRequest;
    if (profile_login) {
        backgroundPage.openRequests[tab.id] = {
            args: ['*'],
            url: 'iris/login.html',
            sendResponse: function(info) {
                window.location.href = chrome.extension.getURL('profile.html');
            }
        };
        $('#profile').show();
    } else {
        $('#requester').text($.url(currentRequest.url).attr('host'));
        for (var key in currentRequest.args) {
            var el = $('<li>').text(currentRequest.args[key]);
            $('#requested_info').append(el);
        }
        $('#status').show();
    }
});

$('#user').focus();
