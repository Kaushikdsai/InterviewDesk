import React, { useState } from 'react';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [logout,setLogout]=useState(false);
    const navigate=useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        setLogout(false); 
    };

    return (
      <div>
        <nav>
            <div className='nav-left'>
                <img src='' />
                <span>InterviewDesk</span>
            </div>
            <div className='nav-right'>
                <button className='logout-btn' onClick={() => setLogout(true)}>Logout</button>
            </div>
        </nav>
        {logout && (
            <div className='logout-confirm'>
                <h1>Are you sure you want to log out?</h1>
                  <button onClick={handleLogout}>Yes</button>
                  <button onClick={() => setLogout(false)}>No</button>
            </div>
        )}
      </div>
    )
}

export default Navbar;
