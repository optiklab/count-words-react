export interface MostFrequentWord {
  count: number,
  word: string
};

export interface ResultsData {
  statistics: {
    wordCount: number
    characterCount: number
    averageWordLength: number
    numAverageDigits: number
    longestWordLength: number
    mostFrequentNumber: number
  }
  mostFrequents: Array<MostFrequentWord>
};