import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={LoginPage} />
        <Route path='/dashboard' Component={Dashboard} />
        <Route path='/admin' Component={Admin} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
