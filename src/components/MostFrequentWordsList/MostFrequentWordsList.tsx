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

    return (<div className='countWords-results-frequency-item'>
        {
            input.map((item, index) => (
                <div key={index}>
                    <span>{item.word}: {item.count}</span>
                </div>
            ))
        }
    </div>)
}

export default MostFrequentWordsList;