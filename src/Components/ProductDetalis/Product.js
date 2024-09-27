import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Base from '../Base';
import './Product.css';
import { BASE_URL } from '../Service/axios-helper';
import { Button } from 'react-bootstrap';
import Card from '../Card/Card';
import CartService from '../Service/CartService';
import Toastify from '../ToastNotify/Toastify';
import OrderService from '../Service/OrderService';
import PaymentService from '../Service/PaymentService';
import Payments from '../Payments/Payment';

function Product() {
  const [disable, setDisable] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  
  // Fallback for undefined or null state
  const [cartItemDetails, setCartItemDetails] = useState(location.state?.cartItemDetails || {});
  const [cartID, setCartID] = useState(location.state?.cartID || '');
  const [enablePaymentPage, setEnablePaymentPage] = useState(false);
  const [orderRequest, setOrderRequest] = useState({
    cartID: cartID || '',
    address: ''
  });

  console.log(orderRequest.cartID);

  useEffect(() => {
    if (Object.keys(cartItemDetails).length) {
      setIsLoading(false);
    } else {
      console.log("No product details found.");
      navigate(-1); 
    }
  }, [cartItemDetails, navigate]);

  const getImageUrl = (imageName) => {
    return `${BASE_URL}/product/products/images/${imageName}`;
  };

  const handleRemoveCartItem = (cartItemId) => {
    CartService.removeCartItem(cartItemId)
      .then((res) => {
        Toastify.showSuccessMessage("Item Removed");
        setCartItemDetails(null);
        setTimeout(() => {
          navigate('/userDashboard', { replace: true }); // Prevents storing previous state
        }, 2000);
      })
      .catch((err) => {
        Toastify.showErrorMessage("Something Went Wrong: " + err);
      });
  };

  const handleAddress = (e) => {
    setOrderRequest({
      ...orderRequest,
      address: e.target.value
    });
  };

  const handlePlaceOrder = () => {
    if (orderRequest.address.trim()) {
      OrderService.placeOrder(orderRequest)
        .then((res) => {
          Toastify.showSuccessMessage("Address details saved.");
          setTimeout(() => {
            setDisable(false);
          }, 2000);
        })
        .catch((err) => {
          console.error("Error response:", err.response);
          Toastify.showErrorMessage("Something went wrong while placing the order: " + err.response.data.message);
        });
    } else {
      Toastify.showErrorMessage("Please enter a valid address.");
    }
  };

  const [payMethod, setPayMethods] = useState({
    payMethod: ''
  });

  const handlePayments = (e) => {
    setPayMethods({
      ...payMethod,
      payMethod: e.target.value
    });
  };

  console.log(payMethod);

  const [paymentDetails, setPaymentDetails] = useState(null);

  const handlePaymentInitiate = (price) => {
    PaymentService.paymentInitiate(price)
      .then((res) => {
        if (res.data) {
          Toastify.showSuccessMessage("Payment Initiated");
          setEnablePaymentPage(true);
          setPaymentDetails(res.data);
        } else {
          Toastify.showErrorMessage("No payment details received.");
        }
      })
      .catch((err) => {
        console.log(err);
        Toastify.showErrorMessage('Payment Not Initiated');
      });
  };

  console.log(cartItemDetails);

  return (
    <Base>
      {!enablePaymentPage ? (
        <div className='productdetails'>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            Object.keys(cartItemDetails).length ? (
              <>
                {count === 0 ? (
                  <div className="box1">
                    <div className="box1content">
                      <div className="leftBox">
                        <div className="product_img">
                          <img
                            src={getImageUrl(cartItemDetails?.product?.imageName)}
                            alt={cartItemDetails?.product?.imageName || "Product Image"}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100";
                            }}
                          />
                        </div>
                      </div>
                      <div className="boxProduct_description">
                        <h3>{cartItemDetails?.product?.productName || "Product Name"}</h3>
                        <h5>{cartItemDetails?.product?.productDesc || "Product Description"}</h5>
                        <p><span className="highlight">Price - </span> ₹ {cartItemDetails?.product?.productPrize?.toLocaleString('en-IN') || "Product Prize"}</p>
                        <p><span className="highlight">Quantity - </span>{cartItemDetails?.quantity || "Product Quantity"}</p>
                        <p><span className="highlight">Category - </span><span className="special">{cartItemDetails?.product?.category?.title || "Product Category"}</span></p>
                        <p><span className="highlight">Live - </span>{cartItemDetails?.product?.live ? "True" : "False"}</p>
                        <p><span className="highlight">Stock - </span>{cartItemDetails?.product?.stock ? "In Stock" : "Out Of Stock"}</p>
                        <p><span className="highlight"><strong>Total Amount</strong> - </span> ₹ {cartItemDetails?.totalPrice?.toLocaleString('en-IN') || "Total Price"}</p>
                        <div className='purchase-btn'>
                          <Button onClick={() => { setCount(count + 1); }} className='buy' variant='dark'>Purchase</Button>
                          <Button onClick={() => handleRemoveCartItem(cartItemDetails?.product?.productId)} className='removeItem' variant='danger'>Remove Item</Button>
                          <Button onClick={() => { navigate('/userDashboard'); }} className='buy' variant='dark'>Back</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {count === 1 && (
                  <div className='addressForPurchasing'>
                    <div className='productDetailsWrapper'>
                      <img
                        src={getImageUrl(cartItemDetails?.product?.imageName)}
                        alt={cartItemDetails?.product?.imageName || "Product Image"}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100";
                        }}
                      />
                      <div className='productDetails'>
                        <h2>{cartItemDetails?.product?.productName || "Product Name"}</h2>
                        <h5>{cartItemDetails?.product?.productDesc || "Product Description"}</h5>
                        <h5>Price : ₹ {cartItemDetails?.product?.productPrize?.toLocaleString('en-IN') || "Product price"}</h5>
                        <h5>Quantity : {cartItemDetails?.quantity || "Product Quantity"}</h5>
                        <h5>Total Amount : ₹ {cartItemDetails?.totalPrice?.toLocaleString('en-IN') || "Total Price"}</h5>
                        <h5>Billing Address : {orderRequest.address ? orderRequest.address : "Billing Address"}</h5>
                      </div>
                    </div>
                    {disable ? (
                      <div className='addressDetails'>
                        <textarea
                          className="addressInput"
                          cols={60}
                          rows={5}
                          name="address"
                          autoComplete="off"
                          value={orderRequest.address}
                          type="text"
                          onChange={handleAddress}
                          placeholder='Enter your address...'
                        />
                        <Button variant='success' onClick={handlePlaceOrder}>Save</Button>
                        <Button variant='dark' onClick={() => { setCount(count - 1); }}>Back</Button>
                      </div>
                    ) : (
                      <div className='createPayment'>
                        <h2>Payment Method</h2>
                        <ul>
                          <li><input onChange={handlePayments} name='payMethod' value='GPay' type='radio' /><i className="fab fa-google"></i> Pay</li>
                          <li><input onChange={handlePayments} name='payMethod' value='PhonePay' type='radio' /> <i className="fas fa-mobile-alt"></i> &nbsp;Phone Pay</li>
                          <li><input onChange={handlePayments} name='payMethod' value='Credit/Debit' type='radio' /> <i className="fas fa-credit-card"></i>&nbsp;Credit/Debit</li>
                        </ul>
                        <h3>Total Amount : <span>₹ {cartItemDetails?.totalPrice?.toLocaleString('en-IN') || "Total Price"}</span></h3>
                        <Button onClick={() => { handlePaymentInitiate(cartItemDetails?.totalPrice); }} variant='dark'>Initiate Payment</Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null
          )}

          <div className='related-products'>
          <h2 className='reatedProduct-title' >You May Also Like</h2>
          <div className='related-productList'>
          <Card catId={cartItemDetails?.product?.category?.categoryId} />

          </div>
          </div>
        </div>
      ) : (
        <Payments details={paymentDetails} payMethod={payMethod.payMethod} />
      )}
    </Base>
  );
}

export default Product;
