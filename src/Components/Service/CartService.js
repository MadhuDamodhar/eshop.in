import axios from "axios";
import { getToken } from "../Auth";
export const Base_url = "http://localhost:9090";
class Service {

  fetchCartDetails() {
    const token = getToken() // Assuming token is stored in localStorage
    return axios.get(`${Base_url}/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`  // Include the token in the Authorization header
      }
    });
  }

}

export default new Service();
