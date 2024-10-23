import { PrivateHttp } from "./axios-helper";

class WishlistService{
addToWishlist(id){
return PrivateHttp.post(`/api/wishlist/?productId=${id}`);
}

deleteItemOfWishlist(id){
  return PrivateHttp.delete(`/api/wishlist/${id}`)
}

fetchWishlistItems(){
return PrivateHttp.get(`/api/wishlist/`)
}
} export default new WishlistService();