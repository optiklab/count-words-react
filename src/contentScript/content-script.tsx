import * as React from 'react'
import { render } from 'react-dom'
import { useState, useEffect } from 'react'
import { ResultsData } from '../models/resultsData'
import '@fontsource/roboto/300.css';
import ResultsDataCard from '../components/ResultsDataCard';
import countWords from '../utils/wordsCounter';
import './content-script.css'

chrome.runtime.onMessage.addListener(
    function calculateContentStat(msg, sender, sendResponse){

        if (msg.startsWith("TabIdReceived")) {
            
            //console.log("Content script - removeListener");
            chrome.runtime.onMessage.removeListener(calculateContentStat);
            
            try {
                const tabId = msg.slice(14, 10);
                const tabUrl = msg.slice(25);

                //console.log("Content script - onMessage event received for tab " + tabUrl);
        
                chrome.storage.local.get(["tab_url"], function(result) {
        
                    if (result.tab_url !== tabUrl) { // For some reason, tabs activations are sent 3 times... we avoid redundant recalculations by remembering the most recent URL we calculated.
        
                        const pageText = document.body.innerText;
        
                        //console.log("Content script - ReCalaculating stat");
                        const stat = countWords(pageText);

                        const uniquePart = msg.slice(14);
                        const key = "my_page_stat-" + uniquePart;

                        chrome.storage.local.set({ [key]: stat, "tab_url": tabUrl, "tab_id": tabId }, function() {

                            //console.log("Content script - Results has been set to.. " + key);
                            var response = chrome.runtime.sendMessage("PageStatReady-" + uniquePart, (response) => {
                              response = response || {};
                              if (!response.status) {
                                //console.log("Communication failed!"); // Usually, there is exception.
                              }
                            });
                        });
                        
                        
                    } else {
                        
                        //console.log("Content script - Redundant call - skipped!");
                    }
                });
            } catch (error) {
            }

            //console.log("Content script - sendResponse(true)");
            sendResponse({status: true});
        }
        return true;
    }
);

/*
const App: React.FC<{}> = () => {

    const [resultsData, setResultsData] = useState<ResultsData | null>(null);

    useEffect(() => {
      chrome.storage.local.get(["selection_stat"], 
        function(result) {
            //console.log("Content Script - SetResultsData on Selection.. ");
            if (result["selection_stat"]) {
              setResultsData(result["selection_stat"]);
            }
        });
    }, [resultsData]);  

    if (!resultsData) {

        return <div>Nothing selected...</div>
    }

    return (
      <div className="overlayCard">
        <div className="countWords-header">
          <div className="countWords-header-name">
            <div>Let's count words</div>
          </div>
          <div className="countWords-header-logo"><img src="../../images/icon48.png" /></div>
        </div>
        <ResultsDataCard input={resultsData} />
        <div>
          <footer>
            <div className="countWords-footer">
              <span>
                <a
                  className="App-link"
                  href="https://optiklab.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >OptikLab (C) {new Date().getFullYear()}</a>
              </span>
              <span> | Version 1.0.0</span>
            </div>
          </footer>
        </div>
      </div>
    )
  }

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)

*/