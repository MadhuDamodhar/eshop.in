import React from 'react';
import './RandomProduct.css';
import Button from 'react-bootstrap/Button';
import randomImage from '../RandomProduct/Brown and White Simple Animated Fashion New Arrival Promo Video.gif';
import randomImage2 from '../RandomProduct/Basic Online Video Ad (OLV) in Navy 15s Sidebar Style.gif'
import image from '../RandomProduct/randomProduct.jpeg';

function RandomProduct({ randomIds }) {
  const data = [1, 2, 3, 4, 5];
  const randomProductName = {
    "randomProductNames": [
      "Curated Just for You",
      "Top Trending Picks",
      "Don’t Miss Out!",
      "Must-Have Selections",
      "Exclusive Offers Today",
      "Spotlight Products",
      "Discover Something New",
      "Hot Picks for You",
      "Featured Exclusives",
      "Limited Time Finds",
      "Today’s Special Selection",
      "Best-Selling Deals",
      "Specially Selected for You",
      "Unique Finds of the Day"
    ]
  };

  // Use a random index from randomIds to get a random product name
  const randomIndex = Math.floor(Math.random() *10);
  
  return (
    <div className='randomProduct'>
      <div className='randomProduct__image'>
        <img src={randomImage2} alt='random product'/>
      </div>
      <h2 className='heading' >{randomIndex !== null ? randomProductName.randomProductNames[randomIndex] : "Advertisement"}</h2>
      <div className='wrappers'>
        {
          data.map((item, index) => (
            <div className='products-lists' key={index}>
              <img src={image} alt='product'/>
              <p>Product Description</p>
              <Button variant='primary'>View Product</Button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default RandomProduct;
