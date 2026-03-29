import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import electronics from './assets/electronics.jpg';
import Fashion from './assets/Fashion.jpg';
import Grocery from './assets/Grocery.jpg';
import Skincare from './assets/Skincare.jpg';
import './HeroSection.css';

function HeroSection() {
  const slides = [
    {
      image: Fashion,
      title: 'Fashion Offers',
      desc: 'Up to 25% off on sharp everyday looks',
      button: 'Style Picks',
    },
    {
      image: electronics,
      title: 'Electronics Sale',
      desc: 'Up to 50% off on smart essentials',
      button: 'Shop Now',
    },
    {
      image: Grocery,
      title: 'Groceries Deals',
      desc: 'Fresh picks with easy savings all week',
      button: 'Shop Fresh',
    },
    {
      image: Skincare,
      title: 'Beauty Products',
      desc: 'Glow-ready care with smooth daily deals',
      button: 'Explore Beauty',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3200,
    cssEase: 'ease',
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <section className="hero">
      <Slider {...settings}>
        {slides.map((item, index) => (
          <div key={index}>
            <div className="hero__slide">
              <img src={item.image} alt={item.title} className="hero__image" loading="lazy" />
              <div className="hero__overlay" />
              <div className="hero__content">
                <span className="hero__eyebrow">Seasonal spotlight</span>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
                <button type="button">{item.button}</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default HeroSection;
