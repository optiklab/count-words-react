import * as React from 'react'
import { MostFrequentWord } from '../../models/resultsData'
import '@fontsource/roboto/300.css';
import './MostFrequentWordsList.css';

const MostFrequentWordsList: React.FC<{
    input: Array<MostFrequentWord>
}> = ({input}) => {

    if (!input) {
        return <div>No words frequency yet...</div>
    }

    return (<div className='countWords-results-frequency-list'>
        {
            input.map((item, index) => (
                <div className='countWords-results-frequency-item' key={index}>
                    <div className='countWords-results-frequency-item-word'>
                        {item.word}
                    </div>
                    <div className='countWords-results-frequency-item-count'>
                        {item.count}
                    </div>
                </div>
            ))
        }
    </div>)
}

export default MostFrequentWordsList;