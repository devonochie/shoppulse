import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
   //  setUserId(null);
    navigate('/login');
  };

  return (
    <div>
      <nav className='nav-left' >
        <Link to="/admin">Admin</Link>
        <Link to="/order">Orders</Link>
        <Link to="/login">Login</Link>
        <Link to='/cart'>Cart</Link>
      </nav>
    <button onClick={handleLogout}>Logout</button>
    </div>
    
  );
};

export default Navbar;
