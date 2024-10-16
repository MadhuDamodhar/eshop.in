import React, { useEffect, useState ,useContext} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Product.css";
import Confetti from "react-confetti";
import { BASE_URL } from "../Service/axios-helper";
import { Button } from "react-bootstrap";
import Card from "../Card/Card";
import CartService from "../Service/CartService";
import Toastify from "../ToastNotify/Toastify";
import OrderService from "../Service/OrderService";
import PaymentService from "../Service/PaymentService";
import { Context } from "../Context";
import cartItemIcon from "../UserDashboard/cartItem.gif";
import Gpay from '../ProductDetalis/google-pay.png'
import card from '../ProductDetalis/card.gif'
import cash from '../ProductDetalis/cash.gif'
import phonePay from '../ProductDetalis/phonepay.png'
import successCod from '../ProductDetalis/success.gif'
function Product() {
  const [disable, setDisable] = useState(true);
  const [flag , setFlag] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () =>{ 
    setIsModalOpen(false)
  window.location.reload();
  };

  const [count, setCount] = useState(0);
  const { cartDetails, cartItems, cartCount  } = useContext(Context);
  const [orderRequest, setOrderRequest] = useState({
    cartID: "",
    address: "",
  });
// State to hold payment details
const [payment, setPayment] = useState({
  razorpay_signature: '',
  user_order_id: '',
  razorpay_order_id: '',
  razorpay_payment_id: '',
});

  useEffect(() => {
    if (cartDetails && cartDetails.cartId) {  
      setOrderRequest(prev => ({
        ...prev,
        cartID: cartDetails.cartId,
      }));
    }
  }, [cartDetails]); 
  
  console.log(orderRequest.cartID);
  

  const getImageUrl = (imageName) => {
    return `${BASE_URL}/product/products/images/${imageName}`;
  };

  const handleRemoveCartItem = (cartItemId) => {
    CartService.removeCartItem(cartItemId)
      .then((res) => {
        Toastify.showSuccessMessage("Item Removed");
       
        setTimeout(() => {
         // navigate("/UserDashBoard")
         setFlag(!flag)
          setCartItemDetails(null); 
          window.location.reload();    
          // Prevents storing previous state  navigate(, { replace: true });
        }, 2000);
      })
      .catch((err) => {
        Toastify.showErrorMessage("Something Went Wrong: " + err);
      });
  };

  const handleAddress = (e) => {
    setOrderRequest({
      ...orderRequest,
      address: e.target.value,
    });
  };

  const handlePlaceOrder = () => {
    if (orderRequest.address.trim()) {
      OrderService.placeOrder(orderRequest)
        .then((res) => {
          console.log(res.data);
          setPayment((prev) => ({
            ...prev,
            user_order_id: res.data?.orderId || 0
          }));
          console.log(payment.user_order_id);
          
          Toastify.showSuccessMessage("Address details saved.");
          setTimeout(() => {
           setCount(count+1)
          }, 2000);
        })
        .catch((err) => {
          console.error("Error response:", err.response);
          Toastify.showErrorMessage(
            "Something went wrong while placing the order: " +
              err.response.data.message
          );
        });
    } else {
      Toastify.showErrorMessage("Please enter a valid address.");
    }
  };
 const [paymentImage , setPaymentImage]=useState('')
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
  if (payMethod.payMethod === 'GPay') {
    setPaymentImage(Gpay || '');
  } else if (payMethod.payMethod === 'PhonePay') {
    setPaymentImage(phonePay || '');
  } else if (payMethod.payMethod === 'Credit/Debit') {
    setPaymentImage(card || '');
  } else if (payMethod.payMethod === 'COD') {
    setPaymentImage(cash || '');
  } else {
    setPaymentImage('');
  }
}, [payMethod.payMethod]);
  console.log(payMethod);

// State to control the confetti display
const [showConfetti, setShowConfetti] = useState(false);



