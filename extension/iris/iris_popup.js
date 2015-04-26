// http://stackoverflow.com/questions/10340481/popup-window-in-chrome-extension
document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var userID = document.getElementById('user').value;
    var password = document.getElementById('pass').value;
    chrome.runtime.sendMessage({
        user: userID,
        pass: password
    }, function() {
        window.close();
    });
};
