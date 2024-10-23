import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useEffect, useState, useContext } from "react";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { checkLogin, getCurrentUser, logout } from "../Auth";
import { Helmet } from "react-helmet";
import searchIcon from "./search.png";
import Service from "../Service/CategoryService";
import Toastify from "../ToastNotify/Toastify";
import { Context } from "../Context";

function Navbar() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const {
    cartCount,
    setSearchInput,
    fetchCartDetails,
    wishListCount,
    handleNavigation,
  } = useContext(Context);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isLoggedIn = checkLogin();
  const currentUser = isLoggedIn ? getCurrentUser() : null;

  // Search handling
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchInput(searchTerm);
      setSearchTerm("");
    } else {
      Toastify.showErrorMessage("Please enter a search term");
    }
  };

  // Fetch categories and cart details on component load
  useEffect(() => {
    fetchCategory();
    fetchCartDetails();
  }, [cartCount]);

  // Log current user details
  useEffect(() => {
    if (currentUser) {
      console.log(currentUser.name, currentUser.address);
    }
  }, [currentUser]);

  // Fetch categories from the service
  const fetchCategory = () => {
    Service.loadCategory()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log("Failed to fetch categories", err));
  };

  // Handle category selection
  const handleCategoryChange = (event) => {
    const selectedTitle = event.target.value;
    const selectedCategory = categories.find(
      (cat) => cat.title === selectedTitle
    );
    if (selectedCategory) {
      navigate(`/category/${selectedCategory.categoryId}`);
    } else {
      Toastify.showErrorMessage("Category not found");
      navigate("/");
    }
  };

  // Handle add to cart functionality
  const handleAddToCart = () => {
    if (!currentUser) {
      Toastify.showErrorMessage("Login required");
    } else {
      navigate("/UserDashboard");
      handleNavigation(1);
      Toastify.showSuccessMessage("Your Cart");
    }
  };

  // Handle wishlist functionality
  const handleWishlist = () => {
    if (!currentUser) {
      Toastify.showErrorMessage("Login required");
    } else {
      navigate("/UserDashboard");
      handleNavigation(3);
      Toastify.showSuccessMessage("Your Wishlist");
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout(() => {
      navigate("/UserSignIn");
      Toastify.showSuccessMessage("Successfully logged out");
    });
  };

  return (
    <div id="navigationBar" className="navigationBar">
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

      <h2>
        <i id="cartIcon" className="fas fa-shopping-cart">
          {" "}
          Eshop.in{" "}
        </i>
      </h2>

      <div className="search__bar__header">
        <div className="dropdown1">
          <select name="Categories" id="Categories" onChange={handleCategoryChange}>
            <option value="All Categories">All Categories</option>
            {categories.length > 0 &&
              categories.map((cat) => (
                <option key={cat.categoryId} value={cat.title}>
                  {cat.title}
                </option>
              ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>
          <img src={searchIcon} alt="Search Icon" />
        </button>
      </div>

      <div className="cart-controls">
        <i
          id="cartIcon"
          className="fas fa-shopping-cart"
          onClick={handleAddToCart}
        >
          <sup className="cart-count">{cartCount}</sup>
        </i>
        &nbsp;
        <i onClick={handleWishlist} className="fas fa-heart">
          <sup className="cart-count">{wishListCount}</sup>
        </i>
        &nbsp;&nbsp;&nbsp;
        <i id="toggle-btn" variant="dark" onClick={handleShow}>
          <h6>
            <i style={{ fontSize: "2rem", padding: "2px" }} className="fas fa-bars"></i>
          </h6>
        </i>
      </div>

      <Offcanvas show={show} onHide={handleClose} className="custom-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="offcanvas-title">
            <i
              id="offcanvas-i"
              style={{ backgroundColor: "transparent" }}
              className="fas fa-user"
            ></i>
            &nbsp;&nbsp;
            {currentUser ? currentUser.name : "User Name"},{" "}
            {currentUser ? currentUser.address : "User Address"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {currentUser ? (
            <ul className="off-canvas-items">
              <li>
                <a href="/UserDashBoard">
                  <i className="fas fa-user"></i>&nbsp;Account
                </a>
              </li>
              <li>
                <a href="/">
                  <i className="fas fa-store"></i>&nbsp;&nbsp;Store
                </a>
              </li>
              {currentUser.name === "Madhu Damodhar" ? (
                <li>
                  <a href="/AdminDashBoard">
                    <i className="fas fa-handshake"></i>&nbsp;&nbsp;E-Shop Seller
                  </a>
                </li>
              ) : null}
              <li onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>&nbsp;Logout
              </li>
            </ul>
          ) : (
            <ul className="off-canvas-items">
              <li>
                <a href="/UserSignUp">
                  <i className="fas fa-user-plus"></i>&nbsp;&nbsp;SignUp
                </a>
              </li>
              <li>
                <a href="/UserSignIn">
                  <i className="fas fa-sign-in-alt"></i>&nbsp;&nbsp;SignIn
                </a>
              </li>
              <li>
                <a href="/">
                  <i className="fas fa-store"></i>&nbsp;&nbsp;Store
                </a>
              </li>
            </ul>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Navbar;
