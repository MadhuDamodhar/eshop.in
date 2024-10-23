import React from 'react'
import { useParams } from 'react-router-dom'
import productService from '../Service/productService'

function Category() {
 const {catId } =useParams()
 productService.getProductByCategoryId(catId).then((res)=>{
  console.log(res.data);
 }).catch((err)=>{
console.log(err);

})
  return (
    <div className='category'>
     
    
    </div>
  )
}

export default Category