import { Route, Routes } from 'react-router-dom';
import './App.css';
import Agents from './components/Agents';
import Clients from './components/Clients';
import Home from './components/Home';
import UserLogin from './components/UserLogin';
import AgentLogin from './components/AgentLogin';
import Dashboard from './components/Dashboard';
import Questionari from './components/Questionari';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/agentlogin" element={<AgentLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/questionari" element={<Questionari />} />
        <Route path='/client' element={<Clients></Clients>} ></Route>
        <Route path='/agent' element={<Agents></Agents>}></Route>
      </Routes>
    </div>
  );
}

export default App;
