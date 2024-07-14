import { ResultsData } from "../models/resultsData";

const countWords = (text: string) => {

    console.log("countWords...");

    text = text.replace(/<\/[^>]+(>|$)/g, '');

    const words = text!.split(/\s+/);

    const wordsMap = new Map();

    words.forEach((value: string) => {
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
        mostFrequents: []
    };

    const sortedWords = arr.sort(function (a, b) {
        return (a.value > b.value) ? -1 : ((a.value < b.value) ? 1 : 0)
    });

    let counter = 0;
    for (const item of sortedWords) {
        results.mostFrequents.push({
                count: item.value,
                word: item.name
            }
        );
        if (counter > results.statistics.mostFrequentNumber) {
            break;
        }
        counter++;
    }

    return results;
};

export default countWords;