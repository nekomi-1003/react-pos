import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const url = "http://localhost/coc/api/user.php"; // Ensure this URL is correct
      try {
        const response = await axios.get(url, { headers: { 'Content-Type': 'application/json' } });
        console.log("Fetched users:", response.data);
        // Ensure the response.data structure is correct
        if (response.data && typeof response.data === 'object') {
          setUsers(response.data);
        } else {
          setError('Unexpected response format.');
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError('Failed to load users. Please try again later.');
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = () => {
    setError('');
    console.log("Users in handleLogin:", users);
    if (users[username] && users[username].password === password) {
      const user = { username, fullname: users[username].fullname };
      onLogin(user);
      navigate('/pos'); // Navigate to POS page on successful login
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h1>USER LOGIN</h1>
      <label>
        Username:
        <select value={username} onChange={(e) => setUsername(e.target.value)}>
          <option value="">Select a user</option>
          {Object.keys(users).map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;