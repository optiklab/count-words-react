//import countWords from './wordsCounter';
//import countWords from './wordsCounter';
// import { countWords } from './wordsCounter';

const title = chrome.runtime.getManifest().name;

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

function setupContextMenu() {
  chrome.contextMenus.create({
      id: 'page-stat',
      title: title,
      contexts: ['selection']
  });
}

async function pushToStorage(stat : string) {

    //sessionStorage.setItem("my_page_stat", stat);
  
    alert(stat);
}
  
chrome.contextMenus.onClicked.addListener((data, tab) => {
  
    console.log("From background addListener contextMenu onClicked");

    const text = data.selectionText;

    //countWords(text!);
  
    const words = text!.split(/\s+/);
  
    const wordsMap = new Map();
  
    words?.forEach((value: string) => {
        const clearValue = value.replace(/[^a-zA-Z]/g, "").trim();
    
        if (clearValue !== null && clearValue.length !== 0) {
            if (wordsMap.has(clearValue)) {
                const counter = wordsMap.get(clearValue);
                wordsMap.set(clearValue, counter + 1);
            } else {
                wordsMap.set(clearValue, 1);
            }
        }
    })
    
    const arr = [];
    for (const [key, value] of wordsMap) {
        arr.push({
          name: key,
          value: value
        });
    }
  
    const sortedWords = arr.sort(function(a, b) {
      return (a.value > b.value) ? -1 : ((a.value < b.value) ? 1 : 0)
    });
  

    const wordCount = words.length;
    
    let totalLength = 0;
    let maxLength = 0;

    for (let i = 0; i < wordCount; i++) {
        const curLength = words[i].replace(/[^a-zA-Z ]/g, "").length;
        totalLength += curLength;
        if (curLength > maxLength) {
            maxLength = curLength;
        }
    }

    const avgLength = wordCount === 0
        ? 0
        : totalLength / wordCount;
  
    const numAverageDigits = 2;
  
    let stat = `Stat on selected text:
  Word Count: ${wordCount}
  Character Count: ${text!.length}
  Average Word Length: ${avgLength.toFixed(numAverageDigits)}
  Longest Word Length: ${maxLength}
  Twenty most frequent:
    `;
    
    let counter = 0;
    for (const item of sortedWords) {
        stat += item.name + ' (' + item.value + ' times)\r\n';
        if (counter > 20) {
            break;
        }
        counter++;
    }
  
    //chrome.storage.local.get(["my_page_stat"], function(result) {
    //  alert(result.value);
    //});

    chrome.scripting.executeScript({
      target: { tabId: tab!.id! },
      func : pushToStorage,
      args : [ stat ]
    });
    
  });
  
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    console.log(msg);
    console.log(sender);
    sendResponse("From background script!");

    //chrome.storage.local.get(["my_page_stat"], function(result) {

    //  alert(result.value);

    //});
});
