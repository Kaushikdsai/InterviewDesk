import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import '../styles/StudentRegister.css'
import { useNavigate } from 'react-router-dom';

const StudentRegister = () => {
    const navigate=useNavigate();
    const [name,setName]=useState('');
    const [contact,setContact]=useState('');
    const [regNo,setRegno]=useState('');
    const [batch,setBatch]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            await axios.post('http://localhost:5000/api/register', {name,contact,regNo,batch,email,password});
            navigate('/login');
        }
        catch(err){
            console.error(err);
        }
    }

    return (
      <>
          <form className='registration-form' onSubmit={handleSubmit}>
              <h1>REGISTRATION FORM</h1>
              <input id='name' type='text' name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
              <input id='contact' type='text' name='contact' value={contact} onChange={(e) => setContact(e.target.value)}  placeholder='Contact' />
              <input id='regno' type='text' name='regno' value={regNo} onChange={(e) => setRegno(e.target.value)}  placeholder='Registration Number' />
              <input id='batch' type='number' name='batch' value={batch} onChange={(e) => setBatch(e.target.value)}  placeholder='Batch' />
              <input id='email' type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)}  placeholder='Email' />
              <input id='password' type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
              <button className='reg-btn' type='submit'>Register</button>
              <p>Already have an account? <Link to='/'>Click here</Link></p>
          </form>
      </>
    )
}

export default StudentRegister