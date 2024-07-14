import * as React from 'react'
import { useState } from 'react'
import { ResultsData } from '../../models/resultsData'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import '@fontsource/roboto/300.css';
import MostFrequentWordsList from '../MostFrequentWordsList';

const ResultsDataCard: React.FC<{
    input: string
}> = ({input}) => {
    const [resultsData, setResultsData] = useState<ResultsData | null>(null);

    // Find active tab..
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Communicate with a Content Script of This Exact Tab..
        var currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab!.id!, "TabIdReceived" + currentTab!.url!); 
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

    return <Card>
            <CardContent>
                <Typography variant="subtitle2">Page statistics:</Typography>
                <Typography variant="body1">
                    <span>Word Count: </span><span>{resultsData.statistics.wordCount}</span>
                </Typography>
                <Typography variant="body1">
                    <span>Character Count: </span><span>{resultsData.statistics.characterCount}</span>
                </Typography>
                <Typography variant="body1">
                    <span>Average Word Length: </span><span>{resultsData.statistics.averageWordLength.toFixed(resultsData.statistics.numAverageDigits)}</span>
                </Typography>
                <Typography variant="body1">
                    <span>Longest Word Length: </span><span>{resultsData.statistics.longestWordLength}</span>
                </Typography>
                <Typography variant="subtitle2">{resultsData.statistics.mostFrequentNumber} of most frequent words:</Typography>
                <MostFrequentWordsList input={resultsData.mostFrequents} />
            </CardContent>
        </Card>
}

export default ResultsDataCard;