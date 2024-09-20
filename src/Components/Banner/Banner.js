
import './Banner.css';
import Carousel from 'react-multi-carousel';
import { bannerData } from '../Constant/Data';
import { styled } from '@mui/system';
import 'react-multi-carousel/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Image = styled('img')({
  width: '100%',
  height: 'auto',  // Make the height responsive
  height: 360,
  border: '15px solid black',
  overflow: 'hidden',
  class:'mt-5'
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
       className='carousel'
      >
        {bannerData.map((data, index) => (
          <Image key={index} src={data.url} alt={`Banner image for ${data.altText || `banner ${index}`}`} />
        ))}
      </Carousel>

    </div>
  );
}

export default Banner;
