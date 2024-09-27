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
  
}export default new OrderService();