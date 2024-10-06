import React, { useState, useEffect } from "react";
import "./UserSignUp.css";
import { Link, useNavigate } from "react-router-dom";
import Service from "../Service/UserRegistrationService.js";
import signupimg from "./signup2.png";

import Toastify from "../ToastNotify/Toastify.js";

function UserSignUp() {
  const [count, setCount] = useState(0); // To switch between form sections
  const [msg, setMsg] = useState(""); // Success/Error messages
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    about: "",
    gender: "",
    phone: "",
  });

  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const navigate = useNavigate();

  // Handle input changes for the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Validation and form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields in the second form section
    if (!user.email || !user.password) {
      Toastify.showErrorMessage("Please fill  all required fields.");
      return;
    }

    Service.registerUser(user)
      .then((res) => {
        setMsg(res.data.message);
        Toastify.showSuccessMessage(
          "Registration Successful! Now Log in to Your Account"
        );

        // Reset form after successful registration
        setUser({
          name: "",
          email: "",
          password: "",
          address: "",
          about: "",
          gender: "",
          phone: "",
        });
        setCount(0); // Reset to the first section of the form
        setTimeout(() => {
          navigate("/UserLogin");
        }, 2500);
      })
      .catch((err) => {
        console.log(err);
        Toastify.showErrorMessage("Error signing up. Please try again.");
      });
  };

  // Function to check if all fields in the first section are filled
  const checkNextButtonState = () => {
    const { name, phone, address, gender, about } = user;

    if (name && phone && address && gender && about) {
      setIsNextDisabled(false);
      setMsg(""); 
    } else {
      setIsNextDisabled(true);
      setMsg(
        "Please fill all fields. The button will be enabled only after all fields are completed."
      );
    }
  };

  // Ensure the message is cleared instantly when the form is valid
  useEffect(() => {
    checkNextButtonState();
  }, [user]);

  return (
    <>
      <>
        <div className="SignUp">
          <form onSubmit={handleSubmit} className="form">
            <p className="title">Create Your Account</p>
            {msg ? (
              <p className="Loginmsg">{msg}</p>
            ) : (
              <p className="message">
                Complete the quick registration on E-Shop.
              </p>
            )}

            <div className="user-details-2">
              {count === 0 && (
                <>
                  <div className="flex">
                    <label>
                      <input
                        className="input"
                        autoComplete="off"
                        name="name"
                        value={user.name}
                        type="text"
                        required
                        onChange={handleInputChange}
                      />
                      <span>Name :</span>
                    </label>

                    <label>
                      <input
                        className="input"
                        autoComplete="off"
                        name="phone"
                        value={user.phone}
                        type="text"
                        required
                        onChange={handleInputChange}
                      />
                      <span>Phone :</span>
                    </label>
                  </div>

                  <div className="flex">
                    <label>
                      <input
                        className="input"
                        name="address"
                        autoComplete="off"
                        value={user.address}
                        type="text"
                        required
                        onChange={handleInputChange}
                      />
                      <span>Address :</span>
                    </label>

                    <label>
                      <input
                        className="input"
                        name="gender"
                        autoComplete="off"
                        value={user.gender}
                        type="text"
                        required
                        onChange={handleInputChange}
                      />
                      <span>Gender :</span>
                    </label>
                  </div>
                  <label>
                    <input
                      className="input"
                      name="about"
                      value={user.about}
                      autoComplete="off"
                      type="text"
                      required
                      onChange={handleInputChange}
                    />
                    <span>About :</span>
                  </label>

                  <button
                    id="submitButton"
                    onClick={() => setCount(1)} // Proceed to the next section
                    type="button"
                    className="submit"
                    disabled={isNextDisabled} // Disable based on form state
                  >
                    Next
                  </button>
                  <button
                    id="submitButton"
                    onClick={() => navigate("/")} // Navigate to home page
                    type="button"
                    className="submit"
                  >
                    Back
                  </button>
                </>
              )}
            </div>

            {count === 1 && (
              <div className="user-details-1">
                <label>
                  <input
                    className="input"
                    name="email"
                    autoComplete="off"
                    value={user.email}
                    type="email"
                    required
                    onChange={handleInputChange}
                  />
                  <span>Email :</span>
                </label>

                <label>
                  <input
                    className="input"
                    name="password"
                    autoComplete="off"
                    value={user.password}
                    type="password"
                    required
                    onChange={handleInputChange}
                  />
                  <span>Password :</span>
                </label>

                <button id="submitButton" type="submit" className="submit">
                  Sign Up
                </button>
                <button
                  onClick={() => setCount(count - 1)}
                  id="submitButton"
                  type="submit"
                  className="submit"
                >
                  Back
                </button>
              </div>
            )}

            <p className="signin">
              Already have an account?{" "}
              <Link className="Link" to="/UserSignIn">
                Sign In
              </Link>
            </p>
          </form>

         
        </div>
      </>
    </>
  );
}

export default UserSignUp;
