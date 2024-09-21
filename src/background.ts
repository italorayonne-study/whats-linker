chrome.runtime.onInstalled.addListener(() => {
    console.log('link-gen extension installed');
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request, sender)


    if (request.action === 'openPopup') chrome.action.openPopup();
})