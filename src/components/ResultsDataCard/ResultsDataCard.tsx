import * as React from 'react'
import { useState } from 'react'
import Toggle from 'react-toggle';
import ReactSlider from 'react-slider';
import { ResultsData } from '../../models/resultsData'
import '@fontsource/roboto/300.css';
import MostFrequentWordsList from '../MostFrequentWordsList';
import './ResultsDataCard.css';

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

const ResultsDataCard: React.FC<{
    input: ResultsData| null 
}> = ({input}) => {

    const [caseSensitiveToggle, setCaseSensitiveToggle] = useState(true);
    const handleToggleChange = () => {
        setCaseSensitiveToggle(!caseSensitiveToggle);
    };

    const [sliderValue, setSliderValue] = useState(0);
    const handleSliderChange = (value: number, index: number) => {
        setSliderValue(value);
    };

    const [resultsData, setResultsData] = useState<ResultsData | null>(null);
    if (!resultsData) {
        
        // This is only for content-script overlay.
        if (input) {

            // This code will show the same data in overlay (over the page). I have an idea to make this option by toggle. 
            // But I don't really think that someone needs it... so keep it commented to use it later.
            //setResultsData(input);
        } else {

            //console.log("ResultsDataCard - On Page - Find active tab..");
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
                            //console.log("ResultsDataCard - Communicate with a Content Script of This Exact Tab.. " + key);
                            var response = chrome.tabs.sendMessage(currentTab.id!, "TabIdReceived-" + uniquePart); 
                        }
                    });
            });
    
            // Show results as soon as calculation is over 
            chrome.runtime.onMessage.addListener(
                function setPageStatReady(msg, sender, sendResponse){
                    if (msg.startsWith("PageStatReady")) {
                        //console.log("ResultsDataCard - PageStatReady event catched.");
    
                        const key = "my_page_stat-" + msg.slice(14);
                
                        chrome.storage.local.get([key], 
                            function(result) {
                                //console.log("ResultsDataCard - SetResultsData on PageStatReady set.. " + key);
                                setResultsData(result[key]);
                            });
    
                    }
    
                    //console.log("ResultsDataCard - PageStatReady sendResponse(true).");
                    sendResponse(true);
    
                    //chrome.runtime.onMessage.removeListener(setPageStatReady);
                    
                    return true;
                }
            );
        }

        return <div>No data... please refresh the page!</div>
    }
      
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
            <div className="countWords-toggles">
                <label>
                    <Toggle
                        id='case-insensitive-toggle'
                        defaultChecked={caseSensitiveToggle}
                        onChange={handleToggleChange} />
                        <span className="countWords-toggle-label-text">Case sensivity</span>
                </label>
                <label>
                    <span className="countWords-slider-label-text">Skip words of length</span>
                    <ReactSlider
                            className="horizontal-slider"
                            marks
                            markClassName="example-mark"
                            min={0}
                            max={5}
                            thumbClassName="example-thumb"
                            trackClassName="example-track"
                            onChange={handleSliderChange}
                            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                        />
                </label>
            </div>
        </div>
        <div className="countWords-results-frequency-second">
            <div className="countWords-results-frequency-header">{resultsData.statistics.mostFrequentNumber} of most frequent words:</div>
            <MostFrequentWordsList 
                input={ caseSensitiveToggle ? resultsData.mostFrequentsCaseInsensitive : resultsData.mostFrequentsCaseSensitive} 
                max={resultsData.statistics.mostFrequentNumber}
                filterOutWordsLength={sliderValue} />
        </div>
    </div>
}

export default ResultsDataCard;