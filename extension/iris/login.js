getState(function(myTab, openRequests, currReq) {
    if (currReq.tab.url == myURL('profile.html')) {
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

        retrieveInfo({
            user: $('#user').val(),
            pass: $('#pass').val()
        }, currReq.args, function(info) {
            chrome.tabs.sendMessage(currReq.tab.id, info);
            openRequests[myTab.id] = undefined;
            window.close();
        });
    };
});

$('#register').on('click', function() {
    window.location.href = myURL('register.html');
});

$('#user').focus();
