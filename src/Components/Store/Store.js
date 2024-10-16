import React from 'react'
import './Store.css'
import Banner from '../Banner/Banner'
import Category from '../CategoryBlock/Category'
import AllProduct from '../Allproducts/AllProduct'
function Store() {
  return (
    <div className='home'>
    <Banner/>
    <AllProduct/>
    <Category/>
    </div>
  )
}

export default Store