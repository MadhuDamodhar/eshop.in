// UserDashboard/UserDashboard.js
import "./UserDashboard.css";
import "./Queries.css";
import React, { useEffect, useState, useContext } from "react";
import { checkLogin, getCurrentUser, logout } from "../Auth/index";
import { useNavigate } from "react-router-dom";
import CartService from "../Service/CartService";
import { Helmet } from "react-helmet";
import cartItemIcon from "./cartItem.gif";
import { BASE_URL } from "../Service/axios-helper";
import OrderService from "../Service/OrderService";
import Toastify from "../ToastNotify/Toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../Context";
import Service from "../Service/CategoryService";
import Offcanvas from "react-bootstrap/Offcanvas";
import userImage from "../UserDashboard/user.png";
import Gpay from "../ProductDetalis/google-pay.png";
import card from "../ProductDetalis/card.gif";
import cash from "../ProductDetalis/cash.gif";
import phonePay from "../ProductDetalis/phonepay.png";
import successCod from "../ProductDetalis/success.gif";
import PaymentService from "../Service/PaymentService";
import Confetti from "react-confetti";
import iphone12 from "../Card/iphone.png";
import WishlistService from "../Service/WishlistService";
import {
  supportTickets,
  SupportTickets,
} from "../ChatBotTickets/SupportTickets";
import ChatBotService from "../Service/ChatBotService";
function UserDashboard() {
  const [wishList, setWishList] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState([]);
  const [cartItems, setCartItem] = useState([]);
  const {
    fetchCartDetails,
    cartCount,
    wishListCount,
    handleRemoveCartItem,
    handleWishlist,
    handleNavigation,
    NavigationCount,
    handleToggleWishlistMethods,
    wishListStatus,
  } = useContext(Context);
  const [progress, setProgress] = useState(0);
  const getImageUrl = (imageName) => {
    const imageUrl = `${BASE_URL}/product/products/images/${imageName}`;
    console.log("Image URL:", imageUrl);
    return imageUrl;
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    handleNavigation(0);
    fetchOrderDetails();
    handleWishlist();
    fetchCartDetails();
  };
  // Initialize count with session storage value or default to 0
  const handleAddToCartNavigation = () => {
    if (!currentUser) {
      Toastify.showErrorMessage("Login required");
    } else {
      navigate("/UserDashboard");
      handleNavigation(1);
      Toastify.showSuccessMessage("Your Cart");
    }
  };
  const handleWishlistNavigation = () => {
    if (!currentUser) {
      Toastify.showErrorMessage("Login required");
    } else {
      navigate("/UserDashboard");
      handleNavigation(3);
      Toastify.showSuccessMessage("Your Wishlist");
    }
  };
  const [orderRequest, setOrderRequest] = useState({
    cartID: "",
    address: "",
  });
  const [payment, setPayment] = useState({
    razorpay_signature: "",
    user_order_id: "",
    razorpay_order_id: "",
    razorpay_payment_id: "",
  });
  const [categories, setCategories] = useState([]);
  console.log(cartCount);

  // Check if the user is logged in and get the current user
  const isLoggedIn = checkLogin();
  const currentUser = isLoggedIn ? getCurrentUser() : null;
  const [wishlistproducts, setWishListProducts] = useState([]);
  useEffect(() => {
    // Load categories when component mounts
    fetchCategory();
    fetchWishlistProducts();
  }, [wishListCount]);

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser.name, currentUser.address);
    }
  }, [currentUser]);
  const fetchWishlistProducts = () => {
    WishlistService.fetchWishlistItems()
      .then((res) => {
        setWishListProducts(res.data.wishListItems);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchCategory = () => {
    Service.loadCategory()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      Toastify.showErrorMessage("Login required");
      navigate("/UserSignIn"); // Redirect to login page
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
  }, [cartCount]);
  useEffect(() => {
    checkCartItems();
  }, [cartItems]);
  const checkCartItems = () => {
    const flickerElement = document.getElementById("flicker");
    if (flickerElement) {
      cartItems.length > 0
        ? flickerElement.classList.add("flickerNotify")
        : flickerElement.classList.remove("flickerNotify");
    }
  };

  const CartDetails = () => {
    CartService.fetchCartDetails()
      .then((result) => {
        console.log(result.data.user);
        setCartDetails(result.data);
        setOrderRequest({ ...orderRequest, cartID: result.data.cartId });
        setCartItem(result.data.items);
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(orderRequest.cartID);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  // this function navigates to each item
  const productDetails = (cartItem) => {
    console.log(cartItem);

    navigate(`/productView/${cartItem?.productId}`, {
      state: { product: cartItem },
    });
  };

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
          if (order.paymentStatus === "PAID") {
            setProgress(25);
            paidOrders++;
          } else if (order.paymentStatus === "NOT PAID") {
            notPaidOrders++;
            setProgress(0);
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
    loadChatHistory();
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

  console.log(orderRequest.cartID);
  const handleAddress = (e) => {
    setOrderRequest({
      ...orderRequest,
      address: e.target.value,
    });
  };

  const [visibleInput, setVisibleInput] = useState(() => {
    const savedInput = sessionStorage.getItem("visibleInput");
    return savedInput ? JSON.parse(savedInput) : true; // Use JSON.parse to get the boolean value
  });

  const handleInput = (newVisibleInput) => {
    // Store the new input value as a string
    sessionStorage.setItem("visibleInput", JSON.stringify(newVisibleInput));

    // Retrieve the stored input
    const storedInput = sessionStorage.getItem("visibleInput");

    // Update the state by parsing the stored value and comparing it
    if (JSON.parse(storedInput) === newVisibleInput) {
      setVisibleInput(newVisibleInput);
    }
  };
  const handleAddressInput = () => {
    if (orderRequest.address.trim()) {
      Toastify.showSuccessMessage("Address details saved.");
      setVisibleInput(false);
    } else {
      Toastify.showErrorMessage("Please Fill The Address");
    }
  };
  const handlePlaceOrder = () => {
    if (orderRequest.address.trim() && orderRequest.cartID) {
      OrderService.placeOrder(orderRequest)
        .then((res) => {
          console.log(res.data);
          setPayment((prev) => ({
            ...prev,
            user_order_id: res.data?.orderId || 0,
          }));
          console.log(payment.user_order_id);
          // setVisibleInput(!visibleInput)
        })
        .catch((err) => {
          console.error("Error response:", err.response);
          Toastify.showErrorMessage(
            `Something went wrong while initiating Payment ${err.response.data.message} , we are  placing the order, You Can Finish The Payment In OrderInfo `
          );
        });
    } else {
      Toastify.showErrorMessage("Please enter a valid address.");
    }
    fetchOrderDetails();
  };
  const [paymentImage, setPaymentImage] = useState("");
  const [payMethod, setPayMethods] = useState({
    payMethod: "",
  });

  const handlePayments = (e) => {
    setPayMethods({
      ...payMethod,
      payMethod: e.target.value,
    });
  };

  useEffect(() => {
    if (payMethod.payMethod === "GPay") {
      setPaymentImage(Gpay || "");
    } else if (payMethod.payMethod === "PhonePay") {
      setPaymentImage(phonePay || "");
    } else if (payMethod.payMethod === "Credit/Debit") {
      setPaymentImage(card || "");
    } else if (payMethod.payMethod === "COD") {
      setPaymentImage(cash || "");
    } else {
      setPaymentImage("");
    }
  }, [payMethod.payMethod]);
  console.log(payMethod);

  const [codPrice, setCodPrice] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  // Function to handle payment initiation
  const handlePaymentInitiate = (price) => {
    handlePlaceOrder();
    PaymentService.paymentInitiate(price)
      .then((res) => {
        if (res.data) {
          Toastify.showSuccessMessage("Payment Initiated");
          console.log(res.data);

          setPayment((prevStatus) => ({
            ...prevStatus,
            razorpay_order_id: res.data?.orderId || "",
          }));
          console.log(payment.razorpay_order_id);

          Toastify.showSuccessMessage("Please Wait For Response");
          // Open the modal after 2 seconds
          setTimeout(() => {
            if (payMethod.payMethod === "COD") {
              setShowConfetti(true);
              setCodPrice(price);
              setTimeout(() => {
                setShowConfetti(false);
                handleNavigation(0);
                fetchOrderDetails();
                fetchCartDetails();
              }, 10000);
              Toastify.showSuccessMessage(`Thank You For Shopping in Eshop !`);
            }
            setIsModalOpen(!isModalOpen);
          }, 2000);
        } else {
          Toastify.showErrorMessage("No payment details received.");
        }
      })
      .catch((err) => {
        console.error(err);
        Toastify.showErrorMessage(
          `Check Your Connection , Payment Not Initiated : Price: ${price}, Method: ${payMethod.payMethod}`
        );
      });
  };

  const [buttonColor, setButtonColor] = useState("");
  const handleChange = (e) => {
    console.log(`Field ${e.target.name} updated to: ${e.target.value}`);
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    const {
      razorpay_signature,
      user_order_id,
      razorpay_order_id,
      razorpay_payment_id,
    } = payment;

    if (
      razorpay_signature &&
      user_order_id &&
      razorpay_order_id &&
      razorpay_payment_id
    ) {
      setButtonColor("green");
    } else {
      setButtonColor("");
    }
  }, [payment]);

  const handlePaymentSuccess = (e) => {
    e.preventDefault();
    const {
      razorpay_signature,
      user_order_id,
      razorpay_order_id,
      razorpay_payment_id,
    } = payment;

    console.log("Payment details:", payment);

    // Check if any required field is missing
    if (
      !razorpay_signature ||
      !user_order_id ||
      !razorpay_order_id ||
      !razorpay_payment_id
    ) {
      console.error("Missing payment details");
      Toastify.showErrorMessage("Please fill in all payment details");
      return;
    }
    if (
      razorpay_order_id ||
      user_order_id ||
      razorpay_signature ||
      razorpay_payment_id
    ) {
    }

    // Proceed with the payment success
    PaymentService.paymentSuccess(payment)
      .then((res) => {
        setShowConfetti(true); // Show confetti
        setTimeout(() => setShowConfetti(false), 5000);
        Toastify.showSuccessMessage(`Payment Completed`);

        setTimeout(() => {
          window.location.href = "/UserDashBoard";
          handleNavigation(0);
          fetchOrderDetails();
          handleWishlist();
          fetchCartDetails();
        }, 6000);
        setPayment({
          razorpay_signature: "",
          user_order_id: "",
          razorpay_order_id: "",
          razorpay_payment_id: "",
        });
      })
      .catch((err) => {
        Toastify.showErrorMessage("Payment Failed");
      });
  };
  console.log(wishlistproducts);
  const handelPlaceOrder = () => {
    if (cartDetails?.totalPrice !== 0) {
      handleNavigation(2);
    } else {
      Toastify.showErrorMessage("Add item To Place Order");
    }
  };

  const [orderData, setOrderData] = useState(null);
  const [orderProduct, setOrderProduct] = useState([]);

  const fetchOrderById = (id) => {
    OrderService.fetchOrderById(id)
      .then((res) => {
        console.log("orderProduct", res.data.item);
        setOrderProduct(res.data.item);
        setOrderData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(orderData, orderProduct);
  const [UserMessage, setUserMessage] = useState({
    message: "",
  });
  const handleMessageInput = (e) => {
    const { name, value } = e.target;
    setUserMessage((prev) => ({ ...prev, [name]: value }));
  };
  console.log(UserMessage.message);
  const [chats, setChats] = useState([]);
  const loadChatHistory = () => {
    ChatBotService.getChats()
      .then((res) => {
        console.log(res.data);
        setChats(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createChat = (UserMessage) => {
    ChatBotService.createChat(UserMessage)
      .then((res) => {
        console.log(res.data);
        loadChatHistory();
        setUserMessage({
        message:""
        });
      })
      .catch((err) => {
        console.log(err);
        Toastify.showErrorMessage("Chat Not Started");
      });
  };

  const clearChat=()=>{
    ChatBotService.clearChat().then((res)=>{
      Toastify.showSuccessMessage("Chats Deleted Successfully")
      }).catch((err)=>{
        console.log(err);
        
        })
    }
// Function to automatically scroll to the bottom when content is updated
const autoScrollOnUpdate = () => {
    const chatContainer = document.querySelector(".chat-container");

    // Check if chatContainer exists to avoid errors
    if (!chatContainer) return;

    // Create a MutationObserver to watch for new messages being added
    const observer = new MutationObserver(() => {
        // Scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });

    // Start observing the chat container for changes (e.g., new child elements added)
    observer.observe(chatContainer, {
        childList: true,   // Watch for added/removed child nodes
        subtree: true,     // Observe all descendants of the container
    });
};

// Initialize auto-scrolling by calling the function
autoScrollOnUpdate();

  return (
    <div className="user-dashboard">
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

      <div className="userHeader">
        <h2>
          <i id="cartIcon" className="fas fa-shopping-cart">
            {" "}
            Eshop.in{" "}
          </i>
        </h2>
        <div className="userHeaderItems">
          <div className="cart-controls">
            <i
              id="cartIcon"
              className="fas fa-shopping-cart"
              onClick={handleAddToCartNavigation}
            >
              <sup className="cart-count">{cartCount}</sup>
            </i>
            &nbsp;
            <i onClick={handleWishlistNavigation} className="fas fa-heart">
              <sup className="cart-count">{wishListCount}</sup>
            </i>
            &nbsp;&nbsp;&nbsp;
            <i id="toggle-btn" variant="dark" onClick={handleShow}>
              <h6>
                <i
                  style={{ fontSize: "2rem", padding: "2px" }}
                  className="fas fa-bars"
                ></i>
              </h6>
            </i>
          </div>

          <Offcanvas
            show={show}
            onHide={handleClose}
            className="custom-offcanvas"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                <i id="offcanvas-i" className="fas fa-user"></i>
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
                      {" "}
                      <i className="fas fa-user"></i>&nbsp;Account
                    </a>
                  </li>
                  <li>
                    <a href="/UserSignIn">
                      {" "}
                      <i className="fas fa-sign-in-alt"></i>&nbsp;&nbsp;SignIn
                    </a>
                  </li>
                  <li>
                    <a href="/">
                      {" "}
                      <i className="fas fa-store"></i>&nbsp;&nbsp;Store
                    </a>
                  </li>
                  <li>
                    <a href="/AdminDashBoard">
                      {" "}
                      <i className="fas fa-handshake"></i>&nbsp;&nbsp;E-Shop
                      Seller
                    </a>
                  </li>
                  <li onClick={handleLogout}>
                    <a href="/AdminDashBoard">
                      {" "}
                      <i className="fas fa-sign-out-alt"></i>&nbsp;Logout
                    </a>
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
                      {" "}
                      <i className="fas fa-store"></i>&nbsp;&nbsp;Store
                    </a>
                  </li>
                  <li>
                    <a href="/AdminDashBoard">
                      <i className="fas fa-handshake"></i>&nbsp;&nbsp;E-Shop
                      Seller
                    </a>
                  </li>
                  <li>
                    <a href="/Product">
                      <i className="fas fa-handshake"></i>&nbsp;&nbsp;Product
                    </a>
                  </li>
                </ul>
              )}
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </div>

      <div id="main-container" class="main-container mt-3">
        {NavigationCount === 0 && (
          <div id="main-div" class="bg-white border">
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
            <div class="d-flex my-4">
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
              <div
                id="flicker"
                className="flick"
                class="box me-4 my-1 bg-light"
              >
                <img
                  src="https://www.freepnglogos.com/uploads/shopping-cart-png/shopping-cart-campus-recreation-university-nebraska-lincoln-30.png"
                  alt=""
                />
                <div className="d-flex align-items-center mt-1">
                  <div className="tag">Items in Cart</div>
                  <div className="ms-auto number">{cartCount || 0}</div>
                </div>
              </div>
              <div class="box me-4 my-1 bg-light">
                <img
                  src="https://www.freepnglogos.com/uploads/love-png/love-png-heart-symbol-wikipedia-11.png"
                  alt=""
                />
                <div class="d-flex align-items-center mt-2">
                  <div class="tag">Wishlist</div>
                  <div class="ms-auto number">{wishListCount || 0}</div>
                </div>
              </div>
            </div>
            <div class="text-uppercase">My recent orders</div>
            <div id="order-list">
              {orderDetails.map((order) => {
                return (
                  <div class="order my-3 bg-light" key={order.orderId}>
                    <div class="row">
                      <div class="col-lg-4">
                        <div class="d-flex flex-column justify-content-between order-summary">
                          <div class="d-flex align-items-center">
                            <div class="text-uppercase">
                              Order #ESP1000
                              <span style={{ color: "red", fontWeight: "900" }}>
                                {order.orderId}
                              </span>
                            </div>
                            <div
                              class={
                                order.paymentStatus === "PAID"
                                  ? `blue-label ms-auto text-uppercase`
                                  : `red-label ms-auto text-uppercase`
                              }
                            >
                              {order.paymentStatus}
                            </div>
                          </div>
                          <div class="fs-8">
                            Products #
                            <span style={{ color: "green", fontWeight: "900" }}>
                              {order.item.length}
                            </span>
                          </div>
                          <div class="fs-8">
                            {order.orderCreated} | 12:05 PM
                          </div>
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
                          <div
                            id="order-info-btn"
                            onClick={() => {
                              fetchOrderById(order.orderId);
                              handleNavigation(7);
                            }}
                            class="btn btn-primary text-uppercase"
                          >
                            order info
                          </div>
                        </div>
                        <div className="progressbar-track">
                          <ul className="progressbar">
                            <li
                              id="step-1"
                              className={
                                progress > 0
                                  ? "text-muted success"
                                  : "text-muted green"
                              }
                            >
                              <span className="fas fa-gift"></span>
                            </li>
                            <li
                              id="step-2"
                              className={
                                progress >= 25
                                  ? "text-muted success"
                                  : "text-muted green"
                              }
                            >
                              <span className="fas fa-check"></span>
                            </li>
                            <li
                              id="step-3"
                              className={
                                progress >= 50
                                  ? "text-muted success"
                                  : "text-muted green"
                              }
                            >
                              <span className="fas fa-box"></span>
                            </li>
                            <li
                              id="step-4"
                              className={
                                progress >= 75
                                  ? "text-muted success"
                                  : "text-muted green"
                              }
                            >
                              <span className="fas fa-truck"></span>
                            </li>
                            <li
                              id="step-5"
                              className={
                                progress === 100
                                  ? "text-muted delivered"
                                  : "text-muted green"
                              }
                            >
                              <span className="fas fa-box-open"></span>
                            </li>
                          </ul>
                          <div
                            id="tracker"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          deleteOrder(order.orderId);
                        }}
                        id="cancelOrder"
                        class="btn btn-danger"
                      >
                        Cancel
                      </div>
                    </div>
                    {/*<button onClick={increaseProgress} className="progress-button">click</button>*/}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {NavigationCount === 7 && (
          <div className="orders-details">
            <h3>
              <span>Order-Info</span>
              <button id="completePayment">Complete Payment</button>
            </h3>
            <div className="main-tab">
              <ul className="order-info-tab">
                <li>
                  Billing Address :{" "}
                  <span style={{ color: "green" }}>
                    {orderData?.billingAddress || "Billing Address"}
                  </span>
                </li>
                <li>
                  Order Created Date :{" "}
                  <span style={{ color: "green" }}>
                    {" "}
                    {orderData?.orderCreated || "Order Created"}
                  </span>
                </li>
                <li>
                  Order Amount :
                  <span style={{ color: "green" }}>
                    {" "}
                    {orderData?.orderAmout || "Order Amount "}
                  </span>
                </li>

                <li>
                  Payment Status :
                  <span style={{ color: "green" }}>
                    {" "}
                    {orderData?.paymentStatus || "Payment Status"}
                  </span>
                </li>
                <li>
                  Order Delivered :
                  <span style={{ color: "green" }}>
                    {" "}
                    {orderData?.orderDelivered || "Order Delivered"}
                  </span>
                </li>
                <li>
                  No Of Items :
                  <span style={{ color: "green" }}>
                    {" "}
                    {orderProduct.length || 0}
                  </span>
                </li>
                <li></li>
              </ul>
              <ul className="order-wrapper">
                <li className="Itemstitle"> Items </li>
                {orderProduct?.map((orderItem) => {
                  return (
                    <li id="order-record" key={orderItem.product.productId}>
                      <a class="text-decoration-none d-flex align-items-start">
                        <img
                          id="order-img"
                          src={
                            getImageUrl(orderItem.product.imageNames[0]) ||
                            iphone12
                          }
                        ></img>
                        <div class="d-flex flex-column">
                          <div class="link">
                            {orderItem.product.productName}
                          </div>
                          <div class="link-desc">
                            Price : {orderItem.product.productPrize}
                          </div>
                          <div class="link-desc">
                            Quantity : {orderItem.product.productQuantity}
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="progressbar-track">
              <ul className="progressbar">
                <li id="step-1" className="text-muted success">
                  <span className="fas fa-gift"></span>
                </li>
                <li
                  id="step-2"
                  className={
                    orderData?.orderStatus === "NOT PAID"
                      ? "text-muted success"
                      : "text-muted green"
                  }
                  style={{
                    color:
                      orderData?.orderStatus !== "Created" ? "red" : "green",
                  }}
                >
                  <span className="fas fa-check"></span>
                </li>
                <li id="step-3" className="text-muted success">
                  <span className="fas fa-box"></span>
                </li>
                <li id="step-4" className="text-muted success">
                  <span className="fas fa-truck"></span>
                </li>
                <li id="step-5" className="text-muted success">
                  <span className="fas fa-box-open"></span>
                </li>
              </ul>
              <div id="tracker" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
        {NavigationCount === 1 && (
          <div className="Cart-orders">
            <ul className="cartItem">
              <h3>Cart Orders (#{cartCount || 0})</h3>
              {cartItems.length > 0 ? (
                cartItems.map((cartItem, index) => {
                  return (
                    <li className="record">
                      <a
                        onClick={() => productDetails(cartItem.product)}
                        key={cartItem.id || index}
                        className="text-decoration-none d-flex align-items-start"
                      >
                        <img
                          style={{
                            height: "80px",
                            width: "60px",
                            margin: "auto 5px",
                            objectFit: "cover",
                          }}
                          src={getImageUrl(cartItem.product.imageNames[0])}
                          alt={cartItem.product.productName || "Product"}
                          onError={(e) => {
                            e.target.src = cartItemIcon; // Fixed syntax error
                          }}
                        />
                        <div className="d-flex flex-column">
                          <div className="link">
                            {cartItem?.product.productName} <br />
                          </div>

                          <div className="link">
                            {cartItem?.product.productDesc.slice(0, 150)}...{" "}
                            <br />
                          </div>

                          <div className="link-desc">
                            Price: ₹{" "}
                            {cartItem?.totalPrice.toLocaleString("en-IN")}{" "}
                            (Quantity: {cartItem.quantity})
                          </div>
                        </div>
                      </a>
                      <button
                        onClick={() => {
                          handleRemoveCartItem(cartItem.product.productId);
                        }}
                      >
                        Remove Item
                      </button>
                    </li>
                  );
                })
              ) : (
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    fontWeight: "800",
                  }}
                >
                  No Items In Cart ... 😁
                </li>
              )}
            </ul>
            <li id="totalAmount">
              <a class="text-decoration-none d-flex align-items-start">
                <div class="d-flex flex-column">
                  <div class="link-desc">
                    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                  </div>

                  <div class="link">
                    <div class="fas fa-coins pt-2 me-3"></div>
                    <h4 style={{ color: "green" }}>
                      Total Price: ₹{" "}
                      {cartDetails?.totalPrice?.toLocaleString("en-In") || 0}
                    </h4>
                  </div>
                  <div class="link-desc">
                    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                  </div>
                </div>
              </a>
              <button onClick={handelPlaceOrder}> Place Order</button>
            </li>
          </div>
        )}
        {NavigationCount === 3 && (
          <div className="wishlist">
            <h3 id="wishlist-title">Wishlist (# {wishListCount})</h3>
            <div className="wishlistProducts">
              {wishlistproducts && wishlistproducts.length > 0 ? (
                wishlistproducts?.map((item, index) => (
                  <div
                    id="wishListcard"
                    style={{ height: "10px" }}
                    className="card"
                    key={item.product.productId}
                  >
                    <div className="card-buttons">
                      <button
                        className="card-button"
                        onClick={() =>
                          handleToggleWishlistMethods(item?.product.productId)
                        }
                      >
                        <i
                          className="fas fa-heart"
                          style={{
                            color: wishListStatus[item?.product.productId]
                              ? "red"
                              : "black",
                          }} // Change color based on currentStatus
                        ></i>
                      </button>
                    </div>
                    <img
                      onClick={() =>
                        navigate(`/productView/${item.product.productId}`, {
                          state: { product: item.product },
                        })
                      }
                      src={getImageUrl(
                        item?.product.imageNames[0],
                        item?.product.productId
                      )}
                      alt={item?.product.productName || "Product"}
                      onError={(e) => {
                        e.target.src = iphone12; // Ensure iphone12 is defined/imported
                      }}
                    />
                    <div
                      onClick={() =>
                        navigate(`/productView/${item.product.productId}`, {
                          state: { product: item.product },
                        })
                      }
                      className="card-content"
                    >
                      {item?.product.live && <span className="live">Live</span>}
                      <h2 className="card-title">
                        {item?.product.productName || "Product Name"}
                      </h2>
                      <p className="card-description">
                        {item?.product.productDesc?.slice(0, 50) ||
                          "No description available"}
                        ..
                      </p>
                      <div className="price">
                        <span id="mrp">
                          MRP: ₹
                          {((110 / 100) * (item?.product.productPrize || 0))
                            .toFixed(2)
                            .toLocaleString("en-IN")}
                        </span>
                        <br />
                        <p className="card-price">
                          ₹
                          {item?.product.productPrize
                            ? item?.product.productPrize.toLocaleString("en-IN")
                            : "N/A"}
                        </p>
                        <p id="discountTag" style={{ color: "green" }}>
                          10% off
                        </p>
                      </div>
                      <span style={{ color: "red" }}>
                        {item?.product.stock > 0 ? "" : "Out Of Stock"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products in your wishlist.</p>
              )}
            </div>
          </div>
        )}

        {NavigationCount === 4 && (
          <div className="profile">
            <div id="profile-top">
              <h2>Profile</h2>
              <span id="acc-created">
                Account Created Date : {currentUser.date.slice(0, 10)}
              </span>
            </div>

            <div className="profile-details">
              <img src={userImage}></img>
              <div className="box">
                <label>
                  Name
                  <button>
                    <i class="fas fa-check"></i>
                  </button>
                </label>
                <div className="details">
                  <h5>
                    {" "}
                    Name :
                    <span> {currentUser?.name && " Madhu Damodhar "}</span>{" "}
                  </h5>
                  <h5>
                    {" "}
                    Address : <span>{currentUser.address}</span>{" "}
                  </h5>
                  <h5>
                    {" "}
                    Gender : <span>{currentUser.gender}</span>
                  </h5>
                  <h5>
                    {" "}
                    Phone :<span> {currentUser.phone}</span>{" "}
                  </h5>
                  <h5>
                    {" "}
                    Email : <span>{currentUser.email}</span>{" "}
                  </h5>
                  <h5>
                    {" "}
                    About : <span>"{currentUser.about}"</span>
                  </h5>
                  <h5>
                    {" "}
                    Account Created Date :
                    <span> {currentUser.date.slice(0, 10)}</span>
                  </h5>
                </div>
              </div>
            </div>

            <div className="user-credentials">
              {/* update code  */}
              <h2> In Progress ... 😁 </h2>
            </div>
          </div>
        )}
        {NavigationCount === 2 && (
          <div className="BillingPage">
            <h3>Billing </h3>
            <div className="Billing-Address">
              <span>
                {visibleInput
                  ? "Please Provide Your Billing Address"
                  : "Delivering  Address"}
              </span>
              {visibleInput ? (
                <textarea
                  className="addressInput"
                  cols={60}
                  rows={3}
                  name="address"
                  autoComplete="off"
                  value={orderRequest.address}
                  type="text"
                  onChange={handleAddress}
                  placeholder="Enter your address..."
                />
              ) : (
                <div className="input">
                  <span>{orderRequest.address}</span>
                  <i
                    style={{ color: "green" }}
                    onClick={() => {
                      handleInput(true);
                    }}
                    class="fas fa-edit"
                  ></i>
                </div>
              )}
              <div
                style={{
                  visibility: visibleInput ? "visible " : "hidden",
                }}
                className="address-btns"
              >
                <button
                  onClick={() => {
                    handleAddressInput();
                  }}
                >
                  Save
                </button>
                <button>Back</button>
              </div>
            </div>

            <div className="payments">
              <span>Payment Method</span>
              <ul>
                <li>
                  <input
                    onChange={handlePayments}
                    name="payMethod"
                    value="GPay"
                    type="radio"
                  />
                  <i className="fab fa-google"></i> Pay
                </li>
                <li>
                  <input
                    onChange={handlePayments}
                    name="payMethod"
                    value="PhonePay"
                    type="radio"
                  />{" "}
                  <i className="fas fa-mobile-alt"></i> &nbsp;Phone Pay
                </li>
                <li>
                  <input
                    onChange={handlePayments}
                    name="payMethod"
                    value="Credit/Debit"
                    type="radio"
                  />{" "}
                  <i className="fas fa-credit-card"></i>
                  &nbsp;Credit/Debit
                </li>
                <li>
                  <input
                    onChange={handlePayments}
                    name="payMethod"
                    value="COD"
                    type="radio"
                  />
                  <i style={{ color: "black" }} className="fas fa-coins"></i>{" "}
                  Cash On Delivery
                </li>
              </ul>
              <div className="payment-total">
                <h4>
                  Total Amount :{" "}
                  <span>
                    ₹{" "}
                    {cartDetails?.totalPrice?.toLocaleString("en-IN") ||
                      "Total Price"}
                  </span>
                </h4>
                <button
                  onClick={() => {
                    handlePaymentInitiate(
                      cartDetails.totalPrice ? cartDetails.totalPrice : 0
                    );
                  }}
                  variant="dark"
                >
                  Initiate Payment
                </button>
              </div>
            </div>
          </div>
        )}
        {NavigationCount === 6 && (
          <div className="Chat">
            <div id="chat-top">
              <h2>Help & Support</h2>
              <button onClick={clearChat} id="clearChat">clear chats</button>
            </div>

            <div className="chatRoom">
              <div className="chat-container">
                {chats.map((chat) => {
                  return (
                    <ul className="responses" key={chat.id}>
                      <li className="user-message">
                        {chat.message ? chat.message : UserMessage.message}
                      </li>
                      <li className="response">
                        {chat.response ? chat.response : "Loading . . ."}
                      </li>
                    </ul>
                  );
                })}
              </div>
              <div className="bottom-section">
                <ul className="ready-inputs">
                  {supportTickets.map((ticket) => {
                    return (
                      <li
                        onClick={() => {
                          setUserMessage((prevState) => ({
                            ...prevState,
                            message: ticket.complaint, // Correctly update the 'message' field
                          }));
                          createChat({
                            ...UserMessage,
                            message: ticket.complaint,
                          }); // Pass the updated message to createChat
                        }}
                        className="tickets"
                      >
                        {ticket.complaint}
                      </li>
                    );
                  })}
                </ul>
                <div className="inputs">
                  <input
                    type="text"
                    name="message"
                    value={UserMessage.message}
                    placeholder="Enter Your Message . . ."
                    onChange={(e) => {
                      handleMessageInput(e);
                    }}
                    autoComplete="off"
                  ></input>{" "}
                  <button
                    onClick={() => {
                      createChat(UserMessage);
                    }}
                  >
                    send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="parent">
          {/*<button className="open-modal-btn" onClick={openModal}>
    Open Invoice Modal
  </button>
*/}

          {isModalOpen && (
            <div className="modal-overlay">
              {showConfetti && (
                <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  gravity={1} // Increase to make it fall faster
                  wind={0.1} // Add horizontal movement
                  numberOfPieces={200}
                />
              )}
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                  <img
                    className="modal-avatar"
                    src={paymentImage}
                    alt="Phone Pay Logo"
                  />
                  <h3 className="modal-title">
                    Payment Using {payMethod.payMethod || "PayMethod"}.
                  </h3>
                  <div className="modal-subtitle">
                    Order: #ESP1000
                    <span style={{ color: "red", fontWeight: "900" }}>
                      {payment?.user_order_id || ""}
                    </span>
                    <br />
                    <span>Delivering To {orderRequest.address}</span>
                  </div>
                </header>
                <div className="modal-body">
                  {payMethod.payMethod === "COD" ? (
                    <>
                      <h1>
                        <img
                          style={{
                            height: "100px",
                            backgroundColor: "transparent",
                          }}
                          src={successCod}
                        />
                      </h1>
                      <h1>Order Placed</h1>
                      <div className="Cod-details">
                        <h6>
                          Total Price:{" "}
                          <span style={{ fontWeight: "900" }}>
                            {" "}
                            ₹{" "}
                            {cartDetails?.totalPrice?.toLocaleString("en-In") ||
                              0}
                          </span>{" "}
                          .
                        </h6>
                        <span>
                          * * * Thank you for your order! Explore more products
                          and shop again with us! * * *
                        </span>
                      </div>
                    </>
                  ) : (
                    <form
                      onSubmit={handlePaymentSuccess}
                      className="modal-form"
                    >
                      <div className="input-group">
                        <input
                          name="razorpay_order_id"
                          value={payment.razorpay_order_id}
                          style={{ borderRadius: "4px" }}
                          onChange={handleChange}
                          className="modal-input cardHolder"
                          type="text"
                          placeholder="RAZORPAY_ORDER_ID"
                          aria-label="Razorpay Order ID"
                        />
                        <input
                          style={{ borderRadius: "4px" }}
                          onChange={handleChange}
                          name="razorpay_signature"
                          value={payment.razorpay_signature}
                          className="modal-input cardHolder"
                          type="text"
                          placeholder={
                            payMethod.payMethod === "Credit/Debit"
                              ? "CARD HOLDER NAME"
                              : " NAME"
                          }
                          aria-label="Razorpay Signature"
                        />
                        <input
                          style={{ borderRadius: "4px" }}
                          onChange={handleChange}
                          name="razorpay_payment_id"
                          value={payment.razorpay_payment_id}
                          className="modal-input card-No"
                          type="text"
                          placeholder={
                            payMethod.payMethod === "Credit/Debit"
                              ? " CARD NO : XXXX  XXXX  XXXX"
                              : "UPI ID"
                          }
                          aria-label="Razorpay Payment ID"
                        />
                        {payMethod.payMethod === "Credit/Debit" && (
                          <div className="card-cvv-exp">
                            <input
                              style={{ borderRadius: "4px" }}
                              onChange={handleChange}
                              className="modal-input modal-expiry"
                              type="text"
                              placeholder="MM/YY"
                              aria-label="Expiration"
                            />
                            <input
                              className="modal-input modal-cvc"
                              type="text"
                              placeholder="CVC"
                              aria-label="CVC"
                            />
                          </div>
                        )}
                      </div>

                      <div className="modal-amount">
                        Total Price:
                        <span style={{ fontWeight: "900" }}>
                          ₹{" "}
                          {cartDetails?.totalPrice?.toLocaleString("en-IN") ||
                            "Total Price"}
                        </span>
                      </div>
                      <button
                        style={{ background: buttonColor ? buttonColor : "" }}
                        className="modal-button"
                        type="submit"
                      >
                        Pay Now
                      </button>
                    </form>
                  )}
                </div>
                <button className="modal-close-btn" onClick={closeModal}>
                  X
                </button>
              </div>
            </div>
          )}
        </div>
        <div id="wrapper" class=" col-lg-3 my-lg-0 my-md-1">
          <div id="sidebar">
            <div class="h4 text-black ">Account</div>
            <ul>
              <li
                onClick={() => {
                  handleNavigation(0);
                }}
              >
                <a class="text-decoration-none d-flex align-items-start">
                  <div
                    style={{ color: NavigationCount === 0 ? "red" : "black" }}
                    class="fas fa-box-open pt-2 me-3"
                  ></div>
                  <div id="links" class="d-flex flex-column">
                    <div class="link">My Orders</div>
                    <div id="link-desc" class="link-desc">
                      View & Manage orders and returns
                    </div>
                  </div>
                </a>
              </li>
              <li
                onClick={() => {
                  handleNavigation(1);
                }}
              >
                <a class="text-decoration-none d-flex align-items-start">
                  <div
                    style={{ color: NavigationCount === 1 ? "red" : "black" }}
                    class="fas fa-shopping-cart pt-2 me-3"
                  ></div>
                  <div class="d-flex flex-column">
                    <div id="links" class="link">
                      My Cart ( #{cartCount || 0} )
                    </div>
                    <div id="link-desc" class="link-desc">
                      View & Manage Cart orders
                    </div>
                  </div>
                </a>
              </li>
              <li
                onClick={() => {
                  handleNavigation(3);
                }}
              >
                <a class="text-decoration-none d-flex align-items-start">
                  <div
                    style={{ color: NavigationCount === 3 ? "red" : "black" }}
                    class="fas fa-heart pt-2 me-3"
                  ></div>
                  <div class="d-flex flex-column">
                    <div id="links" class="link">
                      WishList (# {wishListCount})
                    </div>
                    <div id="link-desc" class="link-desc">
                      View & Manage Wishlist Orders
                    </div>
                  </div>
                </a>
              </li>
              <li
                onClick={() => {
                  handleNavigation(4);
                }}
              >
                <a class="text-decoration-none d-flex align-items-start">
                  <div
                    style={{ color: NavigationCount === 4 ? "red" : "black" }}
                    class="fas fa-user pt-2 me-3"
                  ></div>
                  <div class="d-flex flex-column">
                    <div id="links" class="link">
                      My Profile
                    </div>
                    <div id="link-desc" class="link-desc">
                      Change your profile details & password
                    </div>
                  </div>
                </a>
              </li>
              <li
                onClick={() => {
                  handleNavigation(6);
                }}
              >
                <a class="text-decoration-none d-flex align-items-start">
                  <div
                    style={{ color: NavigationCount === 6 ? "red" : "black" }}
                    class="fas fa-headset pt-2 me-3"
                  ></div>

                  <div id="links" class="d-flex flex-column">
                    <div class="link">Help & Support</div>
                    <div id="link-desc" class="link-desc">
                      Contact Us for help and support
                    </div>
                  </div>
                </a>
              </li>

              <li id="links" className="logout-li">
                <button
                  class=" btn btn-dark"
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
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
