import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSignIn.css";
import { Link } from "react-router-dom";
import Service from "../Service/UserRegistrationService";
import { login } from '../Auth/index';
import { ToastContainer} from 'react-toastify';
import Toastify from "../ToastNotify/Toastify";


function UserSignIn() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [userLoginDetails, setUserLoginDetails] = useState({
    username: "",
    password: "",
  });



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserLoginDetails({ ...userLoginDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = userLoginDetails;

    // Validate fields
    if (username.trim() === "") {
      Toastify.showErrorMessage("Username should not be blank");
      return;
    }

    if (password.trim() === "") {
      Toastify.showErrorMessage("Password field should not be blank");
      return;
    }

    try {
      const data = await Service.loginUser(userLoginDetails);
      console.log(data);

      // Show success toast
      Toastify.showSuccessMessage("Login success! Redirecting to dashboard...");

      // Update auth state and redirect to dashboard
      login(data, () => {
        setTimeout(() => navigate("/UserDashBoard"), 1500);
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 404) {
          Toastify.showErrorMessage(
            error.response.data.message || "Invalid login credentials"
          );
        } else {
          Toastify.showErrorMessage("Unexpected Error: " + error.message);
        }
      } else {
        Toastify.showErrorMessage("Network Error: " + error.message);
      }
      console.log(error); // Debugging: log the full error
    }
  };

  return (
    <>
    <>
      {/* Login Form */}
      <div className="Login">
        <form onSubmit={handleSubmit} className="Loginform">
          <p className="Logintitle">Log Into Your Account</p>
          {msg ? (
            <p className="Loginmsg">{msg}</p>
          ) : (
            <p className="message">Log In To Start Shopping</p>
          )}

          {/* Username input */}
          <label>
            <input
              className="Logininput"
              name="username"
              autoComplete="off"
              value={userLoginDetails.username}
              type="email"
              onChange={handleInputChange}
            />
            <span>Email :</span>
          </label>

          {/* Password input */}
          <label>
            <input
              className="Logininput"
              name="password"
              autoComplete="off"
              value={userLoginDetails.password}
              type="password"
              onChange={handleInputChange}
            />
            <span>Password :</span>
          </label>

          {/* Submit button */}
          <button className="Loginsubmit">Sign In</button>

          {/* Link to registration */}
          <p className="Loginlink">
            Don't have an account?{" "}
            <Link className="Link" to="/UserSignUp">
              Sign Up
            </Link>
          </p>
        </form>

      </div>

      {/* Toast container */}
      <ToastContainer />
    </>
    </>
  );
}

export default UserSignIn;
