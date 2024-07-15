import countWords from '../utils/wordsCounter';

chrome.runtime.onMessage.addListener(
    function calculateContentStat(msg, sender, sendResponse){

        if (msg.startsWith("TabIdReceived")) {
            
            console.log("Content script - removeListener");
            chrome.runtime.onMessage.removeListener(calculateContentStat);
            
            try {
                const tabId = msg.slice(14, 10);
                const tabUrl = msg.slice(25);

                console.log("Content script - onMessage event received for tab " + tabUrl);
        
                chrome.storage.local.get(["tab_url"], function(result) {
        
                    if (result.tab_url !== tabUrl) { // For some reason, tabs activations are sent 3 times... we avoid redundant recalculations by remembering the most recent URL we calculated.
        
                        const pageText = document.body.innerText;
        
                        console.log("Content script - ReCalaculating stat");
                        const stat = countWords(pageText);

                        const uniquePart = msg.slice(14);
                        const key = "my_page_stat-" + uniquePart;

                        chrome.storage.local.set({ [key]: stat, "tab_url": tabUrl, "tab_id": tabId }, function() {

                            console.log("Content script - Results has been set to.. " + key);
                            
                            var response = chrome.runtime.sendMessage("PageStatReady-" + uniquePart, (response) => {

                                console.log("Content script - PageStatReady message sent! " + response);
                            });
                            
                            //sendResponse(stat);
                        });
                        
                        
                    } else {
                        
                        console.log("Content script - Redundant call - skipped!");
                    }
                });
            } catch (error) {
            }

            console.log("Content script - sendResponse(true)");
            sendResponse(true);
        }
        return true;
    }
);