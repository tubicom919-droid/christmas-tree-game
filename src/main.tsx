import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'        // App.tsx 파일
import './index.css'           // Tailwind CSS import

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
