import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { UserProvider } from './UserContext'; // ⬅️ import added

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import NewAccount from './pages/NewAccount'; // Fixed typo here too
import Suppliers from './pages/suppliers';
import Categories from './pages/categories';
import Users from './pages/users';
import Products from './pages/products';
import Orders from './pages/orders';
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
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />




        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
