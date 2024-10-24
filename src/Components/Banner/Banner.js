import "./Banner.css";
import Carousel from "react-multi-carousel";
import { bannerData } from "../Constant/Data";
import { styled } from "@mui/system";
import "react-multi-carousel/lib/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import topOffers from "../assets/top offers.webp";
import tvsandapp from "../assets/tvs and appliances.webp";
import toys from "../assets/toys.webp";
import travels from "../assets/travels.webp";
import mobandtab from "../assets/Mobiles and tabets.webp";
import fashions from "../assets/Fashions.webp";
import groceries from "../assets/groceries.webp";
import furnitures from "../assets/furnitures.webp";
import homeandkitch from "../assets/home ad kitchens.webp";
import electronics from "../assets/Electronics.webp";
import { useContext, useEffect, useState } from "react";
import { BASE_URL } from "../Service/axios-helper";
import CartService from "../Service/CartService";
import productService from "../Service/productService";
import Toastify from "../ToastNotify/Toastify";
import iphone12 from "../Card/iphone.png";
import galaxy15gif from "../assets/galaxxm15g.gif";
import iphone13gif from "../assets/iphone 13.gif";
import iqoogif from "../assets/iqoo.gif";
import narzo70gif from "../assets/Narzo70.gif";
import nordce from "../assets/Nordce.gif";
import technopopgif from "../assets/Technopop95g.gif";
import { Context } from "../Context";
import RandomProduct from "../RandomProduct/RandomProduct";
import searchIcon from "../Navbar/search.png";
import CategoryService from "../Service/CategoryService";
import { useNavigate } from "react-router-dom";
const Image = styled("img")({
  width: "100%",
  objectFit: "cover",
});

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

