chrome.runtime.onInstalled.addListener(() => {
    console.log('link-gen extension installed');
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message: ', message, sender)
})