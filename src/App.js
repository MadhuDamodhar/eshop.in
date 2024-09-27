import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Store from "./Components/Store/Store";
import UserSignUp from "./Components/UserSignUp/UserSignUp";
import UserSignIn from "./Components/UserSingIn/UserSignIn";
import AdminDashBoard from "./Components/AdminDashBoard/AdminDashBoard";
import UserDashBoard from './Components/UserDashboard/UserDashboard';
import Product from "./Components/ProductDetalis/Product";
import Payments from "./Components/Payments/Payment";
import Base from "./Components/Base"; // Assuming you use the Base component
import "./App.css";

function App() {
  const [cartItemCount, setCartItemCount] = useState(0); // Initialize state

  // Function to update the cart count
  const updateCartCount = (newCount) => {
    setCartItemCount(newCount);
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Wrap the components with Base where cart count is required */}
          <Route path="/" element={<Base cartItemCount={cartItemCount}><Store /></Base>} />
          <Route path="/UserSignUp" element={<UserSignUp />} />
          <Route path="/UserSignIn" element={<UserSignIn />} />
          <Route path="/AdminDashBoard" element={<AdminDashBoard />} />
          <Route path="/UserDashBoard" element={<Base cartItemCount={cartItemCount}><UserDashBoard /></Base>} />
          <Route path="/product" element={<Base cartItemCount={cartItemCount}><Product /></Base>} />
          <Route path="/payments" element={<Base cartItemCount={cartItemCount}><Payments /></Base>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
