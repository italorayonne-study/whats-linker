chrome.runtime.onInstalled.addListener(() => {
    console.log('link-gen extension installed');
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { })