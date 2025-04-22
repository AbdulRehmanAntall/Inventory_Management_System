import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { UserProvider } from './UserContext'; // ⬅️ import added

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import NewAccount from './pages/NewAccount'; // Fixed typo here too

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/newaccount" element={<NewAccount />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
