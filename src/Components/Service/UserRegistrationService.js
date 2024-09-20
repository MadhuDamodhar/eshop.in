import axios from "axios";

const BASE_URL = "http://localhost:9090";

class UserService {
  /*----------------------Register User methods---------------*/

  registerUser(user) {
    return axios.post(`${BASE_URL}/users/`, user);
  }

  /*----------------------Login User methods---------------*/
  loginUser(userLoginDetails) {
    return axios.post(`${BASE_URL}/auth/login`, userLoginDetails);
  }
}

export default new UserService();
