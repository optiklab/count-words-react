import * as React from 'react'
import { render } from 'react-dom'
import './popup.css'
import ResultsDataCard from '../components/ResultsDataCard';

const App: React.FC<{}> = () => {
  return (
    <div>
      <h3>Count words</h3>
      <img src="../images/icon128.png" />
      <div className="card">
      </div>
      <div>
        <ResultsDataCard input="Abc" />
      </div>
      <p className="read-the-docs">
        Enjoyed? Learn more...
      </p>
      <a
          className="App-link"
          href="https://optiklab.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >OptikLab (C) 2024</a>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)

export default App;