import * as React from 'react'
import { useState, useEffect } from 'react'
import { render } from 'react-dom'
import './popup.css'
//import countWords from './wordsCounter';

const App: React.FC<{}> = () => {

  const [wordStat, setWordStat] = useState<string>('123');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    var currentTab = tabs[0];

    //chrome.tabs.sendMessage(currentTab!.id!, "TabIdReceived");

    // Communicate with a Content Script of This Exact Tab.
    var response = chrome.tabs.sendMessage(currentTab!.id!, "TabIdReceived" + currentTab!.url!); 
    response.then(setWordStat);
  });

/*

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    var currentTab = tabs[0];

    chrome.tabs.sendMessage(currentTab!.id!, "TabIdReceived");
  });

  chrome.runtime.onMessage.addListener( (msg, sender, sendResponse) => {
    if (msg === "PageStatReady") {
        chrome.storage.local.get(["my_page_stat"], function(result) {

          console.log("From popup onMessage after getting value from storage!");

          alert(result.my_page_stat);
        });
    }
  });
  */

  const onclick = async () => {
    
    console.log("Called onclick script from popup!");

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true  });

    chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => {

          chrome.storage.local.get(["my_page_stat"], function(result) {

            alert(result.my_page_stat);
          });
        }
    });
  }

  return (
    <div>
      <h3>Count words</h3>
      <img src="../images/icon128.png" />
      <div className="card">
        <button onClick={() => onclick() }>
          Count stat
        </button>
      </div>
      <div>
        {wordStat}
      </div>
      <p className="read-the-docs">
        Enjoyed? Learn more...
      </p>
      <a
          className="App-link"
          href="https://optiklab.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >OptikLab (C) 2024</a>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)

export default App;