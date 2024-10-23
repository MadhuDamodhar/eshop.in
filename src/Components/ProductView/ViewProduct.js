import React, { useContext, useEffect, useState } from 'react';
import './ProductView.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../Service/axios-helper';
import iphone12 from '../Card/iphone.png';
import RandomProduct from '../RandomProduct/RandomProduct';
import productService from '../Service/productService';
import { Context } from '../Context';
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
const {handleWishlist ,  handleToggleWishlistMethods,
    wishListStatus } = useContext(Context)
const [wishList , setWishList ] = useState(false)
const [products , setProducts]=useState([])

  const navigate = useNavigate()
const getImageUrl = (imageNames, id) => {
    products.map((product , index)=>{
     if(index===id){
      console.log(product);
     }
    })
   if (imageNames && imageNames.length >= 0) {
     const image = imageNames[0];
     const imageUrl = `${BASE_URL}/product/products/images/${image}`;
     console.log(imageUrl);

     return imageUrl;
   }
   return iphone12;
 };

useEffect(()=>{
   productService.getProductByCategoryId(product.category.categoryId).then((res)=>{
  console.log(res.data);
  setProducts(res.data.content)
  }).catch((err)=>{
    console.log(err);
    
    })
  },[])

console.log(product.category.categoryId);
  return (
  <div className='related-products'>
  <h4 className='related-products-title' >Similar Products</h4>
    <div className='allProducts'>
   {
   <div className="allProducts">
            {products.length > 0 ? (
              products.map((product, index) => {
                const isClothing = product.category?.title
                  ?.toLowerCase()
                  .includes("clothes");

                return (
                  <>
                    <div
                    
                      id="card"
                      className="card"
                      key={product.productId || product.id}
                    >
                      <div className="card-buttons">
                       
                      <button
     className="card-button"
     onClick={() => handleToggleWishlistMethods(product.productId)}
   >
     <i
       className="fas fa-heart"
       style={{ color: wishListStatus[product.productId] ? "red" : "black" }} // Change color based on currentStatus
     ></i>
   </button>
                        <button
                         
                          className="card-button"
                        >
                          <i class="fas fa-share-alt"></i>
                        </button>
                      </div>
                      <img   onClick={() => {
                        navigate(`/productView/${product?.productId}`, { state: { product: product } });
                      }}
                        src={getImageUrl(product.imageNames, product.productId)}
                        alt={product.productName || "Product"}
                        onError={(e) => {
                          e.target.src = iphone12;
                        }}
                      />
                      <div   onClick={() => {
                         navigate(`/productView/${product?.productId}`, { state: { product: product } });
                      }} className="card-content">
                        {product.live && <span className="live">Live</span>}

                        <h2 className="card-title">
                          {product.productName || "Product Name"}
                        </h2>
                        <p className="card-description">
                          {product.productDesc?.slice(0, 100) ||
                            "No description available"}
                          ..
                        </p>

                        <div className="price">
                          <span id="mrp">
                            MRP: ₹
                            {((110 / 100) * (product.productPrize || 0))
                              .toFixed(2)
                              .toLocaleString("en-IN")}
                          </span>
                          <br />
                          <p className="card-price">
                            ₹
                            {product.productPrize
                              ? product.productPrize.toLocaleString("en-IN")
                              : "N/A"}
                          </p>
                          <p id="discountTag" style={{ color: "green" }}>
                            10% off
                          </p>
                        </div>

                        
                        <span style={{ color: "red" }}>
                          {product.stock > 0 ? "" : "Out Of Stock"}
                        </span>
                      </div>
                    </div>
                    {(index + 1) % 16 === 0 && <RandomProduct index={index} />}
                  </>
                );
              })
            ) : (
              <p>No products available.</p>
            )}
          </div>
   }
    </div>
    </div>
  )
}





const ViewProduct = () => {
  const location = useLocation();
  const [product, setProduct] = useState(null);

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

export default ViewProduct;
