import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Purchase from './pages/Purchase';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import './App.css';  // Import your CSS file

function App() {
  const location = useLocation();

  const shouldRenderNavbar = location.pathname !== '/';  // Conditionally render Navbar

  return (
    <div className="container">
      {shouldRenderNavbar && <Navbar />}  {/* Conditionally render Navbar */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
