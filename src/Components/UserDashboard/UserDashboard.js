// UserDashboard/UserDashboard.js
import "./UserDashboard.css";
import React, { useEffect, useState ,useContext} from "react";
import { checkLogin, getCurrentUser, logout } from '../Auth/index'; 
import { useNavigate } from "react-router-dom";
import CartService from "../Service/CartService";
import { Helmet } from "react-helmet";
import cartItemIcon from "./cartItem.gif";
import { BASE_URL } from "../Service/axios-helper";
import OrderService from "../Service/OrderService";
import Toastify from "../ToastNotify/Toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Context } from "../Context";
import Service from '../Service/CategoryService';
import Offcanvas from 'react-bootstrap/Offcanvas';
function UserDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 
  const [cartDetails, setCartDetails] = useState([]);
  const [displayCart, setDisplaycart] = useState(true);
  const [cartItems, setCartItem] = useState([]);
 const { cartCount}= useContext(Context);
 const [progress , setProgress] = useState(0);
  const getImageUrl = (imageName) => {
    const imageUrl = `${BASE_URL}/product/products/images/${imageName}`;
    console.log("Image URL:", imageUrl);
    return imageUrl;
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

 
  const [categories, setCategories] = useState([]);
  console.log( cartCount );
  
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

  useEffect(() => {

    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
      CartDetails();
    } else {
      setUser(null);
      navigate("/");
    }
    
  }, []); 
  useEffect(() => {
    checkCartItems();
  }, [cartItems]);
  const checkCartItems = () => {
    const flickerElement = document.getElementById('flicker');
    if (flickerElement) {
      cartItems.length > 0
        ? flickerElement.classList.add('flickerNotify')
        : flickerElement.classList.remove('flickerNotify');
    }
  };

  
  const CartDetails = () => {
    CartService.fetchCartDetails()
      .then((result) => {
        console.log(result.data.user);
        setCartDetails(result.data);
        setCartItem(result.data.items);
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  useEffect(() => {
    if (!user) {
      
      const timer = setTimeout(() => {
        navigate("/");
      }, 1000);
      return () => clearTimeout(timer); 
    }
  }, [user, navigate]);

  // this function navigates to each item
  const productDetails = () => {
    navigate('/product/');
  }



  //order details fetching

  const [orderDetails, setOrderDetails] = useState([]);
  
// Function to fetch order details
const fetchOrderDetails = () => {
  OrderService.getOrderDetails()
    .then((res) => {
      console.log("Fetched Order Details:", res.data);
      setOrderDetails(res.data);

      // Initialize counters
      let paidOrders = 0;
      let notPaidOrders = 0;

      // Analyze the payment status of the orders
      res.data.forEach((order) => {
        console.log("Order Payment Status:", order.paymentStatus);
        if (order.paymentStatus === 'PAID') {
          setProgress(25);
          paidOrders++;
        } else if (order.paymentStatus === 'NOT PAID') {
          notPaidOrders++;
          setProgress(0)
        }
      });

      // // Set progress based on the counts
      // if (paidOrders > 0 && notPaidOrders === 0) {
      //   setProgress(25); // Only paid orders
      //   console.log("Progress set to 25 for paid orders");
      // } else if (notPaidOrders > 0) {
      //   setProgress(0); // At least one not paid order
      //   console.log("Progress set to 0 for not paid orders");
      // } else {
      //   setProgress(0); // Default to 0 if no relevant orders
      //   console.log("Progress set to 0 for no relevant orders");
      // }
    })
    .catch((err) => {
      console.error("Error fetching order details:", err);
    });
};

// Fetch order details on component mount
useEffect(() => {
  fetchOrderDetails();
}, []);

// Log order details for debugging
useEffect(() => {
  console.log("Order Details Updated:", orderDetails);
}, [orderDetails]);
 
  
 

  

  
  // Function to delete an order
  const deleteOrder = (id) => {
    OrderService.deleteOrder(id)
      .then(() => {
        Toastify.showSuccessMessage(`Order (#${id}) Cancelled ☹️`);
        fetchOrderDetails(); // Refetch order details after deleting an order
      })
      .catch((err) => {
        console.log(err);
        Toastify.showErrorMessage(`Order (#${id}) Not Cancelled`);
      });
  };

  
  return (
    <>
 
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
     
    <div  className="userHeader">
 <h2><i id='cartIcon' className="fas fa-shopping-cart"> Eshop.in  </i></h2> 
 <div className="userHeaderItems">
 
 <div className="cart-controls">
        <i id='cartIcon' className="fas fa-shopping-cart" onClick={handleAddToCart}>
          <sup className="cart-count">{ cartCount}</sup>
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
</div>
    
      <div id="container" class="container mt-3">
        <div class="col-lg-9 my-lg-0 my-1">
          <div id="main-content" class="bg-white border">
            <div class="d-flex flex-column">
              {user ? (
                <>
                  <div class="h5">Hello {user.name},</div>
                  <div>Logged in as: {user.email}</div>
                </>
              ) : (
                <>
                  <div class="h5">Hello Jhon,</div>
                  <div>Logged in as: someone@gmail.com</div>
                </>
              )}
            </div>
            <div class="d-flex my-4 flex-wrap">
              <div id="box" class="box me-4 my-1 bg-light">
                <img
                  src="https://www.freepnglogos.com/uploads/box-png/cardboard-box-brown-vector-graphic-pixabay-2.png"
                  alt=""
                />
                <div class="d-flex align-items-center mt-2">
                  <div class="tag">Orders placed</div>
                  <div class="ms-auto number">{orderDetails.length}</div>
                </div>
              </div>
              <div id="flicker" className="flick"
                onClick={() => {
                  setDisplaycart(!displayCart);
                }}
                class="box me-4 my-1 bg-light"
              >
                <img
                  src="https://www.freepnglogos.com/uploads/shopping-cart-png/shopping-cart-campus-recreation-university-nebraska-lincoln-30.png"
                  alt=""
                />
                <div className="d-flex align-items-center mt-1">
                <div className="tag">Items in Cart</div>
                <div className="ms-auto number">
                  {cartCount}
                </div>
              </div>
              
              </div>
              <div class="box me-4 my-1 bg-light">
                <img
                  src="https://www.freepnglogos.com/uploads/love-png/love-png-heart-symbol-wikipedia-11.png"
                  alt=""
                />
                <div class="d-flex align-items-center mt-2">
                  <div class="tag">Wishlist</div>
                  <div class="ms-auto number">10</div>
                </div>
              </div>
            </div>
            <div class="text-uppercase">My recent orders</div>
        
          {orderDetails.map((order)=>{
            return(
              <div class="order my-3 bg-light" key={order.orderId}>
              <div class="row">
                <div class="col-lg-4">
                  <div class="d-flex flex-column justify-content-between order-summary">
                    <div class="d-flex align-items-center">
                      <div class="text-uppercase">Order #ESP1000<span style={{color:'red',fontWeight:'900'}}>{order.orderId}</span></div>
                      <div  class={order.paymentStatus ==='PAID' ? `blue-label ms-auto text-uppercase`: `red-label ms-auto text-uppercase`}>{order.paymentStatus}</div>
                    </div>
                    <div class="fs-8">Products #<span style={{color:'green',fontWeight:'900'}}>{order.item.length}</span></div>
                    <div class="fs-8">{order.orderCreated } | 12:05 PM</div>
                    <div class="rating d-flex align-items-center pt-1">
                      <img
                        src="https://www.freepnglogos.com/uploads/like-png/like-png-hand-thumb-sign-vector-graphic-pixabay-39.png"
                        alt=""
                      />
                      <span class="px-2">Rating:</span>
                      <span class="fas fa-star"></span>
                      <span class="fas fa-star"></span>
                      <span class="fas fa-star"></span>
                      <span class="fas fa-star"></span>
                      <span class="far fa-star"></span>
                    </div>
                    
                  </div>
                 
                </div>
                <div class="col-lg-8">
                  <div class="d-sm-flex align-items-sm-start justify-content-sm-between">
                    <div class="status">Status : Delivered</div>
                    <div class="btn btn-primary text-uppercase">order info</div>
                  
                  </div>
                  <div className="progressbar-track">
  <ul className="progressbar">
    <li id="step-1" className={progress > 0 ? "text-muted success" : "text-muted green"}>
      <span className="fas fa-gift"></span>
    </li>
    <li id="step-2" className={progress >= 25 ? "text-muted success" : "text-muted green"}>
      <span className="fas fa-check"></span>
    </li>
    <li id="step-3" className={progress >= 50 ? "text-muted success" : "text-muted green"}>
      <span className="fas fa-box"></span>
    </li>
    <li id="step-4" className={progress >= 75 ? "text-muted success" : "text-muted green"}>
      <span className="fas fa-truck"></span>
    </li>
    <li id="step-5" className={progress === 100 ? "text-muted delivered" : "text-muted green"}>
      <span className="fas fa-box-open"></span>
    </li>
  </ul>
  <div id="tracker" style={{ width: `${progress}%` }}></div>
</div>

                  
                </div>
                <div onClick={()=>{deleteOrder(order.orderId)}} id="cancelOrder"  class="btn btn-danger">Cancel</div>
              </div>
            {/*<button onClick={increaseProgress} className="progress-button">click</button>*/}
            </div>
            )
          })}
          </div>
        </div>
        <div id="wrapper" class=" col-lg-3 my-lg-0 my-md-1">
          {!displayCart ? (
           
            <div id="sidebar">
              <div class="h4 text-black ">
                {" "}
                <div class="fas fa-shopping-cart pt-2 me-3"></div>
                Cart Items ({cartDetails.cartTotalItems
                })
              </div>
              <ul>
                {cartItems.length>0 ? cartItems.map((cartItem, index) => {
                  return (
                    <li onClick={() => productDetails(cartItem, cartDetails.cartId ,cartDetails)} key={cartItem.id || index}>
                      <a
                        href="#"
                        class="text-decoration-none d-flex align-items-start"
                      >
                        <img
                          style={{
                            height: "30px",
                            width: "30p",
                            margin: "20px 10px 0px 0px",
                          }}
                          src={getImageUrl(cartItem.product.imageName)}
                          alt={cartItem.product.productName || "Product"}
                          onError={(e) => {
                            e.target.src = {cartItemIcon}
                          }}
                        ></img>
                        <div class="d-flex flex-column">
                          <div class="link">
                            {cartItem.product.productName} <br></br>
                            {cartItem.product.productDesc}{" "}
                          </div>
                          <div class="link-desc">
                            price : ₹ {cartItem.totalPrice.toLocaleString('en-IN')} , (quantity :{" "}
                            {cartItem.quantity})
                          </div>
                        </div>
                      </a>
                    </li>
                    
                  );
                }):(
                  <li>
                  <a
                    href="#"
                    class="text-decoration-none d-flex align-items-start"
                  >
                    <div class="fas fa-exclamation-circle pt-2 me-3"></div>
                    <div class="d-flex flex-column">
                      <div class="link">No orders available.</div>
                      <div class="link-desc">
                      Explore our products!
                      </div>
                    </div>
                  </a>
                </li>
                
                  
                )}

                {/* <li>
                  <a
                    href="#"
                    class="text-decoration-none d-flex align-items-start"
                  >
                    <div class="fas fa-box-open pt-2 me-3"></div>
                    <div class="d-flex flex-column">
                      <div class="link">My Orders</div>
                      <div class="link-desc">
                        View & Manage orders and returns
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-decoration-none d-flex align-items-start"
                  >
                    <div class="far fa-address-book pt-2 me-3"></div>
                    <div class="d-flex flex-column">
                      <div class="link">Address Book</div>
                      <div class="link-desc">View & Manage Addresses</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-decoration-none d-flex align-items-start"
                  >
                    <div class="far fa-user pt-2 me-3"></div>
                    <div class="d-flex flex-column">
                      <div class="link">My Profile</div>
                      <div class="link-desc">
                        Change your profile details & password
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-decoration-none d-flex align-items-start"
                  >
                    <div class="fas fa-headset pt-2 me-3"></div>
                    <div class="d-flex flex-column">
                      <div class="link">Help & Support</div>
                      <div class="link-desc">
                        Contact Us for help and support
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <button
                    class="btn btn-dark"
                    onClick={() => {
                      logout();
                      navigate("/"); 
                    }}
                  >
                    Logout
                  </button>
                </li>
                */}
                <li class="active">
                <a
                  href="#"
                  class="text-decoration-none d-flex align-items-start"
                >
                  <div class="fas fa-coins pt-2 me-3"></div>
                  <div class="d-flex flex-column">
                    <div class="link"><h4 style={{color:'green'}}>Total Price: ₹    {cartDetails?.totalPrice?.toLocaleString('en-In') || 0}</h4>
                    </div>
                    <div class="link-desc">
                  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                    </div>
                  </div>
                </a>
              </li>
              </ul>
            </div>
          ) : (
            <div id="sidebar">
            <div class="h4 text-black ">Account</div>
            <ul>
              <li class="active">
                <a
                  href="#"
                  class="text-decoration-none d-flex align-items-start"
                >
                  <div class="fas fa-box pt-2 me-3"></div>
                  <div class="d-flex flex-column">
                    <div class="link">My Account</div>
                    <div class="link-desc">
                      View & Manage orders and returns
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-decoration-none d-flex align-items-start"
                >
                  <div class="fas fa-box-open pt-2 me-3"></div>
                  <div class="d-flex flex-column">
                    <div class="link">My Orders</div>
                    <div class="link-desc">
                      View & Manage orders and returns
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-decoration-none d-flex align-items-start"
                >
                  <div class="far fa-address-book pt-2 me-3"></div>
                  <div class="d-flex flex-column">
                    <div class="link">Address Book</div>
                    <div class="link-desc">View & Manage Addresses</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-decoration-none d-flex align-items-start"
                >
                  <div class="far fa-user pt-2 me-3"></div>
                  <div class="d-flex flex-column">
                    <div class="link">My Profile</div>
                    <div class="link-desc">
                      Change your profile details & password
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-decoration-none d-flex align-items-start"
                >
                  <div class="fas fa-headset pt-2 me-3"></div>
                  <div class="d-flex flex-column">
                    <div class="link">Help & Support</div>
                    <div class="link-desc">
                      Contact Us for help and support
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <button
                  class="btn btn-dark"
                  onClick={() => {
                    logout();
                    navigate("/"); 
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
            
          </div>
          )}
        </div>
      </div>
   
       </>
  );
}

export default UserDashboard;
