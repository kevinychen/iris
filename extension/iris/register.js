getCurrentRequest(function(currReq) {
    var service = $.url(currReq.tab.url).attr('host');

    document.getElementById('form').onsubmit = function(e) {
        e.preventDefault(); // Prevent submission

        $(':input').attr('disabled', 'disabled');
        $('#submit').val('loading...');
        var userID = $('#userID').val();
        var pass = $('#password').val();
        var postInfo = {};
        $('#info').find(':input').each(function(i, el) {
            var attr = $(el).attr('id');
            postInfo[attr] = $(el).val();
        });
        register(userID, pass, postInfo, function() {
            retrieveEncrypted(userID, function(encrypted) {
                if (encrypted) {
                    var decrypted = decrypt(pass, encrypted);
                    if (decrypted) {
                        var info = filterInfo(decrypted, service, currReq.args);
                        chrome.tabs.sendMessage(currReq.tab.id, info);
                        currReq.sent = true;
                        window.close();
                    }
                }
            });
        });
    };
});

