import React from 'react'
import NavBar from "../Components/Navbar/Navbar"
import { ToastContainer, toast } from 'react-toastify';
function Base({children ,cartItemCount}) {
  return (
    <div>
    <NavBar cartCount={cartItemCount} />
    <div>
    {children}
    </div>
    <h1>footer</h1>
    <ToastContainer />
    </div>
  )
}

export default Base