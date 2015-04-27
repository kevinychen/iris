getState(function(myTab, openRequests, currReq) {
    document.getElementById('form').onsubmit = function(e) {
        e.preventDefault(); // Prevent submission

        $(':input').attr('disabled', 'disabled');
        $('#submit').val('loading...');
        var fullInfo = {
            user_id: $('#user').val(),
            first_name: $('#firstName').val(),
            middle_name: $('#middleName').val(),
            last_name: $('#lastName').val(),
            email: $('#email').val(),
            dob: $('#dob').val(),
            home_phone: $('#homePhone').val(),
        };
        $.ajax({
            url: SERVER,
            type: 'PUT',
            data: fullInfo,
            success: function(res) {
                retrieveInfo({
                    user: $('#user').val(),
                    pass: $('#password').val()
                }, currReq.args, function(info) {
                    chrome.tabs.sendMessage(currReq.tab.id, info);
                    openRequests[myTab.id] = undefined;
                    window.close();
                });
            }
        });
    };
});

