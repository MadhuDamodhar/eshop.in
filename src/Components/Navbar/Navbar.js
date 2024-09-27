import React from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useEffect, useState } from 'react';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { checkLogin, getCurrentUser, logout } from '../Auth'; 
import { Helmet } from "react-helmet";
import searchIcon from './search.png';
import Service from '../Service/CategoryService';
import Toastify from '../ToastNotify/Toastify';


function Navbar({cartCount}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  
  // Check if the user is logged in and get the current user
  const isLoggedIn = checkLogin();
  const currentUser = isLoggedIn ? getCurrentUser() : null;

  useEffect(() => {
    // Load categories when component mounts
    fetchCategory();
    
  }, []);


  useEffect(() => {
    if (currentUser) {
      console.log(currentUser.name, currentUser.address);
    }
  }, [currentUser]);

  const fetchCategory = () => {
    Service.loadCategory()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  };

  const handleCategoryChange = (event) => {
    const selectedTitle = event.target.value;
    const selectedCategory = categories.find(cat => cat.title === selectedTitle);
    if (selectedCategory) {
      navigate(`/category/${selectedCategory.categoryId}`);
    } else {
      navigate('/');
    }
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      Toastify.showErrorMessage("Login required");
      navigate("/UserSignIn");  // Redirect to login page
    } else {
      Toastify.showSuccessMessage("Your Cart Items");
    }
  };

  const handleLogout = () => {
    logout(() => {
      navigate("/");
      Toastify.showSuccessMessage("Successfully logged out");
    });
  };

  return (
    <div className='navigationBar'>
      <Helmet>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"></script>
      </Helmet>

      <h2><i id='cartIcon' className="fas fa-shopping-cart"> Eshop.in  </i></h2> 

      <div className="search__bar__header">
        <div className="dropdown1">
          <select name="Categories" id="Categories" onChange={handleCategoryChange}>
            <option value="All Categories">All Categories</option>
            {categories.length > 0 && categories.map((cat) => (
              <option key={cat.categoryId} value={cat.title}>{cat.title}</option>
            ))}
          </select>
        </div>
        <input type="text" placeholder="Search..." />
        <button>
          <img src={searchIcon} alt="Search Icon" />
        </button>
      </div>

      <div className="cart-controls">
        <i id='cartIcon' className="fas fa-shopping-cart" onClick={handleAddToCart}>
          <sup className="cart-count">{ cartCount && cartCount > 0 ? cartCount: 0}</sup>
        </i>
        &nbsp;
        <i className="fas fa-heart">
          <sup className="cart-count">5</sup>
        </i>
        &nbsp;&nbsp;&nbsp;
        <i id='toggle-btn' variant="dark" onClick={handleShow}>
          <h6><i style={{fontSize:'2rem',padding:'2px'}} className="fas fa-bars"></i></h6>
        </i>
      </div>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{borderBottom:'1px solid black', width:'100%', paddingBottom:'4px'}}>
            <i style={{ backgroundColor: 'transparent' }} className="fas fa-user"></i>&nbsp;&nbsp;
            {currentUser ? currentUser.name : "User Name"}, {currentUser ? currentUser.address : "User Address"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {currentUser ? (
            <ul className='off-canvas-items'>
              <li><a href='/UserDashBoard'> <i className="fas fa-user"></i>&nbsp;Account</a></li>
              <li><a href='/UserSignIn'> <i className="fas fa-sign-in-alt"></i>&nbsp;&nbsp;SignIn</a></li>
              <li><a href='/'>  <i className="fas fa-store"></i>&nbsp;&nbsp;Store</a></li>
              <li><a href='/AdminDashBoard'>  <i className="fas fa-handshake"></i>&nbsp;&nbsp;E-Shop Seller</a></li>
              <li onClick={handleLogout}><i className="fas fa-sign-out-alt"></i>&nbsp;Logout</li>
              <li><a href='/Product'><i className="fas fa-handshake"></i>&nbsp;&nbsp;Product</a></li>
              <li><a href='/payments'><i className="fas fa-handshake"></i>&nbsp;&nbsp;Product</a></li>
            </ul>
          ) : (
            <ul className='off-canvas-items'>
              <li><a href='/UserSignUp'><i className="fas fa-user-plus"></i>&nbsp;&nbsp;SignUp</a></li>
              <li><a href='/UserSignIn'><i className="fas fa-sign-in-alt"></i>&nbsp;&nbsp;SignIn</a></li>
              <li><a href='/'> <i className="fas fa-store"></i>&nbsp;&nbsp;Store</a></li>
              <li><a href='/AdminDashBoard'><i className="fas fa-handshake"></i>&nbsp;&nbsp;E-Shop Seller</a></li>
              <li><a href='/Product'><i className="fas fa-handshake"></i>&nbsp;&nbsp;Product</a></li>
            </ul>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Navbar;
