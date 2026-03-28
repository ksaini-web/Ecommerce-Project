import React, { useState, useEffect } from 'react'
import TopBar from '../TopBar'
import Navbar from '../Navbar'
import HeroSection from '../HeroSection'
import Cards from '../Cards'
import axios from "axios"

function Home() {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;

  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    axios.get("https://dummyjson.com/products")
      .then((res) => {
        setProducts(res.data.products);
        setFilteredProducts(res.data.products);
      })
      .catch((err) => console.log(err));
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
              setCurrentPage={setCurrentPage}
            />

            <HeroSection/>

            <Cards products={currentProducts} />

           
            <div className="flex justify-center gap-4 my-5">
              <button 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLast >= filteredProducts.length}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 "
              >
                Next
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Home