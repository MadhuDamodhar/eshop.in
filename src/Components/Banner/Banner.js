
import './Banner.css';
import Carousel from 'react-multi-carousel';
import { bannerData } from '../Constant/Data';
import { styled } from '@mui/system';
import 'react-multi-carousel/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import top from '../assets/BestDealOnSmartPhones/top.webp'
import galaxys23 from '../assets/BestDealOnSmartPhones/galaxys235g.webp'
import motoedge50pro from '../assets/BestDealOnSmartPhones/motoedge50pro.webp'
import motorola from '../assets/BestDealOnSmartPhones/motorola g85.webp'
import oppok11x5g from '../assets/BestDealOnSmartPhones/oppok11x5g.webp'
import realmep15g from '../assets/BestDealOnSmartPhones/realmep15g.webp'
import samsunngA14 from '../assets/BestDealOnSmartPhones/samsunngA14.webp'
import topOffers from '../assets/top offers.webp'
import tvsandapp from '../assets/tvs and appliances.webp'
import toys from '../assets/toys.webp'
import travels from '../assets/travels.webp'
import mobandtab from '../assets/Mobiles and tabets.webp'
import fashions from '../assets/Fashions.webp'
import groceries from "../assets/groceries.webp"
import furnitures from "../assets/furnitures.webp"
import homeandkitch from "../assets/home ad kitchens.webp"
import electronics from '../assets/Electronics.webp'
const Image = styled('img')({
  width: '100%',
  objectFit: 'cover', 
  
});

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1

  }
};

function Banner() {
  

  return (
    <div className='banner'>
     <Carousel responsive={responsive}
    dotListClass="custom-dot-list-style"
    itemClass="carousel-item-padding-40-px"
    infinite={true}
    autoPlay={true}
    autoPlaySpeed={4000}
    className='scroll'  // This class will apply the height based on the screen size
>
  {bannerData.map((data, index) => (
    <Image key={index} src={data.url} alt={`Banner image for ${data.altText || `banner ${index}`}`} />
  ))}
</Carousel>


<div className='categories'>
<div id='categories__item1' className='categories__item1'>


<div className='categories__item'>
<img src={topOffers}></img>
<span>Top Offers</span>
</div>

<div className='categories__item'>
<img src={mobandtab}></img>
<span>Mobiles & Tablets</span>
</div>

<div className='categories__item'>
<img src={tvsandapp}></img>
<span>Tvs & Appliances</span>
</div>

<div className='categories__item'>
<img src={electronics}></img>
<span>Electronics</span>
</div>
  
<div className='categories__item'>
<img src={homeandkitch}></img>
<span>Home & Kitchens</span>
</div> 
</div>

<div className='categories__item2'>
<div className='categories__item'>
<img src={fashions}></img>
<span>Fashions</span>
</div>

<div className='categories__item'>
<img src={groceries}></img>
<span>Groceries</span>
</div>

<div className='categories__item'>
<img src={furnitures}></img>
<span>Furnitures</span>
</div>

<div className='categories__item'>
<img src={toys}></img>
<span>Toys</span>
</div>

<div className='categories__item'>
<img src={travels}></img>
<span>Travels</span>
</div>

</div>
</div>

<div className='BestSmartPhones'>
<img id='top' src={top}></img>
<div className='row1'>
<img src={galaxys23}></img>
<img src={motoedge50pro}></img>
<img src={motorola}></img>
</div>
<div className='row2'>
<img src={oppok11x5g}></img>
<img src={realmep15g}></img>
<img src={samsunngA14}></img>
</div>
</div>
    </div>
  );
}

export default Banner;
