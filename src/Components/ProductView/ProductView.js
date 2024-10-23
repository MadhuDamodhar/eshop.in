import React, { useContext, useEffect, useState } from 'react';
import './ProductView.css';
import { useLocation, useParams } from 'react-router-dom';
import { BASE_URL } from '../Service/axios-helper';
import iphone12 from '../Card/iphone.png';
import CartService from '../Service/CartService';
import Toastify from '../ToastNotify/Toastify';
import { Context } from '../Context';
import Card from '../Card/Card';

const ProductDetails = ({ product }) => {
  const [activeImage, setActiveImage] = useState(null);
  const { addItemToCart ,handleWishlist ,  handleToggleWishlistMethods,
    wishListStatus } = useContext(Context)
  const getImageUrl = (imageName) => {
    
    return imageName ? `${BASE_URL}/product/products/images/${imageName}` : iphone12;
    
  };

  const images = product?.imageNames?.map((imageName, index) => ({
    id: index,
    src: getImageUrl(imageName),
    
  })) || [];

  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0]); 
      
    }
  }, []);

  const handleThumbnailClick = (image) => {
    console.log("Thumbnail clicked:", image.src); // Debug log
    setActiveImage(image);

  };

  return (
    <div className="product-details">
      <div className="product-images">
        {/* Thumbnails */}
        <div className="thumbnails">
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => handleThumbnailClick(img)}
              className={`thumbnail ${activeImage?.src === img.src ? 'active' : ''}`}
              style={{ cursor: 'pointer' }} // Adding cursor style for clarity
            >
              <img src={img.src} alt={`Thumbnail of ${product?.productName}`} />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="main-image">
          <img src={activeImage?.src || iphone12} alt={`Main view of ${product?.productName}`} />
        </div>
      </div>

      {/* Product Information */}
      <article className="product-info">
        <h3>{product?.productName || "Product Name"}</h3>
        <span>342 Reviews</span>
        <span className="price">
          <span className="mrp">
            MRP: ₹{product?.productPrize ? ((110 / 100) * product.productPrize).toFixed(2).toLocaleString("en-IN") : "N/A"}
          </span>&nbsp;
          ₹{product?.productPrize?.toLocaleString("en-IN") || "N/A"}
        </span>
        <p id="discountTag" style={{ color: "green" }}>Save 10% when you order now</p>
        <span>Description</span>
        <ul>
          <li>{product?.productDesc || "No description available"}</li>
        </ul>
        <div className="sizes">
          {["40", "42", "44", "46"].map(size => (
            <div key={size} className="size">{size}</div>
          ))}
        </div>
      
        <div id='btns-viewProduct'>
         <button
     className="card-button"
     onClick={() => handleToggleWishlistMethods(product.productId)}
   >
     <i
       className="fas fa-heart"
       style={{ color: wishListStatus[product.productId] ? "red" : "black" }} // Change color based on currentStatus
     ></i>
   </button>
      
        <button onClick={() => addItemToCart(product.productId)} style={{ marginLeft: '5px' }} className="Btn">Add To Cart</button>
{" "}<button className="Btn">Buy</button>
        </div>
      </article>
    </div>
  );
};

function RelatedProduct({product}) {


console.log(product.category.categoryId);
  return (
  <div className='related-products'>
  <h4 className='related-products-title' >Similar Products</h4>
    <div className='allProducts'>
   {
   <Card catId={product.category.categoryId}/>
   }
    </div>
    </div>
  )
}





const ProductView = () => {
  const location = useLocation();
  const [product, setProduct] = useState(null);
  let [count, setCount]=useState(null)
  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product);
    }
  }, [location.state]);



  return (
    <div className="product-view">
      {product ? <ProductDetails product={product} /> : <p>Loading...</p>}
     {product ? <RelatedProduct product={product} /> : <p>Loading...</p>}

    </div>
  );
};

export default ProductView;
