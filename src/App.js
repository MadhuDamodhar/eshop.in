import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../src/Components/Navbar/Navbar";
import Store from "./Components/Store/Store";
import UserSignUp from "./Components/UserSignUp/UserSignUp";
import UserSignIn from "./Components/UserSingIn/UserSignIn";
import AdminDashBoard from "./Components/AdminDashBoard/AdminDashBoard";
import UserDashBoard from './Components/UserDashboard/UserDashboard';
import Product from "./Components/ProductDetalis/Product";
import Payments from "./Components/Payments/Payment";
import { ContextProvider } from "./Components/Context"; // Import ContextProvider
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import ProductView from "./Components/ProductView/ProductView";
import ViewProduct from "./Components/ProductView/ViewProduct";
import Category from "./Components/CategoryBlock/Category";
function App() {
  // Create a custom component to handle Navbar conditional rendering
  const CustomNavbar = () => {
    const location = useLocation();
    return location.pathname === "/UserDashBoard" ? null : <Navbar />;
  };

  return (
    <ContextProvider> {/* Wrap the application with ContextProvider */}
      <BrowserRouter>
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/UserSignUp" element={<UserSignUp />} />
          <Route path="/UserSignIn" element={<UserSignIn />} />
          <Route path="/AdminDashBoard" element={<AdminDashBoard />} />
          <Route path="/UserDashBoard" element={<UserDashBoard />} />
          <Route path="/product" element={<Product />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/productView/:productId" element={<ProductView />} />
          <Route path="/ViewProduct/:productId" element={<ViewProduct />} />
          <Route path="/category/:catId" element={<Category />} />
        </Routes>
        <ToastContainer autoClose={3000} />
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
