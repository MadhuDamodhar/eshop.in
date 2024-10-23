import React from 'react';
import mobilestop from '../assets/BestDealOnSmartPhones/top.webp';
import galaxys23 from '../assets/BestDealOnSmartPhones/galaxys235g.webp';
import motoedge50pro from '../assets/BestDealOnSmartPhones/motoedge50pro.webp';
import motorola from '../assets/BestDealOnSmartPhones/motorola g85.webp';
import oppok11x5g from '../assets/BestDealOnSmartPhones/oppok11x5g.webp';
import realmep15g from '../assets/BestDealOnSmartPhones/realmep15g.webp';
import samsunngA14 from '../assets/BestDealOnSmartPhones/samsunngA14.webp';

import './RandomProduct.css';

function RandomProduct({ index }) {
  console.log(index);

  return (
    <div className='RandomProduct-wrapper'>
      {index % 31 === 0 ? (
        <div className='BestProducts'>
          <img id='top' src={mobilestop} alt='Top Smartphones'></img>
          <div className='row1'>
            <img src={galaxys23} alt='Galaxy S23'></img>
            <img src={motoedge50pro} alt='Moto Edge 50 Pro'></img>
            <img src={motorola} alt='Motorola G85'></img>
          </div>
          <div className='row2'>
            <img src={oppok11x5g} alt='Oppo K11X 5G'></img>
            <img src={realmep15g} alt='Realme P15 5G'></img>
            <img src={samsunngA14} alt='Samsung A14'></img>
          </div>
        </div>
      ) : index % 15 === 0 ? (
        <div className='BestProducts'>
        <img id='top' src={mobilestop} alt='Top Smartphones'></img>
        <div className='row1'>
          <img src={galaxys23} alt='Galaxy S23'></img>
          <img src={motoedge50pro} alt='Moto Edge 50 Pro'></img>
          <img src={motorola} alt='Motorola G85'></img>
        </div>
        <div className='row2'>
          <img src={oppok11x5g} alt='Oppo K11X 5G'></img>
          <img src={realmep15g} alt='Realme P15 5G'></img>
          <img src={samsunngA14} alt='Samsung A14'></img>
        </div>
        </div>
      ) :  index % 47 === 0 ?(
        <div className='BestProducts'>
        <img id='top' src={mobilestop} alt='Top Smartphones'></img>
        <div className='row1'>
          <img src={galaxys23} alt='Galaxy S23'></img>
          <img src={motoedge50pro} alt='Moto Edge 50 Pro'></img>
          <img src={motorola} alt='Motorola G85'></img>
        </div>
        <div className='row2'>
          <img src={oppok11x5g} alt='Oppo K11X 5G'></img>
          <img src={realmep15g} alt='Realme P15 5G'></img>
          <img src={samsunngA14} alt='Samsung A14'></img>
        </div>
        </div>
      ) :index % 63 === 0 ?(
        <div className='BestProducts'>
        <img id='top' src={mobilestop} alt='Top Smartphones'></img>
        <div className='row1'>
          <img src={galaxys23} alt='Galaxy S23'></img>
          <img src={motoedge50pro} alt='Moto Edge 50 Pro'></img>
          <img src={motorola} alt='Motorola G85'></img>
        </div>
        <div className='row2'>
          <img src={oppok11x5g} alt='Oppo K11X 5G'></img>
          <img src={realmep15g} alt='Realme P15 5G'></img>
          <img src={samsunngA14} alt='Samsung A14'></img>
        </div>
        </div>
      ):null}
    </div>
  );
}

export default RandomProduct;
