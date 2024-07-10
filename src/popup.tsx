import * as React from 'react'
import { render } from 'react-dom'
import './popup.css'

const App: React.FC<{}> = () => {
  return (
    <div>
      <h3>Popup</h3>
      <img src="../images/icon128.png" />
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
