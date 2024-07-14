import countWords from '../utils/wordsCounter';

chrome.runtime.onMessage.addListener( (msg, sender, sendResponse) => {
    
    if (msg.startsWith("TabIdReceived")) {

        const tabUrl = msg.slice(14);
        
        console.log("From content script onMessage: " + tabUrl);

        chrome.storage.local.get(["tab_url"], function(result) {

            if (result.tab_url !== tabUrl) { // For some reason, tabs activations are sent 3 times... we avoid redundant recalculations by remembering the most recent URL we calculated.

                const pageText = document.body.innerText;

                const stat = countWords(pageText);
        
                chrome.storage.local.set({ "my_page_stat": stat, "tab_url": tabUrl }, function() {
                    console.log("RECalaculated from content script!");
                       
                    sendResponse(stat);
                    
                    chrome.runtime.sendMessage("PageStatReady", (response) => {
                        //console.log(response);
                      });
                });
                
            } else {
                
                console.log("Redundant content script call - skipped!");
            }
        });

/*
        const pageText = document.body.innerText;

        const stat = countWords(pageText);

        chrome.storage.local.set({ "my_page_stat": stat, "tab_url": msg.slice(14) }, function() {
            console.log("RECalaculated from content script!");
               
            sendResponse(stat);
           // chrome.runtime.sendMessage("PageStatReady", (response) => {
                //console.log(response);
            //  });
        });
        */
        //sendResponse(stat);
    }
  });