function Banner() {
  const [products, setProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const {
    setSearchInput,
    searchInput,
    handleToggleWishlistMethods,
    wishListStatus,
  } = useContext(Context);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [wishList, setWishList] = useState(false);
  const navigate = useNavigate();

  const getImageUrl = (imageNames, id) => {
    products.map((product, index) => {
      if (index === id) {
        console.log(product);
      }
    });
    if (imageNames && imageNames.length >= 0) {
      const image = imageNames[0];
      const imageUrl = `${BASE_URL}/product/products/images/${image}`;
      console.log(imageUrl);

      return imageUrl;
    }
    return iphone12;
  };

  console.log(
    products.map((product) => {
      return getImageUrl(product.imageNames[0]);
    })
  );
  useEffect(() => {
    const handleScroll = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth > 1300) {
        if (window.scrollY > 620) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else if (screenWidth <= 1300 && screenWidth > 1193) {
        if (window.scrollY > 1200) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else if (screenWidth <= 1193 && screenWidth > 1121) {
        if (window.scrollY > 1000) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else if (screenWidth <= 1121 && screenWidth > 1024) {
        if (window.scrollY > 800) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else if (screenWidth <= 1024 && screenWidth > 768) {
        if (window.scrollY > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else if (screenWidth <= 768 && screenWidth > 600) {
        if (window.scrollY > 600) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else if (screenWidth <= 600 && screenWidth > 450) {
        if (window.scrollY > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else if (screenWidth >= 360 && screenWidth < 450) {
        if (window.scrollY > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else if (screenWidth < 360) {
        if (window.scrollY > 480) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchCategory();
  }, []);
  const fetchCategory = () => {
    CategoryService.loadCategory()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  };
  const handleSearch = () => {
    setSearchInput(searchTerm);
    setSearchTerm("");
  };
  const handleCategoryChange = (event) => {
    const selectedTitle = event.target.value;
    const selectedCategory = categories.find(
      (cat) => cat.title === selectedTitle
    );
    if (selectedCategory) {
      navigate(`/category/${selectedCategory.categoryId}`);
    } else {
      navigate("/");
    }
  };

  console.log(searchInput);

  useEffect(() => {
    productService
      .getAllProductsDetails()
      .then((res) => {
        console.log(res.data.content);
        setProducts(res.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const filteredProducts = products.filter((product) => {
    const productDesc = product.productDesc
      ? product.productDesc.trim().toLowerCase()
      : "";
    const productName = product.productName
      ? product.productName.trim().toLowerCase()
      : "";
    const productCategory = product.category.title
      ? product.category.title.trim().toLowerCase()
      : "";
    const trimmedSearchInput = searchInput.trim().toLowerCase();

    return (
      productDesc.includes(trimmedSearchInput) ||
      productName.includes(trimmedSearchInput) ||
      productCategory.includes(trimmedSearchInput)
    );
  });

  console.log(filteredProducts);

  const randomProducts = [
    iqoogif,
    narzo70gif,
    nordce,
    technopopgif,
    galaxy15gif,
  ];

  const randomIndex = Math.floor(Math.random() * randomProducts.length);

  const selectedProduct = randomProducts[randomIndex];

  console.log("Randomly selected product:", selectedProduct);

  return (
    <>
      {filteredProducts.length !== products.length ? (
        <div className="SearchedproductsWrapper">
          <h2>
            Searched As :
            <span style={{ fontWeight: "900", fontSize: "3rem" }}>
              {" "}
              {searchInput}{" "}
            </span>
          </h2>
          <img src={iphone13gif}></img>
          <div className="searchedProducts">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => {
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
                          onClick={() =>
                            handleToggleWishlistMethods(product.productId)
                          }
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
                          navigate(`/productView/${product?.productId}`, {
                            state: { product: product },
                          });
                        }}
                        src={getImageUrl(product.imageNames, product.productId)}
                        alt={product.productName || "Product"}
                        onError={(e) => {
                          e.target.src = iphone12;
                        }}
                      />
                      <div
                        onClick={() => {
                          navigate(`/productView/${product?.productId}`, {
                            state: { product: product },
                          });
                        }}
                        className="card-content"
                      >
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
        </div>
      ) : (
        <div className="banner">
          <Carousel
            responsive={responsive}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={4000}
            className="scroll"
          >
            {bannerData.map((data, index) => (
              <Image
                key={index}
                src={data.url}
                alt={`Banner image for ${data.altText || `banner ${index}`}`}
              />
            ))}
          </Carousel>

          <img
            id="randomProduct"
            height={500}
            src={selectedProduct}
            alt="Random product"
          />

          <div className="categories">
            <div id="categories__item1" className="categories__item1">
              <div className="categories__item">
                <img src={topOffers} alt="Top Offers" />
                <span>Top Offers</span>
              </div>
              <div className="categories__item">
                <img src={mobandtab} alt="Mobiles & Tablets" />
                <span>Mobiles & Tablets</span>
              </div>
              <div className="categories__item">
                <img src={tvsandapp} alt="TVs & Appliances" />
                <span>TVs & Appliances</span>
              </div>
              <div className="categories__item">
                <img src={electronics} alt="Electronics" />
                <span>Electronics</span>
              </div>
              <div className="categories__item">
                <img src={homeandkitch} alt="Home & Kitchens" />
                <span>Home & Kitchens</span>
              </div>
            </div>

            <div className="categories__item2">
              <div className="categories__item">
                <img src={fashions} alt="Fashions" />
                <span>Fashions</span>
              </div>
              <div className="categories__item">
                <img src={groceries} alt="Groceries" />
                <span>Groceries</span>
              </div>
              <div className="categories__item">
                <img src={furnitures} alt="Furnitures" />
                <span>Furnitures</span>
              </div>
              <div className="categories__item">
                <img src={toys} alt="Toys" />
                <span>Toys</span>
              </div>
              <div className="categories__item">
                <img src={travels} alt="Travels" />
                <span>Travels</span>
              </div>
            </div>
          </div>

          {isVisible && (
            <div className="bottom-header">
              <div className="bottom-header-input">
                <div className="search__bar__bottom-header">
                  <div className="bottom-header-dropdown1">
                    <select
                      name="Categories"
                      id="Categories"
                      onChange={handleCategoryChange}
                    >
                      <option value="All Categories">All Categories</option>
                      {categories.length > 0 &&
                        categories.map((cat) =>
                          cat.title.toLowerCase().includes("clothes") ? (
                            <option key={cat.categoryId} value={cat.title}>
                              Clothes
                            </option>
                          ) : null
                        )}
                      {categories.length > 0 &&
                        categories.map((cat) =>
                          cat.title.toLowerCase().includes("electronics") ? (
                            <option key={cat.categoryId} value={cat.title}>
                              {cat.title.slice(25, 33)}
                            </option>
                          ) : null
                        )}

                      {categories.length > 0 &&
                        categories.map((cat) =>
                          cat.title.toLowerCase().includes("groceries") ? (
                            <option key={cat.categoryId} value={cat.title}>
                              Groceries
                            </option>
                          ) : null
                        )}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button onClick={handleSearch}>
                    <img src={searchIcon} alt="Search Icon" />
                  </button>
                </div>
              </div>
              <ul id="ul">
                <li>
                  <img src={topOffers} alt="Top Offers" />
                  Top Offers
                </li>
                <li>
                  <img src={mobandtab} alt="Mobiles & Tablets" />
                  Mobiles & Tablets
                </li>
                <li>
                  <img src={tvsandapp} alt="TVs & Appliances" />
                  TVs & Appliances
                </li>
                <li>
                  <img src={electronics} alt="Electronics" />
                  Electronics
                </li>
                <li>
                  <img src={homeandkitch} alt="Home & Kitchens" />
                  Home & Kitchens
                </li>
                <li>
                  <img src={fashions} alt="Fashions" />
                  Fashions
                </li>
                <li>
                  <img src={groceries} alt="Groceries" />
                  Groceries
                </li>
                <li>
                  <img src={furnitures} alt="Furnitures" />
                  Furnitures
                </li>
                <li>
                  <img src={toys} alt="Toys" />
                  Toys
                </li>
                <li>
                  <img src={travels} alt="Travels" />
                  Travels
                </li>
              </ul>
            </div>
          )}

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
                          onClick={() =>
                            handleToggleWishlistMethods(product.productId)
                          }
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
                      
                      </div>

                      <img
                        onClick={() => {
                          navigate(`/productView/${product?.productId}`, {
                            state: { product: product },
                          });
                        }}
                        src={getImageUrl(product.imageNames, product.productId)}
                        alt={product.productName || "Product"}
                        onError={(e) => {
                          e.target.src = iphone12;
                        }}
                      />
                      <div
                        onClick={() => {
                          navigate(`/productView/${product?.productId}`, {
                            state: { product: product },
                          });
                        }}
                        className="card-content"
                      >
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
        </div>
      )}
    </>
  );
}

export default Banner;
