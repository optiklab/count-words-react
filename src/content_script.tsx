const pageText = document.body.innerText;
chrome.runtime.sendMessage({ text: pageText });