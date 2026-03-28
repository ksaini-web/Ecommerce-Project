import React, { useState, useEffect } from 'react'
import TopBar from '../TopBar'
import Navbar from '../Navbar'
import HeroSection from '../HeroSection'
import Cards from '../Cards'
import axios from "axios"

function Home() {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  function shuffleArray(array){
    for(let i = array.length-1; i > 0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    axios.get("https://dummyjson.com/products")
      .then((res) => {
        const data = shuffleArray(res.data.products);
        setProducts(data);
        setFilteredProducts(data); 
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className='bg-yellow-500 min-h-screen w-full'>

      <div className='lg:ml-9 mx-3'>

        <div className='mx-auto pt-10 shadow-lg rounded-xl'>
          <TopBar/>
        </div>

        <div className='bg-amber-50'>
          <div className='mx-5'>

            <Navbar
              products={products}
              setFilteredProduct={setFilteredProducts}
            />

            <HeroSection/>

            <Cards products={filteredProducts} />

          </div>
        </div>

      </div>
    </div>
  )
}

export default Home