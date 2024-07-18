import { ResultsData } from '../models/resultsData'
import XRegExp from 'xregexp';

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
    //console.log("Background script - cleanStorage!");
    chrome.storage.local.get(["tab_id"], function(result) {
      if (result.tab_url !== activeInfo.tabId) {
        chrome.storage.local.set({ "my_page_stat": null, "tab_url": null, "tab_id": null, "selection_stat": null }, function() {
          //console.log("Background script - new tab activated, clean up things first!");
        });
      }
    });

  } catch (error) {
  }
}

function pushToScreen(input : ResultsData) {

    let stat = `Stat on selected text:
    Word Count: ${input.statistics.wordCount}
    Character Count: ${input.statistics.characterCount}
    Average Word Length: ${input.statistics.averageWordLength.toFixed(input.statistics.numAverageDigits)}
    Longest Word Length: ${input.statistics.longestWordLength}
    ${input.statistics.mostFrequentNumber} most frequent:
      `;

    for (const item of input.mostFrequentsCaseInsensitive) {
        stat += item.word + ' (' + item.count + ' times)\r\n';
    }

    alert(stat);
}
  
chrome.contextMenus.onClicked.addListener((data, tab) => {
  
  //console.log("Background script - ContextMenu onClicked");

  const text = data.selectionText;
  
  const words = text!.split(/\s+/);

  const wordsMap = new Map();

  words?.forEach((value: string) => {
    var regex = XRegExp("[^\\s\\p{Latin}\\p{Cyrillic}]", "g");
    const clearValue = XRegExp.replace(value, regex, "").trim();
    //const clearValue = value.replace(/[^a-zA-Z]/g, "").trim(); // Only English
  
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

  const results: ResultsData = {
    statistics: {
        wordCount: words.length,
        characterCount: text!.length,
        averageWordLength: avgLength,
        numAverageDigits: 2,
        longestWordLength: maxLength,
        mostFrequentNumber: 20
    },
    mostFrequentsCaseInsensitive: [],
    mostFrequentsCaseSensitive: []
  };

  const sortedWords = arr.sort(function (a, b) {
    return (a.value > b.value) ? -1 : ((a.value < b.value) ? 1 : 0)
  });

  let counter = 0;
  for (const item of sortedWords) {
    results.mostFrequentsCaseInsensitive.push({
            count: item.value,
            word: item.name
        }
    );
    if (counter > results.statistics.mostFrequentNumber) {
        break;
    }
    counter++;
  }
     
  chrome.storage.local.set({ "selection_stat": results }, function() {

  });

  chrome.scripting.executeScript({
    target: { tabId: tab!.id! },
    func : pushToScreen,
    args : [ results ]
  });
});
