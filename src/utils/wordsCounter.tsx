import { ResultsData } from "../models/resultsData";
import XRegExp from 'xregexp';

const countWords = (text: string) => {

    //console.log("countWords...");

    text = text.replace(/<\/[^>]+(>|$)/g, '');

    const words = text!.split(/\s+/);

    const wordCount = words.length;

    const wordsMap = new Map();
    const wordsSensitiveMap = new Map();

    words.forEach((value: string) => {

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

        const clearValueSensitive = clearValue.toLowerCase();
        if (clearValueSensitive !== null && clearValueSensitive.length !== 0) {
            if (wordsSensitiveMap.has(clearValueSensitive)) {
                const counter = wordsSensitiveMap.get(clearValueSensitive);
                wordsSensitiveMap.set(clearValueSensitive, counter + 1);
            } else {
                wordsSensitiveMap.set(clearValueSensitive, 1);
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
    const sortedWords = arr.sort(function (a, b) {
        return (a.value > b.value) ? -1 : ((a.value < b.value) ? 1 : 0)
    });

    const arrSensitive = [];
    for (const [key, value] of wordsSensitiveMap) {
        arrSensitive.push({
            name: key,
            value: value
        });
    }
    const sortedWordsSensitive = arrSensitive.sort(function (a, b) {
        return (a.value > b.value) ? -1 : ((a.value < b.value) ? 1 : 0)
    });

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
            wordCount: wordCount,
            characterCount: text!.length,
            averageWordLength: avgLength,
            numAverageDigits: 2,
            longestWordLength: maxLength,
            mostFrequentNumber: 20
        },
        mostFrequentsCaseSensitive: [],
        mostFrequentsCaseInsensitive: []
    };

    for (const item of sortedWords) {
        results.mostFrequentsCaseInsensitive.push({
                count: item.value,
                word: item.name
            }
        );
    }

    for (const item of sortedWordsSensitive) {
        results.mostFrequentsCaseSensitive.push({
                count: item.value,
                word: item.name
            }
        );
    }

    return results;
};

export default countWords;