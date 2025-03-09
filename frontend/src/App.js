import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome'
import NewAccount from './pages/NewAcccount'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/newaccount" element={<NewAccount />} />
        <Route path="/welcome" element={<Welcome />} />

      </Routes>
    </Router>
  );
}

export default App;
