import React, { useEffect, useState } from 'react';
import './Category.css';
import Card from '../Card/Card';
import ClothCard from '../Card/ClothCard'; 
import RandomProduct from '../RandomProduct/RandomProduct';
import CategoryService from '../Service/CategoryService';

function Category() {
  const [categories, setCategories] = useState([]);
  const [randomIds, setRandomIds] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    CategoryService.loadCategory()
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
        generateRandomIds(res.data); // Pass the entire category array
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const generateRandomIds = (categories) => {
    const ids = [];
    categories.forEach((category) => {
      if (category.categoryId % 2 !== 0) {
        ids.push(category.categoryId); // Store even category IDs
        console.log(category.categoryId);
      }
    });
    setRandomIds(ids);
  };

  // Scroll functions for each category
  const scrollLeft = (index) => {
    document.getElementById(`category-products-${index}`).scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = (index) => {
    document.getElementById(`category-products-${index}`).scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <>
      {categories.length > 0 ? (
        categories.map((category, index) => {
          return (
            <div className='category-list' key={category.categoryId}>
              <h2 className='category-title'>
                {category.title} &nbsp; &nbsp;<span>&gt;</span>
              </h2>
              <div className='categories-products'>
                <button className='scroll-btn' onClick={() => scrollLeft(index)}>&lt;</button>
                <div id={`category-products-${index}`} className='category-products-container'>
                  {category.title.toLowerCase().includes("clothes") ? (
                    <ClothCard catId={category.categoryId} />
                  ) : (
                    <Card catId={category.categoryId} />
                  )}
                </div>
                <button className='scroll-btn' onClick={() => scrollRight(index)}>&gt;</button>
              </div>

              {/* Conditionally render RandomProduct for even categoryId */}
              {randomIds.includes(category.categoryId) && (
                <div className='random-product-container'>
                  <RandomProduct id={randomIds} />
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div>Loading ....</div>
      )}
    </>
  );
}

export default Category;
