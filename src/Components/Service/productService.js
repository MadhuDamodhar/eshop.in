import { PrivateHttp } from "./axios-helper";

class ProductService {
  /*----------------------products methods---------------*/
  getAllProductsDetails() {
    return PrivateHttp.get(`/product/viewAllProduct`);
  }
  

  addProduct( product , categoryId ){
    return PrivateHttp.post(`/product/categories/${categoryId}/product/`,product , categoryId)
  }

  addImageToProduct(id, formData) {
    return PrivateHttp.post(`/product/products/images/${id}`, formData);
  }
  
  getProductById(id){
    return PrivateHttp.get(`/product/products/${id}`
      );
  }
}

export default new ProductService();
