import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const NavbarWrapper = () => {
  const location = useLocation();

  // Conditionally render the Navbar based on the current route
  return location.pathname !== '/UserDashBoard' ? <Navbar /> : null;
};

export default NavbarWrapper;
