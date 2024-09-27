import React from 'react'
import './Store.css'
import Banner from '../Banner/Banner'
import Base from '../Base'
import Category from '../CategoryBlock/Category'
function Store() {
  return (
    <div className='home'>
   <Base>
    <Banner/>
    <Category/>
    </Base>
    </div>
  )
}

export default Store