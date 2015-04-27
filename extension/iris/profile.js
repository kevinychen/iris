chrome.runtime.onMessage.addListener(function(info, sender) {
    if (info.error) {
        console.log('error');
        return;
    }
    $('#info').text(JSON.stringify(info));
});
