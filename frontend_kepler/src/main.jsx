import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, createBrowserRouter } from 'react-router-dom'
import './index.css'
import LoginPage from './components/LoginPage.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <LoginPage />
    </React.StrictMode>
  </BrowserRouter>
)
