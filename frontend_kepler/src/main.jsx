import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, createBrowserRouter } from 'react-router-dom'
import './index.css'
import LoginPage from './components/LoginPage.jsx'
import App from './App.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
)
