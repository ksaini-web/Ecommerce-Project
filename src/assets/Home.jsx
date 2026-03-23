import React from 'react'
import TopBar from '../TopBar'
import Navbar from '../Navbar'
import HeroSection from '../HeroSection'
import Cards from '../Cards'



function Home() {
  return (
    <div className='bg-yellow-500 min-h-screen w-full  '>


       <div className=' lg:ml-9 mx-3'>


     <div className='mx-auto  pt-10 shadow-lg rounded-xl'>
        <TopBar/>
          </div>

          <div className='bg-amber-50'>
        <div className='mx-5'>

            <Navbar/>
            <HeroSection/>
            <Cards/>
            
            </div>


            </div>
            </div>
     </div>
       
    
  )
}

export default Home