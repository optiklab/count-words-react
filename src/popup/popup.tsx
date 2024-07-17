import * as React from 'react'
import { render } from 'react-dom'
import './popup.css'
import '@fontsource/roboto/300.css';
import ResultsDataCard from '../components/ResultsDataCard';
import { ResultsData } from '../models/resultsData';

const input: ResultsData | null = null;

const App: React.FC<{}> = () => {
  return (
    <div>
      <div className="countWords-header">
        <div className="countWords-header-name">
          <div>Let's count words</div>
        </div>
        <div className="countWords-header-logo"><img src="../images/icon48.png" /></div>
      </div>
      <ResultsDataCard input={input} />
      <div>
        <footer>
          <div className="countWords-footer">
            <span>
              <a
                className="App-link"
                href="https://optiklab.github.io"
                target="_blank"
                rel="noopener noreferrer"
              >OptikLab (C) {new Date().getFullYear()}</a>
            </span>
            <span> | Version 1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)

export default App;