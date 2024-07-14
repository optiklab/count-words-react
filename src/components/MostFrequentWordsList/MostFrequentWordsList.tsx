import * as React from 'react'
import { MostFrequentWord } from '../../models/resultsData'
import { Typography } from '@mui/material';
import '@fontsource/roboto/300.css';

const MostFrequentWordsList: React.FC<{
    input: Array<MostFrequentWord>
}> = ({input}) => {

    if (!input) {
        return <div>No words frequency yet...</div>
    }

    return (<div>
        {
            input.map((item, index) => (
                <Typography variant="body2" key={index}>
                    <span>{item.word}: {item.count}</span>
                </Typography>
            ))
        }
    </div>)
}

export default MostFrequentWordsList;