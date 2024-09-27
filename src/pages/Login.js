import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../firebaseConfig'; // Import Firestore instance
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Import FontAwesome
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import the eye icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]); // State to hold fetched admin users
  const navigate = useNavigate();

  // Fetch the adminusers collection from Firestore
  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const adminUsersSnapshot = await getDocs(collection(db, 'adminusers'));
        const admins = adminUsersSnapshot.docs.map(doc => doc.data());
        setAdminUsers(admins); // Store fetched admin users in state
      } catch (error) {
        console.error('Error fetching admin users:', error);
      }
    };

    fetchAdminUsers();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if the entered email and password match any admin in the collection
    const validAdmin = adminUsers.find(admin => admin.email === email && admin.password === password);

    if (validAdmin) {
      // If valid admin, proceed to navigate to the dashboard
      navigate('/dashboard');
    } else {
      // If no match, show an error message
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password-visibility"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
