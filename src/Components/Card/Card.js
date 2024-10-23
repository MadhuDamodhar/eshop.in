import React, { useState, useEffect, useContext } from "react";
import "./Card.css";
import iphone12 from "../Card/iphone.png";
import productService from "../Service/productService";
import { BASE_URL } from "../Service/axios-helper";
import CartService from "../Service/CartService";
import Toastify from "../ToastNotify/Toastify";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context";
function Card({ catId }) {
  const [products, setProducts] = useState([]);
  const [wishList, setWishList] = useState(false);
  const { handleWishlist, handleToggleWishlistMethods, wishListStatus } =
    useContext(Context);
  const navigate = useNavigate();
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

  const getImageUrl = (imageNames) => {
    const imageUrl = `${BASE_URL}/product/products/images/${imageNames}`;
    console.log("Image URL:", imageUrl);
    return imageUrl;
  };

  return (
    <>
      {products.length > 0 ? (
        products.map((product) => {
          console.log("Image Name:", product.imageNames); // Log the image name
          return (
            <div className="card" key={product.productId || product.id}>
              <div className="card-buttons">
                <button
                  className="card-button"
                  onClick={() => handleToggleWishlistMethods(product.productId)}
                >
                  <i
                    className="fas fa-heart"
                    style={{
                      color: wishListStatus[product.productId]
                        ? "red"
                        : "black",
                    }} // Change color based on currentStatus
                  ></i>
                </button>
                <button className="card-button">
                  <i class="fas fa-share-alt"></i>
                </button>
              </div>
              <img
                onClick={() => {
                  navigate(
                    `/ViewProduct/${product?.productId}`,
                    { state: { product: product } },
                    { replace: true }
                  );
                }}
                src={getImageUrl(product.imageNames[0])}
                alt={product.productName || "Product"}
                onError={(e) => {
                  e.target.src = iphone12;
                }}
              />
              <div
                onClick={() => {
                  navigate(
                    `/ViewProduct/${product?.productId}`,
                    { state: { product: product } },
                    { replace: true }
                  );
                }}
                className="card-content"
              >
                {product.live ? <span className="live">Live</span> : ""}

                <h2 className="card-title">
                  {product.productName || "Product Name"}
                </h2>
                <p className="card-description">
                  {product.productDesc.slice(0, 100) ||
                    "No description available"}
                  ..,
                </p>

                <div className="price">
                  <span id="mrp">
                    MRP:₹
                    {((110 / 100) * product.productPrize)
                      .toFixed(2)
                      .toLocaleString("en-IN") || "N/A"}
                  </span>
                  <br></br>
                  <p className="card-price">
                    ₹{product.productPrize.toLocaleString("en-IN") || "N/A"}
                  </p>
                  <p id="discountTag" style={{ color: "green" }}>
                    10% off
                  </p>
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