// Function to handle payment initiation
const handlePaymentInitiate = (price) => {
  PaymentService.paymentInitiate(price)
    .then((res) => {
      if (res.data) {
        Toastify.showSuccessMessage("Payment Initiated");
        console.log(res.data);
       
        setPayment((prevStatus) => ({
          ...prevStatus,
          razorpay_order_id: res.data?.orderId || '',
        }));
             console.log(payment.razorpay_order_id);

        // Open the modal after 2 seconds
        setTimeout(() => {
          if(payMethod.payMethod === 'COD'){
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 10000); 
            Toastify.showSuccessMessage(`Thank You For Shopping in Eshop !`);
            setTimeout(()=>{
              window.location.href = '/UserDashBoard';
            } , 10000)
          }
          setIsModalOpen(!isModalOpen);
        }, 2000); 
      } else {
        Toastify.showErrorMessage("No payment details received.");
      }
    })
    .catch((err) => {
      console.error(err);
      Toastify.showErrorMessage(`Check Your Connection , Payment Not Initiated : Price: ${price}, Method: ${payMethod.payMethod}`);
    });
};

const [buttonColor, setButtonColor] = useState('');
const handleChange = (e) => {
  console.log(`Field ${e.target.name} updated to: ${e.target.value}`);
  setPayment({
    ...payment,
    [e.target.name]: e.target.value, 
  });
};
useEffect(() => {
  const { razorpay_signature, user_order_id, razorpay_order_id, razorpay_payment_id } = payment;


  if (razorpay_signature && user_order_id && razorpay_order_id && razorpay_payment_id) {
    setButtonColor('green'); 
  } else {
    setButtonColor('');
  }
}, [payment]);

const handlePaymentSuccess = (e) => {
  e.preventDefault();
  const { razorpay_signature, user_order_id, razorpay_order_id, razorpay_payment_id } = payment;

  console.log('Payment details:', payment);

  // Check if any required field is missing
  if (!razorpay_signature || !user_order_id || !razorpay_order_id || !razorpay_payment_id) {
    console.error('Missing payment details');
    Toastify.showErrorMessage('Please fill in all payment details');
    return;
  }
  if(razorpay_order_id || user_order_id || razorpay_signature || razorpay_payment_id){
    
  }

  // Proceed with the payment success
  PaymentService.paymentSuccess(payment)
    .then((res) => {
      setShowConfetti(true); // Show confetti
      setTimeout(() => setShowConfetti(false), 5000); 
      Toastify.showSuccessMessage(`Payment Completed`);
      
      setTimeout(()=>{
        window.location.href = '/UserDashBoard';
      } , 5000)
    })
    .catch((err) => {
      Toastify.showErrorMessage('Payment Failed');
    });
};


