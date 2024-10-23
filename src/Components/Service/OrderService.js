import { PrivateHttp } from "./axios-helper";

class OrderService {
 
  placeOrder(orderRequest){
    return PrivateHttp.post(`/order/` ,orderRequest);
  }

  getOrderDetails(){
    return PrivateHttp.get(`/order/`);
  }

  deleteOrder(id){
    return PrivateHttp.delete(`/order/${id}`)
  }
  fetchOrderById(id){
    return PrivateHttp.get(`/order/s/${id}`)
  }
  
}export default new OrderService();