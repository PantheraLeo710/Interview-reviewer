import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { API } from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API.AUTH.LOGIN, { email, password });

      // Debug: log what comes from backend
      console.log("Login Response:", res.data);

      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error("Token or user not returned from server.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="mb-3 text-center">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" name="password" type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
