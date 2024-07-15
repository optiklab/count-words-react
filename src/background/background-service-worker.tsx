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

chrome.tabs.onActivated.addListener(cleanStorage);

async function cleanStorage(activeInfo: chrome.tabs.TabActiveInfo) {
  try {
    console.log("Background script - cleanStorage!");
    chrome.storage.local.get(["tab_id"], function(result) {
      if (result.tab_url !== activeInfo.tabId) {
        chrome.storage.local.set({ "my_page_stat": null, "tab_url": null, "tab_id": null }, function() {
          console.log("Background script - new tab activated, clean up things first!");
        });
      }
    });

  } catch (error) {
  }
}

async function pushToStorage(stat : string) {

    //sessionStorage.setItem("my_page_stat", stat);
  
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

  /*
  const hash = calculateHashOnSelection(text);
  chrome.storage.local.set({ "my_page_stat": stat, "tab_url": null, "selection_hash": hash }, function() {

      // Popup script now can GRAB last selection value... if we want to show it in popup.

  });
  */

  
  /*
  chrome.scripting.executeScript({
    target: { tabId: tab!.id! },
    func : pushToStorage,
    args : [ stat ]
  });
  */
  
});
