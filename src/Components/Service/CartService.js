import { PrivateHttp } from "./axios-helper";
class CartService {
  // Fetch cart details
  fetchCartDetails() {
    return PrivateHttp.get(`/cart/`);
  }

  // Add item to cart
  addToCart(itemResponse) {
    return PrivateHttp.post(`/cart/`, itemResponse);
  }
//remove cartItem
removeCartItem(cartItem) {
  return PrivateHttp.put(`/cart/${cartItem}`)
}
}

export default new CartService();
