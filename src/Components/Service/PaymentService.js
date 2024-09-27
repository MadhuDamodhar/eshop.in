import { PrivateHttp } from './axios-helper';

class PaymentService {
  // Initiating the payment by passing price as a request parameter
  paymentInitiate(price) {
    return PrivateHttp.post(`/payment/create?price=${price}`);
  }

  // Payment success - passing all necessary request parameters
  paymentSuccess({ razorpay_payment_id, razorpay_order_id, razorpay_signature, user_order_id }) {
    return PrivateHttp.post('/payment/success', null, {
      params: {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        user_order_id
      }
    });
  }
}

export default new PaymentService();
