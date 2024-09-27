import React, { useState, useEffect } from "react";
import "./Card.css";
import iphone12 from "../Card/iphone.png"; // Fallback image
import productService from "../Service/productService";
import { BASE_URL } from "../Service/axios-helper";
import CartService from "../Service/CartService";
import Toastify from "../ToastNotify/Toastify";

function Card({ catId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService
      .getProductByCategoryId(catId)
      .then((res) => {
        if (res.data && res.data.content.length > 0) {
          setProducts(res.data.content);
        } else {
          console.log("No products found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, [catId]);

  const getImageUrl = (imageName) => {
    const imageUrl = `${BASE_URL}/product/products/images/${imageName}`;
    console.log("Image URL:", imageUrl);
    return imageUrl;
  };
  const addItemToCart = (id) => {
    CartService.addToCart({
      productId: id,
      quantity: 1,  // Update as needed
    })
    .then((res) => {
      console.log(res.data);
      Toastify.showSuccessMessage("Product added to cart");
    })
    .catch((err) => {
      console.log(err);
      Toastify.showErrorMessage("Something went wrong");
    });
   
  };
  

  return (
    <>
      {products.length > 0 ? (
        products.map((product) => {
          console.log("Image Name:", product.imageName); // Log the image name
          return (
            <div className="card" key={product.productId || product.id}>
              <img
                src={getImageUrl(product.imageName)}
                alt={product.productName || "Product"}
                onError={(e) => {
                  e.target.src = iphone12;
                }}
              />
              <div className="card-content">
                {product.live ? <span className="live">Live</span> : ""}

                <h2 className="card-title">
                  {product.productName || "Product Name"}
                </h2>
                <p className="card-description">
                  {product.productDesc || "No description available"}
                </p>

                <div className="price">
                  <span>
                    ₹{((110 / 100) * product.productPrize).toFixed(2).toLocaleString('en-IN') || "N/A"}
                  </span>
                  <p className="card-price">₹{product.productPrize.toLocaleString('en-IN') || "N/A"}</p>
                  <p style={{ color: "green" }}>10% off</p>
                </div>
                <div className="card-buttons">
                  <button className="card-button">Buy</button>
                  <button
                    onClick={() => {
                      addItemToCart(product.productId);
                    }}
                    className="card-button"
                  >
                    Add to Cart
                  </button>
                </div>
                <span style={{ color: "red" }}>
                  {product.stock ? "" : "Out Of Stock"}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p>No products available for this category.</p>
      )}
    </>
  );
}

export default Card;
