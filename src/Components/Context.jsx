import React, { createContext, useState, useEffect } from 'react';  
import CartService from './Service/CartService';
import WishlistService from './Service/WishlistService';
import Toastify from './ToastNotify/Toastify';
import productService from './Service/productService';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [cartDetails, setCartDetails] = useState();
  const [cartItems, setCartItems] = useState([]);
  const [wishListCount, setWishlistCount] = useState(0);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishListStatus, setWishListStatus] = useState({});
  const [products,setProducts]=useState([])
  const [currentStatus ,setCurrentStatus]=useState(null);
  useEffect(() => {
    fetchWishlistItems();
    fetchProduct();
    fetchCartDetails();
  }, []); 

  const fetchCartDetails = () => {
    CartService.fetchCartDetails()
      .then((result) => {
        setCartCount(result.data.items.length);
        setCartDetails(result.data);
        setCartItems(result.data.items);
      })
      .catch((err) => {
        console.log('Error fetching cart details:', err);
      });
  };

  const fetchWishlistItems = () => {
    WishlistService.fetchWishlistItems()
      .then((res) => {
        setWishlistProducts(res.data.wishListItems);
        setWishlistCount(res.data.wishListTotalItems);

        // Initialize wishlist status based on the fetched items
        const initialWishListStatus = {};
        res.data.wishListItems.forEach((item) => {
          initialWishListStatus[item.product.productId] = true; 
          console.log(item.id , "id fetched" , initialWishListStatus);
        });
        setWishListStatus(initialWishListStatus);
        
      })
      .catch((err) => {
        console.log('Error fetching wishlist items:', err);
      });

      
  };

  const fetchProduct = () => {
    productService.getAllProductsDetails()
      .then((res) => {
        setProducts(res.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleToggleWishlistMethods = (id) => {
    const currentStatus = wishListStatus[id] || false; 
    setCurrentStatus(currentStatus);
console.log(id , "id fetched" , currentStatus);

    if (currentStatus) {
      handleRemoveFromWishlist(id);
      console.log("Removed from wishlist");
      fetchWishlistItems()
    } else {
      handleWishlist(id);
      console.log("Added to wishlist");
      fetchWishlistItems()
    }

    // Update the local wishlist status
    setWishListStatus((prevStatus) => ({
      ...prevStatus,
      [id]: !currentStatus,
    }));
  };

  const handleWishlist = (id) => {
    WishlistService.addToWishlist(id)
      .then((res) => {
        setWishlistCount(res.data.wishListTotalItems);
        Toastify.showSuccessMessage("Product added to wishlist");
      })
      .catch((err) => {
        console.log(err);
        Toastify.showErrorMessage("Something went wrong");
      });
  };

  const handleRemoveFromWishlist = (id) => {
    WishlistService.deleteItemOfWishlist(id)
      .then((res) => {
        setWishlistCount(res.data.wishListTotalItems);  // Ensure count is updated after removal
        Toastify.showSuccessMessage("Product removed from wishlist");
      })
      .catch((err) => {
        console.log(err);
        Toastify.showErrorMessage("Something went wrong");
      });
  };
  useEffect(() => {
    fetchWishlistItems();
  }, [wishListCount , currentStatus]);

  
  const addItemToCart = (id) => {
    CartService.addToCart({
      productId: id,
      quantity: 1,  // Update as needed
    })
      .then((res) => {
        setCartCount(res.data.cartTotalItems);
        Toastify.showSuccessMessage("Product added to cart");
      })
      .catch((err) => {
        console.log(err);
        Toastify.showErrorMessage("Something went wrong");
      });
  };

  const handleRemoveCartItem = (cartItemId) => {
    CartService.removeCartItem(cartItemId)
      .then((res) => {
        fetchCartDetails();
        Toastify.showSuccessMessage("Item removed");
      })
      .catch((err) => {
        Toastify.showErrorMessage("Something went wrong");
      });
  };

  const [NavigationCount, setNavigationCount] = useState(() => {
    const savedCount = sessionStorage.getItem("NavigationCount");
    return savedCount ? parseInt(savedCount) : 0;
  });

  const handleNavigation = (newCount) => {
    sessionStorage.setItem("NavigationCount", newCount);
    const storedCount = sessionStorage.getItem("NavigationCount");
    if (parseInt(storedCount) === newCount) {
      setNavigationCount(newCount);
    }
  };

  return (
    <Context.Provider
      value={{
        cartCount,
        setCartCount,
        progress,
        setProgress,
        cartDetails,
        cartItems,
        searchInput,
        setSearchInput,
        fetchCartDetails,
        wishListCount,
        addItemToCart,
        handleRemoveCartItem,
        wishlistProducts,
        handleNavigation,
        NavigationCount,
        handleToggleWishlistMethods,
        currentStatus,
        wishListStatus
      }}
    >
      {children}
    </Context.Provider>
  );
};
