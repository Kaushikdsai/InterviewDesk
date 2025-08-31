import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/StudentLogin.css';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [message,setMessage]=useState('');
    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try{
            console.log('Login payload:', { regNo: username, password });
            const res=await axios.post('http://localhost:5000/api/login', {regNo: username.toString(),password});
            setMessage('Login successful');
            localStorage.setItem('token',res.data.token);
            const decoded=JSON.parse(atob(res.data.token.split('.')[1]));
            if(decoded.role==='admin'){
                navigate('/admin-dashboard');
            }
            else{
                navigate('/');
            }
            console.log('Token received from backend:', res.data.token);
            navigate('/');

        }
        catch(err){
            console.error(err);
            setMessage('Login Failed');
        }
    }

    return (
      <>
          <form className='login-form' onSubmit={handleSubmit}>
              <h1>LOGIN FORM</h1>
              <input id='username' type='text' name='username' value={username} placeholder='Registration Number' onChange={(e) => setUsername(e.target.value)} />
              <input id='password' type='password' name='password' value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
              <button className='login-btn' type='submit'>Login</button>
              {message && <p>{message}</p>}
              <p>Dont have an account? <Link to='/register'>Click here</Link></p>
          </form>
      </>
    )
}

export default StudentLogin;