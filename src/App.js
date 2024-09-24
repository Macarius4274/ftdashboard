import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Purchase from './pages/Purchase';
import Settings from './pages/Settings';
import Login from './pages/Login'; // Ensure Login component is imported
import Navbar from './components/Navbar';  // Ensure your Navbar is included

function App() {
  return (
    <Router>
      <Navbar />  {/* Navbar should be present for navigation */}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Login />} />  {/* Default to login or home page */}
      </Routes>
    </Router>
  );
}

export default App;
