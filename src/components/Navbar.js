import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBoxOpen, faShoppingCart, faClipboardList, faCogs, faBell } from '@fortawesome/free-solid-svg-icons'; // Font Awesome icons

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Ensure '/' route is the login page
    } catch (error) {
      console.error("Logout failed:", error.message);  // Log error details
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">F T . W E A R S</div>
      </div>
      <div className="navbar-center">
        <ul className="navbar-links">
          <li>
            <button onClick={() => navigate('/dashboard')} className="navbar-link">
              <FontAwesomeIcon icon={faHome} /> Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/products')} className="navbar-link">
              <FontAwesomeIcon icon={faBoxOpen} /> Manage
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/sales')} className="navbar-link">
              <FontAwesomeIcon icon={faShoppingCart} /> Sales
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/purchase')} className="navbar-link">
              <FontAwesomeIcon icon={faClipboardList} /> Purchase
            </button>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <ul className="navbar-icons">
          <li>
            <button onClick={() => navigate('/settings')} className="icon">
              <FontAwesomeIcon icon={faCogs} />
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/notifications')} className="icon">
              <FontAwesomeIcon icon={faBell} />
            </button>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
