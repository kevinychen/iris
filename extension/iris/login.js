// http://stackoverflow.com/questions/10340481/popup-window-in-chrome-extension
function sendCredentials() {
    var userID = document.getElementById('user').value;
    var password = document.getElementById('pass').value;
    chrome.runtime.sendMessage({
        user: userID,
        pass: password
    }, function() {
        window.close();
    });
}

chrome.tabs.getCurrent(function(myTab) {
    var backgroundPage = chrome.extension.getBackgroundPage();
    var currentRequest = backgroundPage.openRequests[myTab.id];

    if (currentRequest) {
        $('#requester').text($.url(currentRequest.tab.url).attr('host'));
        for (var key in currentRequest.args) {
            var el = $('<li>').text(currentRequest.args[key]);
            $('#requested_info').append(el);
        }
        $('#status').show();
    } else {
        $('#profile').show();
    }

    document.getElementById('form').onsubmit = function(e) {
        e.preventDefault(); // Prevent submission

        if (currentRequest) {
            sendCredentials();
        } else {
            // Open profile page
            chrome.tabs.create({
                url: chrome.extension.getURL('profile.html'),
                active: false
            }, function(newTab) {
                backgroundPage.openRequests[myTab.id] = {
                    args: ['*'],
                    tab: newTab
                };
                sendCredentials();
            });
        }
    };
});

$('#user').focus();
