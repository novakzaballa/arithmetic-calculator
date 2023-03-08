import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import LogIn from './pages/LoginScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={< LogIn />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
