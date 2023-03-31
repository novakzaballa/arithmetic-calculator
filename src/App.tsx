import React from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import LogIn from './pages/Login';
import Operations from './pages/Operations';
import DataTable from './pages/DataTable';
import {PrivatePage} from './components/privatePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/login" element={<LogIn />} />

      <Route path="/calculator" element={<PrivatePage />}>
        <Route path="records" element={<DataTable />} />
        <Route path="operations" element={<Operations />} />
      </Route>
    </Routes>
  );
}

export default App;
