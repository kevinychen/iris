getCurrentRequest(function(currReq) {
    var service = $.url(currReq.tab.url).attr('host');

    function fillInfo() {
        $('#requested_info').html('');
        for (var request_type in currReq.args) {
            var attributes = currReq.args[request_type];
            for (var i = 0; i < attributes.length; i++) {
                var attr = attributes[i];
                var text = attr + ' (' + request_type + ')';
                if (localCache.decrypted && localCache.decrypted[attr]) {
                    text += ': ' + localCache.decrypted[attr];
                }
                var el = $('<li>').text(text);
                $('#requested_info').append(el);
            }
        }
    }

    $('#requester').text(service);
    fillInfo();
    if (localCache.encrypted) {
        $('#userID').val(localCache.encrypted.userId);
        $('#password').focus();
    }

    $('#userID').change(function() {
        retrieveEncrypted($('#userID').val(), function() {});
    });
    $('#password').on('input', function() {
        var decrypted = decrypt($('#password').val(), localCache.encrypted);
        if (decrypted) {
            fillInfo();
            $('#form').find(':submit').show();
        }
    });

    document.getElementById('form').onsubmit = function(e) {
        e.preventDefault(); // Prevent submission

        retrieveEncrypted($('#userID').val(), function(encrypted) {
            if (encrypted) {
                var decrypted = decrypt($('#password').val(), encrypted);
                if (decrypted) {
                    var info = filterInfo(decrypted, service, currReq.args);
                    chrome.tabs.sendMessage(currReq.tab.id, info);
                    currReq.sent = true;
                    window.close();
                }
            }
        });
    };

    $('#status').show();
});

$('#register').on('click', function() {
    window.location.href = myURL('register.html');
});

$('#userID').focus();
