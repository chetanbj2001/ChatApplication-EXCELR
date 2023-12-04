import { Route, Routes } from 'react-router-dom';
import './App.css';
import Agents from './components/Agents';
import Clients from './components/Clients';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='client' element={<Clients></Clients>} ></Route>
        <Route path='agent' element={<Agents></Agents>}></Route>
      </Routes>
    </div>
  );
}

export default App;
