import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  exact path='/' Component={LoginPage} />
        <Route path='/dashbaord' Component={Dashboard} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
