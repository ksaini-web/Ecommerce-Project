import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import electronics from "./assets/electronics.jpg"
import Fashion from "./assets/Fashion.jpg"
import Grocery from "./assets/Grocery.jpg"
import Skincare from "./assets/Skincare.jpg"
import Sports from "./assets/Sports.jpg"

function HeroSection() {

    const slides = [{

        image:Fashion ,
        title:"Fashion Offers",
        desc:"UP to 25% OFF",
        
        button:"Stay Fit",

},

{

  
        image:electronics,
        title:"Electronics Sale",
        desc:"UP to 50% OFF",
        
        button:"Shop Now",

},

{

    image:Grocery,
        title:"Groceries Deals",
        desc:"UP to 30% OFF",
        
        button:"Shop Fresh",

},


{
 image:Skincare,
        title:"Beauty Products",
        desc:"UP to 35% OFF",
        
        button:"Explore Beauty",
 
}


];



    var settings = {
    dots: true,
    infinite: true,
    
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
     autoplay: true,
     speed: 800,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
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
    <div className='w-full h-[350px] overflow-hidden'>
        <Slider {...settings}>

              {
        slides.map((item,index)=>(

            <div key={index} className='relative h-[350px]'>


        <img  src={item.image} alt="" className='h-full w-full object-cover brightness-75 'loading="lazy" />

        <div className='absolute top-1/2 left-15 lg:left-20 -translate-y-1/2 text-gray-950'>
        <h1 className='text-4xl font-bold text-pink-500'> {item.title}</h1>
        <p className='text-xl font-medium'> {item.desc}</p>
        <button className='bg-black text-white px-6 py-2 mt-3 rounded-3xl hover:cursor-pointer'>
           {item.button}</button>

        </div>
      </div>
            
        ))

      }
      
      
    </Slider>
    </div>
  )
}

export default HeroSection