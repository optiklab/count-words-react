import * as React from 'react'
import { useState, useEffect } from 'react'
import { ResultsData } from '../../models/resultsData'
import '@fontsource/roboto/300.css';
import MostFrequentWordsList from '../MostFrequentWordsList';
import './ResultsDataCard.css';

const ResultsDataCard: React.FC<{
    input: string
}> = ({input}) => {
    const [resultsData, setResultsData] = useState<ResultsData | null>(null);

    //useEffect(() => {
    //}, [resultsData]);  

    // Find active tab..
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { 
        // Communicate with a Content Script of This Exact Tab..
        if (tabs) {
            const currentTab = tabs[0];
            if (currentTab) {
                const tabId = currentTab.id;
                if (tabId) {
                    var response = chrome.tabs.sendMessage(tabId, "TabIdReceived" + currentTab.url); 
                    response.then(() => {
                        chrome.storage.local.get(["my_page_stat"], function(result) {
                            setResultsData(result.my_page_stat);
                        });
                    });
                }
            }
        }
    });
    
    // Show results as soon as calculation is over 
    chrome.runtime.onMessage.addListener( (msg, sender, sendResponse) => {
        if (msg === "PageStatReady") {
            chrome.storage.local.get(["my_page_stat"], function(result) {
                setResultsData(result.my_page_stat);
            });
        }
    });

    if (!resultsData) {
        return <div>Caclculating...</div>
    }

    return <div>
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
            <div className="countWords-results-frequency">
                <div className="countWords-results-frequency-header">{resultsData.statistics.mostFrequentNumber} of most frequent words:</div>
                <MostFrequentWordsList input={resultsData.mostFrequents} />
            </div>
    </div>
}

export default ResultsDataCard;