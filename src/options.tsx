import * as React from 'react'
import { render } from 'react-dom'
import './options.css'

const App: React.FC<{}> = () => {
  return (
    <div>
      <h3>Options</h3>
      <img src="images/icon128.png" />
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
