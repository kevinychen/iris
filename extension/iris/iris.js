/*
 * Javascript on background page of Iris extension
 */

// args is a list of attributes that the website wants
//   e.g. ['name', 'email', 'phone number']
// sends a dictionary with the attribute keys
//   e.g. {name: 'Kevin', email: 'kyc@mit.edu', 'phone number': '123-456'}
chrome.runtime.onMessage.addListener(function(args, sender, sendResponse) {
    // TODO
    sendResponse({name: 'Kevin', email: 'kyc@mit.edu', 'phone number': '123-456'});
});
