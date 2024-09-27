import React from 'react'
import NavBar from "../Components/Navbar/Navbar"
import { ToastContainer, toast } from 'react-toastify';
function Base({children ,cartItemCount , userId}) {
  return (
    <div>
    <NavBar cartCount={cartItemCount ? cartItemCount : 0} />
    <div>
    {children}
    </div>
    <ToastContainer />
    </div>
  )
}

export default Base