import React, { useState, useEffect } from 'react';
import './ClothCard.css';
import iphone12 from '../Card/iphone.png'; // Fallback image
import productService from '../Service/productService';
import { BASE_URL } from '../Service/axios-helper';
import CartService from '../Service/CartService';
import Toastify from '../ToastNotify/Toastify';

function Card({ catId }) {
  const [products, setProducts] = useState([]);

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
      Toastify.showErrorMessage("Something went wrong"+id);
    });
  };

  useEffect(() => {
    productService.getProductByCategoryId(catId)
      .then((res) => {
        if (res && res.data && res.data.content && res.data.content.length > 0) {
          setProducts(res.data.content);
        } else {
          console.log('No products found.');
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      });
  }, [catId]);

  const getImageUrl = (imageName) => {
    if (!imageName) return iphone12;  // Fallback to the default image
    const imageUrl = `${BASE_URL}/product/products/images/${imageName}`;
    console.log("Image URL:", imageUrl); 
    return imageUrl;
  };

  return (
    <>
      {products.length > 0 ? (
        products.map((product) => (
          <div className="card" key={product.productId || product.id}>
            <img
              src={getImageUrl(product.imageName)}
              alt={product.productName || "Product"}
              onError={(e) => {
                e.target.src = iphone12;
              }}
            />
            <div className="card-content">
              {product.live && <span className="live">Live</span>}
              <h2 className="card-title">{product.productName || "Product Name"}</h2>
              <p className="card-description">
                {product.productDesc || "No description available"}
              </p>
              <div className="price">
                <span>
                  ₹{((110 / 100) * (product.productPrize || 0)).toFixed(2).toLocaleString('en-IN')}
                </span>
                <p className="card-price">
                  ₹{product.productPrize ? product.productPrize.toLocaleString('en-IN') : "N/A"}
                </p>
                <p style={{ color: "green" }}>10% off</p>
              </div>
              <div className="sizes">
                <label>
                  <input type="radio" name="size" value="S" /> S
                </label>
                <label>
                  <input type="radio" name="size" value="M" /> M
                </label>
                <label>
                  <input type="radio" name="size" value="L" /> L
                </label>
                <label>
                  <input type="radio" name="size" value="XL" /> XL
                </label>
              </div>
              <div className="card-buttons">
                <button className="card-button">Buy</button>
                <button 
                  onClick={() => addItemToCart(product.productId)} 
                  className="card-button"
                >
                  Add to Cart
                </button>
              </div>
              <span style={{ color: "red" }}>
                {product.stock > 0 ? "" : "Out Of Stock"}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p>No products available for this category.</p>
      )}
    </>
  );
}

export default Card;
