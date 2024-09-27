// UserDashboard/UserDashboard.js
import "./UserDashboard.css";
import React, { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../Auth/index";
import { useNavigate } from "react-router-dom";
import Base from "../Base";
import CartService from "../Service/CartService";
import { Helmet } from "react-helmet";
import cartItemIcon from "./cartItem.gif";
import { BASE_URL } from "../Service/axios-helper";
import OrderService from "../Service/OrderService";
import Toastify from "../ToastNotify/Toastify";
function UserDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 
  const [cartDetails, setCartDetails] = useState([]);
  const [displayCart, setDisplaycart] = useState(true);
  const [cartItems, setCartItem] = useState([]);

  const getImageUrl = (imageName) => {
    const imageUrl = `${BASE_URL}/product/products/images/${imageName}`;
    console.log("Image URL:", imageUrl);
    return imageUrl;
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

  const productDetails = (cartItem, cartId) => {
    console.log("Cart Item:", cartItem); 
    if (cartItem && cartId) {
      // Navigate and pass cartItemDetails and cartId to the next page
      navigate('/product/', { state: { cartItemDetails: cartItem, cartID: cartId } });
    }
    console.log("Cart Item sent:", cartItem); 
  };
  
  //order details fetching
  const [progress, setProgress] = useState(0);
  const [orderPayStatus, setOrderPaymentStatus] = useState('');
  const [orderDetails, setOrderDetails] = useState([]);
  
  // Function to fetch order details
  const fetchOrderDetails = () => {
    OrderService.getOrderDetails()
      .then((res) => {
        console.log(res.data);
        setOrderDetails(res.data);
        setOrderPaymentStatus(res.data[0].paymentStatus); // Update payment status
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  // useEffect to fetch order details once on component mount
  useEffect(() => {
    fetchOrderDetails();
  }, []); // Empty dependency array ensures this runs only once on mount
  
  // useEffect to update progress based on orderPayStatus
  useEffect(() => {
    if (orderPayStatus === "PAID") {
      setProgress(25); // Set progress to 25 if status is "PAID"
    } else {
      setProgress(0); // Set progress to 0 if not paid
    }
    console.log("Progress:", progress);
  }, [orderPayStatus]); // This effect runs whenever orderPayStatus changes
  
  // Function to delete an order
  const deleteOrder = (id) => {
    OrderService.deleteOrder(id)
      .then(() => {
        Toastify.showSuccessMessage(`☹️ Order (#${id}) Cancelled`);
        fetchOrderDetails(); // Refetch order details after deleting an order
      })
      .catch((err) => {
        console.log(err);
        Toastify.showErrorMessage(`Order (#${id}) Not Cancelled`);
      });
  };
  
  return (
    <Base  cartItemCount={cartItems.length ? cartItems.length : 0}>
 
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
      {/*  {user ? (
          <div>
            <h1>Welcome, {user.name}</h1>
            <h1>Address: {user.address}</h1>
            <h1>Gender: {user.gender}</h1>
            <h1>Phone: {user.phone}</h1>
            <h1>About: {user.about}</h1>
            <h1>Email: {user.email}</h1>
            <button onClick={() => {
              logout();
              navigate('/UserLogin'); // Redirect after logout
            }}>Logout</button>
          </div>
        ) : (
          <p>No user data found</p>
)}*/}

      {/* <hr></hr>*/}

    
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
                  {cartItems?cartItems.length :0}
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
                      <div class="text-uppercase">Order #fur1000<span style={{color:'red',fontWeight:'900'}}>{order.orderId}</span></div>
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
                  <div class="progressbar-track">
                    <ul class="progressbar">
                      <li id="step-1" class={progress > 0 ? "text-muted success" :"text-muted green"}>
                        <span class="fas fa-gift"></span>
                      </li>
                      <li id="step-2" class={progress >= 25 ? "text-muted success" :"text-muted green"}>
                        <span class="fas fa-check"></span>
                      </li>
                      <li id="step-3" class={progress >= 50 ? "text-muted success" :"text-muted green"}>
                        <span class="fas fa-box"></span>
                      </li>
                      <li id="step-4" class={progress >= 75 ? "text-muted success" :"text-muted green"}>
                        <span class="fas fa-truck"></span>
                      </li>
                      <li id="step-5" class={progress === 100 ? "text-muted delivered" :"text-muted green"}>
                        <span class="fas fa-box-open"></span>
                      </li>
                    </ul>
                    <div id="tracker"style={{ width: `${progress}%`}} ></div>
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
                    <li onClick={() => productDetails(cartItem, cartDetails.cartId)} key={cartItem.id || index}>
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
                    <div class="link"><h4 style={{color:'green'}}>Total Price: ₹{cartDetails.totalPrice.toLocaleString('en-IN')}.</h4>
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
   
       </Base>
  );
}

export default UserDashboard;
