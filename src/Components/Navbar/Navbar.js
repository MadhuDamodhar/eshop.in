import React, { useEffect, useState } from 'react';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { checkLogin, getCurrentUser, logout } from '../Auth/index'; 
import { Helmet } from "react-helmet";
import searchIcon from '../Navbar/search.png';
import Service from '../Service/CategoryService';
import Toastify from '../ToastNotify/Toastify';

function Navbar({cartCount}) {
  const location = useLocation();
  const navigate = useNavigate();
 
  const [categories, setCategories] = useState([]);
  
  // Check if the user is logged in and get the current user
  const isLoggedIn = checkLogin();
  const currentUser = isLoggedIn ? getCurrentUser() : null;

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser.name, currentUser.address);
    }
  }, [currentUser]);

  useEffect(() => {
    // Load categories when component mounts
    fetchCategory();
  }, []);

  const fetchCategory = () => {
    Service.loadCategory()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  };

  const handleCategoryChange = (event) => {
    const selectedTitle = event.target.value;
    // Find the selected category object by its title
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
    } else {
      Toastify.showSuccessMessage("Your Cart Items");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top" style={{ zIndex: 1 }}>
        <Helmet>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
            rel="stylesheet"
          />
          <link
            href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
            rel="stylesheet"
          />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"></script>
        </Helmet>
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mynav"
            aria-controls="mynav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <a className="navbar-brand" href="#">
            <div className="d-flex">
              <div className="d-flex  align-items-center logo bg-black">
                <div
                  style={{ backgroundColor: "black" ,display:'flex' ,gap:'2px'}}
                  className="fas fa-shopping-cart h2 text-white"
                ><h4> E Shop.in</h4></div>
              </div>
            </div>
          </a>
          <div className="collapse navbar-collapse" id="mynav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <div className="search__bar__header">
                <div className="dropdown1">
                  <select name="Categories" id="Categories" onChange={handleCategoryChange}>
                    <option value="All Categories">All Categories</option>
                    {categories.length > 0 && categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.title}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <input type="text" placeholder="Search for products, brands, and more..." />
                <button>
                  <img src={searchIcon} alt="Search Icon" />
                </button>
              </div>

              <li className="nav-item">
                <div className="cart__header__desktop">
                  <i id='cartIcon' className="fas fa-shopping-cart" onClick={handleAddToCart}>
                    <sup className="cart-count">{cartCount>0?cartCount:0}</sup>
                  </i>
                  &nbsp;
                  <i className="fas fa-heart">
                    <sup className="cart-count">5</sup>
                  </i>
                </div>
              </li>
              <li className="nav-item">
                {currentUser ? (
                  <Dropdown  >
                  <Dropdown.Toggle style={{ height: '100%', padding: '10px' }} variant="dark" id="dropdown-basic">
                  <i style={{backgroundColor:'transparent'}} className="fas fa-user">&nbsp;</i> {currentUser.name.length > 15
                    ? `${currentUser.name.slice(0, 10)}.`
                    : `${currentUser.name}`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown-menu">
                      <Dropdown.Item className="custom-dropdown-item" href="/UserDashBoard"> <i style={{backgroundColor:'transparent'}} className="fas fa-user"></i>&nbsp;&nbsp;Account</Dropdown.Item>
                     
                      <Dropdown.Item className="custom-dropdown-item" href="/"><i style={{backgroundColor:'transparent'}} className="fas fa-handshake"></i> &nbsp;&nbsp;E-Shop seller</Dropdown.Item>

                      <Dropdown.Item className="custom-dropdown-item" href="/"><i style={{backgroundColor:'transparent'}} className="fas fa-store"></i> &nbsp;&nbsp;Store</Dropdown.Item>

                      <Dropdown.Item className="custom-dropdown-item" href="/UserSignUp">
                      <i className="fas fa-user-plus" style={{ backgroundColor: 'transparent' }}></i> &nbsp;&nbsp;Sign up
                    </Dropdown.Item>

                    
                      <Dropdown.Item className="custom-dropdown-item" onClick={() => logout(() => navigate("/"))}><i className="fas fa-sign-out-alt" style={{ backgroundColor: 'transparent' }}></i>&nbsp; &nbsp;Log out</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Dropdown>
                    <Dropdown.Toggle style={{ height: '100%', padding: '10px' }} variant="dark" id="dropdown-basic">
                      SignUp/SignIn
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown-menu">
                    <Dropdown.Item className="custom-dropdown-item" href="/UserSignUp">
                    <i className="fas fa-user-plus" style={{ backgroundColor: 'transparent' }}></i> &nbsp;&nbsp;Sign up
                  </Dropdown.Item>
                      <Dropdown.Item className="custom-dropdown-item" href="/UserSignIn">
                       <i className="fas fa-sign-in-alt" style={{ backgroundColor: 'transparent' }}></i> &nbsp;&nbsp;Sign In</Dropdown.Item>


                      <Dropdown.Item className="custom-dropdown-item" href="/"><i style={{backgroundColor:'transparent'}} className="fas fa-store"></i> &nbsp; &nbsp;Store</Dropdown.Item>


                      <Dropdown.Item className="custom-dropdown-item" href="/"><i style={{backgroundColor:'transparent'}} className="fas fa-handshake"></i>&nbsp;&nbsp;E-Shop Seller </Dropdown.Item>


                      <Dropdown.Item className="custom-dropdown-item" href="/AdminDashBoard"><i style={{backgroundColor:'transparent'}} className="fas fa-handshake"></i>&nbsp;&nbsp;AdminDashBoard </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      
    </>
  );
}

export default Navbar;
