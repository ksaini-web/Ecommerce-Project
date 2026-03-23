

import React, { useState } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect } from 'react';
import axios from 'axios';

function Slider1()
 {

   const [products,setproducts] = useState([]);

   useEffect(() =>{

    axios.get("https://dummyjson.com/products")
    .then((res)=>{
      setproducts(res.data.products);
    })
    .catch((err)=>{
      console.log(err);
    })
   })



  var settings = {
    dots: true,
    infinite: false,
    speed: 2000,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplaySpeed: 2000,
      cssEase: "linear",
       autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div className='mt-10 mb-3'>
       <div className="slider-container">
      <Slider {...settings}>
       {
        products.map((product)=>(
          <div key={product.id}>

            <img  src={product.thumbnail}
            alt='img'
            className='h-60'/>

             
          </div>

        ))
       }
      </Slider>
    </div>
    </div>
  )
}

export default Slider1