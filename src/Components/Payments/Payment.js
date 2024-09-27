import React, { useEffect, useState } from 'react';
import './Payment.css';
import Confetti from 'react-confetti'; // Import Confetti
import phonepeImage from '../Payments/phonepay.jpeg'; // Add your phonepe image in the assets folder
import { getCurrentUser } from '../Auth';
import Base from '../Base';
import OrderService from '../Service/OrderService';

function Payments({ details, payMethod }) {
  const [orderDetails, setOrderDetails] = useState(null); // Initialize orderDetails state
  const [paymentDetails, setPaymentDetails] = useState({
    razorpay_order_id: '',
    phone: '',
    orderId: details.orderId || '',
    amount: ''
  });
  const [showConfetti, setShowConfetti] = useState(false); // State to control confetti
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  }); // State to handle window size for Confetti

  useEffect(() => {
    // Fetch order details from OrderService and update paymentDetails
    OrderService.getOrderDetails()
      .then((res) => {
        setOrderDetails(res.data);
        if (res.data && res.data.orderId) {
          setPaymentDetails((prevDetails) => ({
            ...prevDetails,
            razorpay_order_id: res.data.orderId,
          }));
        }
      })
      .catch((err) => console.error('Error fetching order details:', err));
  }, []);

  // Handle window resize for dynamic confetti sizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Phone number validation
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhone(paymentDetails.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    console.log('Payment details:', paymentDetails);
    setShowConfetti(true); // Show confetti when form is submitted

    setTimeout(() => {
      setShowConfetti(false); // Stop confetti after 5 seconds
    }, 5000);
  };

  return (
    <Base>
      <div className="payment-page">
        {/* Confetti effect */}
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={1000}
            gravity={0.15}
          />
        )}

        <div className="payment-container">
          {/* Left side with image and instructions */}
          <div className="left-section">
            <img src={phonepeImage} alt="PhonePe Logo" className="phonepe-img" />
            <div className="instructions">
              <ul>
                <li>Open the PhonePe app on your mobile.</li>
                <li>Select 'UPI Payment' option.</li>
                <li>Enter the UPI ID or scan the QR code.</li>
                <li>Confirm the transaction amount and complete the payment.</li>
              </ul>
            </div>
          </div>

          {/* Right side with form */}
          <div className="right-section">
            <h3>Complete Payment</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="razorpay_order_id"
                  value={paymentDetails.razorpay_order_id}
                  onChange={handleChange}
                  placeholder="Order ID"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="phone"
                  value={paymentDetails.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="orderId"
                  value={paymentDetails.orderId}
                  onChange={handleChange}
                  placeholder="Enter your UPI ID"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="amount"
                  value={paymentDetails.amount}
                  onChange={handleChange}
                  placeholder="Enter the amount"
                  required
                />
              </div>
              <button type="submit" className="transaction-btn">
                Complete Transaction
              </button>
            </form>
          </div>
        </div>
      </div>
    </Base>
  );
}

export default Payments;
