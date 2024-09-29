import React, { useEffect, useState } from 'react';
import './Payment.css';
import Confetti from 'react-confetti'; 
import phonepeImage from '../Payments/phonepay.jpeg'; 
import OrderService from '../Service/OrderService';
import Toastify from '../ToastNotify/Toastify';
import PaymentService from '../Service/PaymentService';
import Base from '../Base';
function Payments({ details }) {


  const [paymentDetails, setPaymentDetails] = useState({
    razorpay_signature: '',
    user_order_id: '',
    razorpay_order_id: details?.orderId || '',
    razorpay_payment_id: ''
  });

  const [showConfetti, setShowConfetti] = useState(false); // State to control confetti

  useEffect(() => {
    OrderService.getOrderDetails()
      .then((res) => {
        console.log(res.data);
        if (res.data && res.data.length > 0) {
          setPaymentDetails((prev) => ({
            ...prev,
            user_order_id: res.data[0].orderId || ''
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    console.log(`Field ${e.target.name} updated to: ${e.target.value}`);
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentSuccess = (e) => {
    e.preventDefault();
    const { razorpay_signature, user_order_id, razorpay_order_id, razorpay_payment_id } = paymentDetails;

    console.log('Payment details:', paymentDetails);

    // Check if any required field is missing
    if (!razorpay_signature || !user_order_id || !razorpay_order_id || !razorpay_payment_id) {
      console.error('Missing payment details');
      Toastify.showErrorMessage('Please fill in all payment details');
      return;
    }

    // Proceed with the payment API call
    PaymentService.paymentSuccess({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      user_order_id
    })
      .then((res) => {
        console.log('Payment Success:', res);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Show confetti for 5 seconds
        Toastify.showSuccessMessage('Payment Completed');
      })
      .catch((err) => {
        console.error('Payment Error:', err.response ? err.response.data : err.message);
      });
  };

  return (
    <Base >
    <div className="payment-page">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
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
          <form onSubmit={handlePaymentSuccess}>
            <div className="form-group">
              <input
                type="text"
                name="razorpay_signature"
                value={paymentDetails.razorpay_signature}
                onChange={handleChange}
                placeholder="razorpay_signature"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="user_order_id"
                value={paymentDetails.user_order_id}
                onChange={handleChange}
                placeholder="Enter your order ID"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="razorpay_order_id"
                value={paymentDetails.razorpay_order_id}
                onChange={handleChange}
                placeholder="razorpay_order_id"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="razorpay_payment_id"
                value={paymentDetails.razorpay_payment_id}
                onChange={handleChange}
                placeholder="razorpay_payment_id"
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