const [cartItemDetails , setCartItemDetails]=useState(null);
const handleViewCartItem =(cartItem)=>{
setCartItemDetails(cartItem);
setFlag(!flag);
}


  return (
   <>
   {
    disable ? (
      <div className="cartProducts">
      { flag ? (
    <> 
    <div  className="cartItemSection">
    <h2>Cart Items  ( { cartCount} )</h2>
    <ul className="itemWrapper">
    {cartItems.length>0 ? cartItems.map((cartItem, index) => {
      return (
        <li onClick={()=>{handleViewCartItem(cartItem)}}  id="cartItems" key={cartItem.id || index}>
          <a
            href="#"
            class="text-decoration-none d-flex align-items-start"
          >
            <img
              style={{
                height: "100px",
                width: "100px",
                margin: "10px 10px 0px 0px",
                paddingBottom:'10px',
                objectFit:'contain'
              }}
              src={getImageUrl(cartItem.product.imageName)}
              alt={cartItem.product.productName || "Product"}
              onError={(e) => {
                e.target.src = {cartItemIcon}
              }}
            ></img>
            <div id="cartDesc" class="d-flex flex-column">
              <div class="link">
                {cartItem.product.productName} <br></br>
                {cartItem.product.productDesc}{" "}
              </div>
              <div class="link-desc">
                price : ₹ {cartItem?.totalPrice?.toLocaleString('en-IN')} , (quantity :{" "}
                {cartItem?.quantity})
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

    
  </ul>
    </div>

    <div className="totalPrice"> 
    <a
      href="#"
      class="text-decoration-none d-flex align-items-start"
    >
      
      <div class="d-flex flex-column">
        <div class="link"><h4 style={{color:'green'}}>Total Price: ₹ {cartDetails?.totalPrice?.toLocaleString('en-IN')}</h4>
        </div>
        <div class="link-desc">
      * * * * * * * * * * * * * * * * * * * * * * *
        </div>
      </div>
      <div style={{color:'green'}} class="fas fa-coins pt-2 me-3"></div>
    </a>
    <Button
    variant="dark" onClick={()=>{setDisable(!disable)}}>
    Place Order
  </Button>
  </div>

    </>
      ):(
       <div className="productdetails">
       <div className="box1">
                  <div className="box1content">
                    <div className="leftBox">
                      <div className="product_img">
                        <img
                          src={getImageUrl(cartItemDetails?.product?.imageName)}
                          alt={
                            cartItemDetails?.product?.imageName ||
                            "Product Image"
                          }
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100";
                          }}
                        />
                      </div>
                    </div>
                    <div className="boxProduct_description">
                      <h3>
                        {cartItemDetails?.product?.productName ||
                          "Product Name"}
                      </h3>
                      <h5>
                        {cartItemDetails?.product?.productDesc ||
                          "Product Description"}
                      </h5>
                      <p>
                        <span className="highlight">Price - </span> ₹{" "}
                        {cartItemDetails?.product?.productPrize?.toLocaleString(
                          "en-IN"
                        ) || "Product Prize"}
                      </p>
                      <p>
                        <span className="highlight">Quantity - </span>
                        {cartItemDetails?.quantity || "Product Quantity"}
                      </p>
                      <p>
                        <span className="highlight">Category - </span>
                        <span className="special">
                          {cartItemDetails?.product?.category?.title ||
                            "Product Category"}
                        </span>
                      </p>
                      <p>
                        <span className="highlight">Live - </span>
                        {cartItemDetails?.product?.live ? "True" : "False"}
                      </p>
                      <p>
                        <span className="highlight">Stock - </span>
                        {cartItemDetails?.product?.stock
                          ? "In Stock"
                          : "Out Of Stock"}
                      </p>
                      <p>
                        <span className="highlight">
                          <strong>Total Amount</strong> -{" "}
                        </span>{" "}
                        ₹{" "}
                        {cartItemDetails?.totalPrice?.toLocaleString("en-IN") ||
                          "Total Price"}
                      </p>
                      <div className="purchase-btn">
                        {/*<Button
                          onClick={() => {
                            setCount(count + 1);
                          }}
                          className="buy"
                          variant="dark"
                        >
                          Purchase
                        </Button>*/}
                        <Button
                          onClick={() =>
                            handleRemoveCartItem(
                              cartItemDetails?.product?.productId
                            )
                          }
                          className="removeItem"
                          variant="danger"
                        >
                          Remove Item
                        </Button>
                        <Button
                          onClick={() => {
                            setFlag(!flag);
                          }}
                          className="buy"
                          variant="dark"
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
       </div>
      )}
      </div>
    ):(
      <div className="payment-section">
      {
        count ===0 &&(
          <div className="addressDetails">
          <h2>Please Provide Your Billing Address</h2>
      <textarea
        className="addressInput"
        cols={60}
        rows={5}
        name="address"
        autoComplete="off"
        value={orderRequest.address}
        type="text"
        onChange={handleAddress}
        placeholder="Enter your address..."
      />
      <Button variant="success" onClick={handlePlaceOrder}>
        Save
      </Button>
      <Button
        variant="dark"
        onClick={() => {
          setDisable(!disable)
        }}
      >
        Back
      </Button>
    </div>
        ) 
      }

    {
      count === 1 && (
        <div className="createPayment">
      <h2>Payment Method</h2>
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
          <i style={{color:'black'}} className="fas fa-coins"></i> Cash On Delivery
        </li>
      </ul>
      <h3>
        Total Amount :{" "}
        <span>
          ₹{" "}
          {cartDetails?.totalPrice?.toLocaleString('en-IN') || "Total Price"}
        </span>
      </h3>
      <Button
        onClick={() => {
          handlePaymentInitiate(
            cartDetails.totalPrice ?
            cartDetails.totalPrice:0
          );
        }}
        variant="dark"
      >
        Initiate Payment
      </Button>
    </div>
      )
    }
      </div>
    )
   
  }

{
  flag ===true && (
    <div className="related-products ">
    <h2 className="relatedProduct-title">You May Also Like</h2>
    <div className="related-productList">
      {cartDetails?.items?.length > 0 ? (
        [...new Set(cartDetails.items.map(item => item.product?.category?.categoryId))]
          .map((uniqueCategoryId, index) => (
            <Card key={index} catId={uniqueCategoryId} />
          ))
      ) : (
        <p>No related products available.</p>
      )}
    </div>
  </div>
  )
}
 

<div className='parent'>
 {/*<button className="open-modal-btn" onClick={openModal}>
    Open Invoice Modal
  </button>
*/} 
  
  {isModalOpen && (
    <div className="modal-overlay">
   
    {showConfetti && <Confetti 
    width={window.innerWidth}
    height={window.innerHeight}
    gravity={1} // Increase to make it fall faster
    wind={0.1} // Add horizontal movement
    numberOfPieces={200}
    />}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <img className="modal-avatar" src= {paymentImage} alt="Phone Pay Logo" />
          <h3 className="modal-title">Payment Using {payMethod.payMethod || "PayMethod"}.</h3>
          <div className="modal-subtitle">
            Order: #ESP1000
            <span style={{ color: 'red', fontWeight: '900' }}>
              {payment?.user_order_id || ""}
            </span>
          </div>
        </header>
        <div className="modal-body">
         { payMethod.payMethod === 'COD' ? (
       <>
       <h1><img style={{height:'100px' , backgroundColor:'transparent'}} src={successCod}/></h1>
       <h1>Order Placed</h1>
       <div className='Cod-details'>
       <h6>Total Price: <span style={{fontWeight:'900'}}> ₹{" "}{cartDetails.totalPrice ?
            cartDetails.totalPrice:0}</span> .</h6>
            <span>*  *  * Thank you for your order! Explore more products and shop again with us! *  *  *</span>
       </div>
       </>
         ):(
          
           <form onSubmit={handlePaymentSuccess} className="modal-form">
            <div className="input-group">
              <input
                name="razorpay_order_id"
                value={payment.razorpay_order_id}
                style={{ borderRadius: '4px' }}
                onChange={handleChange}
                className="modal-input cardHolder"
                type="text"
                placeholder="RAZORPAY_ORDER_ID"
                aria-label="Razorpay Order ID"
              />
              <input
                style={{ borderRadius: '4px' }}
                onChange={handleChange}
                name="razorpay_signature"
                value={payment.razorpay_signature}
                className="modal-input cardHolder"
                type="text"
                placeholder={payMethod.payMethod === 'Credit/Debit' ? "CARD HOLDER NAME" : " NAME"}
                aria-label="Razorpay Signature"
              />
              <input
                style={{ borderRadius: '4px' }}
                onChange={handleChange}
                name="razorpay_payment_id"
                value={payment.razorpay_payment_id}
                className="modal-input card-No"
                type="text"
                placeholder={payMethod.payMethod === 'Credit/Debit' ? " CARD NO : XXXX  XXXX  XXXX" : "UPI ID"}
                aria-label="Razorpay Payment ID"
              />
              {
                payMethod.payMethod ==='Credit/Debit' && (
                  <div className="card-cvv-exp">
                <input
                  style={{ borderRadius: '4px' }}
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
                )
              }
            </div>

            <div className="modal-amount">
              Total Price: 
              <span style={{ fontWeight: '900' }}>
                ₹ {cartDetails?.totalPrice?.toLocaleString('en-IN') || "Total Price"}
              </span>
            </div>
           <button 
  style={{ background: buttonColor ? buttonColor : '' }} 
  className="modal-button" 
  type="submit">
  Pay Now
</button>
          </form>
          )}
          
        </div>
        <button className="modal-close-btn" onClick={closeModal}>X</button>
      </div>
    </div>
  )}
</div>


   </>
  );
}

export default Product;
