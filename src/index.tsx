import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import { registerCachedLists } from './services/wordLists'

// Private word lists downloaded on an earlier sign-in go into the word bank
// before anything renders, so saved progress on them resolves at once.
registerCachedLists()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
