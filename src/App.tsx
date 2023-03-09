import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import LogIn from './pages/LoginScreen';
import Operations from './pages/Operations';
import DataTable from './pages/DataTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={< LogIn />}></Route>
        <Route path='/Operations' element={< Operations />}></Route>
        <Route path='/Data' element={< DataTable />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
