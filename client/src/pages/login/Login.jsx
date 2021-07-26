import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

async function loginUser(credentials) {
    return fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
          username,
          password
        });
        setToken(token);
      }
  return(
    <div className="login-content">
    <div className="text">
Login Form</div>
<form onSubmit={handleSubmit}>
      <div className="field">
        <input type="text" onChange={e => setUserName(e.target.value)} required/>
        <span className="fas fa-user"></span>
        <label>Email or Phone</label>
      </div>
<div className="field">
        <input type="password"  onChange={e => setPassword(e.target.value)} required/>
        <span className="fas fa-lock"></span>
        <label>Password</label>
      </div>
<div className="forgot-pass">
<a href="#">Forgot Password?</a></div>
<button type="submit">Login</button>
      <div className="sign-up">
Not a member?
        <a href="#">signup now</a>
      </div>
</form>
</div>
  )
}
Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }