import * as React from 'react'
import { useState } from 'react'
import { ResultsData } from '../../models/resultsData'
import '@fontsource/roboto/300.css';
import MostFrequentWordsList from '../MostFrequentWordsList';
import './ResultsDataCard.css';

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

const ResultsDataCard: React.FC<{
    input: ResultsData| null 
}> = ({input}) => {

    const [resultsData, setResultsData] = useState<ResultsData | null>(null);

    if (!resultsData) {
        
        // This is only for content-script overlay.
        if (input) {

            //setResultsData(input);
        } else {

            console.log("ResultsDataCard - On Page - Find active tab..");
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { 
    
                const currentTab = tabs[0];
    
                const uniquePart = zeroPad(currentTab.id!, 10) + "-" + currentTab.url;
                const key = "my_page_stat-" + uniquePart;
    
                chrome.storage.local.get([
                    key, 
                    "tab_url", 
                    "tab_id"], 
                    function(result) {
                        if (result[key]) {
                            setResultsData(result[key]);
                        } else {
                            console.log("ResultsDataCard - Communicate with a Content Script of This Exact Tab.. " + key);
                            var response = chrome.tabs.sendMessage(currentTab.id!, "TabIdReceived-" + uniquePart); 
                        }
                    });
            });
    
            // Show results as soon as calculation is over 
            chrome.runtime.onMessage.addListener(
                function setPageStatReady(msg, sender, sendResponse){
                    if (msg.startsWith("PageStatReady")) {
                        console.log("ResultsDataCard - PageStatReady event catched.");
    
                        const key = "my_page_stat-" + msg.slice(14);
                
                        chrome.storage.local.get([key], 
                            function(result) {
                                console.log("ResultsDataCard - SetResultsData on PageStatReady set.. " + key);
                                setResultsData(result[key]);
                            });
    
                    }
    
                    console.log("ResultsDataCard - PageStatReady sendResponse(true).");
                    sendResponse(true);
    
                    //chrome.runtime.onMessage.removeListener(setPageStatReady);
                    
                    return true;
                }
            );
        }

        return <div>No data...</div>
    }

    //useEffect(() => {

    //}, [resultsData]);  

    /*
    chrome.storage.onChanged.addListener((changes, namespace) => {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
          console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
          );
        }
      });
      */
      
    return <div className="countWords-results-datacard">
        <div className="countWords-results-frequency-first">
            <div className="countWords-results-header">Page statistics:</div>
            <div className="countWords-results-stat">
                <div>
                    <div className='countWords-results-frequency-item-word'>Word Count:</div>
                    <div className='countWords-results-frequency-item-count'>{resultsData.statistics.wordCount}</div>
                </div>
                <div>
                    <div className='countWords-results-frequency-item-word'>Character Count:</div>
                    <div className='countWords-results-frequency-item-count'>{resultsData.statistics.characterCount}</div>
                </div>
                <div>
                    <div className='countWords-results-frequency-item-word'>Average Word Length:</div>
                    <div className='countWords-results-frequency-item-count'>{resultsData.statistics.averageWordLength.toFixed(resultsData.statistics.numAverageDigits)}</div>
                </div>
                <div>
                    <div className='countWords-results-frequency-item-word'>Longest Word Length:</div>
                    <div className='countWords-results-frequency-item-count'>{resultsData.statistics.longestWordLength}</div>
                </div>
            </div>
        </div>
        <div className="countWords-results-frequency-second">
            <div className="countWords-results-frequency-header">{resultsData.statistics.mostFrequentNumber} of most frequent words:</div>
            <MostFrequentWordsList input={resultsData.mostFrequents} />
        </div>
    </div>
}

export default ResultsDataCard;