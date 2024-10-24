import React, { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import productService from "../Service/productService";
import CategoryService from '../Service/CategoryService';
import Card from "../Card/Card";
import img from '../CategoryBlock/clothimg.png'
import './Category.css'
function Category() {
  const { catId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await CategoryService.loadCategoryById(catId);
        setCategory(res.data);
      } catch (err) {
        console.log(err);
      }
    };


    fetchCategory();
   
  }, [catId]);

  return (
    <div className="category">
      {category ? ( 
        <h2 className="category-title">{category.title}</h2>
      ) : (
        <h2>Loading category...</h2> // Loading state
      )}
      <div>
        <img src={img ? img : ''} alt="Category" /> {/* Add image URL if available */}
        <div className="allProducts">
         { catId && (
          <Card catId={catId}/>
         ) }
        </div>
      </div>
    </div>
  );
}

export default Category;
