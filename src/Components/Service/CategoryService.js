import { PrivateHttp } from "./axios-helper";

class Service {
  // Load all categories
  loadCategory() {
    return PrivateHttp.get(`/cat/`);
  }

  // Load a category by ID
  loadCategoryById(id) {
    return PrivateHttp.get(`/cat/${id}`);
  }

  // Update category by ID
  updateCategory(id, category) {
    return PrivateHttp.put(`/cat/${id}`, category);
  }

  addCategory(category){
    return PrivateHttp.post(`/cat/`,category)
  }

deleteCategory(id){
  return PrivateHttp.delete(`/cat/${id}`)
    }
}



export default new Service();
