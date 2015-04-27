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
    $('#lastName').val(info.lastName);
    $('#email').val(info.email);
    $('#dob').val(info.dob);
    $('#submit').on('click', function() {
        console.log('save');
    });
    $('#profile').show();
});
chrome.runtime.sendMessage(['firstName', 'lastName', 'email', 'dob']);
