chrome.runtime.onMessage.addListener(function(info, sender) {
    if (sender.url) {
        return;  // only accept message from main.js
    }
    if (info.error) {
        console.log('error');
        return;
    }
    $('#user').val(info.userId);
    $('#firstName').val(info.firstName);
    $('#middleName').val(info.middleName);
    $('#lastName').val(info.lastName);
    $('#email').val(info.email);
    $('#dob').val(info.dob);
    $('#homePhone').val(info.homePhone);
    $(':input').on('input', function() {
        if (!$('#save').is(':visible')) {
            $('#save').slideDown();
        }
    });
    $('#save').on('click', function() {
        $('#save').slideUp();
        $.post(SERVER + $('#user').val(), {
            middle_name: $('#middleName').val(),
            home_phone: $('#homePhone').val(),
        });
    });
    $('#profile').show();
});
chrome.runtime.sendMessage([
        'firstName',
        'middleName',
        'lastName',
        'email',
        'dob',
        'homePhone',
        ]);
