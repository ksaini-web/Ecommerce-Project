import React, { useState } from 'react'
import { MdAddShoppingCart } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import {Link} from "react-router-dom"

const handleFilter = (type) =>{

    let Filtered = [];

    if(type === "Deals"){
       Filtered = products.filter(item => item.discountPercentage > 0) ;
    }
    else if(type === "What's New"){
       Filtered = products.slice(0,10); 
    }

    else if(type === "Delivery"){
    Filtered = products.filter(item => item.stock>0);

    }

    
    }


function Navbar() {

    const [ meanOpen,setMenuOpen] = useState(false)

    const menuItems = ["Categories","Deals","What's New","Delivery"]
  return (
    <div className='bg-white  flex items-center justify-between px-4 py-2 relative font-bold'>
       <Link to="/"><h1 className='font-extrabold mr-2.5 lg:text-xl text-green-900 flex items-center  '><span className='text-3xl '><MdAddShoppingCart /></span>Shopcart </h1></Link> 


        <ul className='hidden lg:flex  justify-center gap-7 items-center'>

            {
                menuItems.map((item,index) =>(
                    <li key={index} className='flex items-center  z-10'>
                        {item}
                                                    {item === "Categories" && (
                                <RiArrowDropDownLine className='text-2xl' />

                            ) }
                        
                        </li>

                ))

            }
            

            </ul>

                                         <li className='  bg-amber-300 flex  w-76 h-7 justify-center items-center  rounded-full w-  px-1.5 py-1'><input type="text" placeholder='Search Product' /><FaSearch className='cursor-pointer bg-transparent outline-none flex-1'/> </li>
 <li className='flex items-center gap-0.5'><FaRegUser />Account </li>

            <li className=' gap-0.5 '><Link to="/cart" className='flex  items-center lg:mr-3.5'>Cart <MdAddShoppingCart /></Link></li>
           

        <IoMenu 
        className='text-2xl lg:hidden cursor-pointer'
        onClick={()=>setMenuOpen(!meanOpen)}
        
        />

        {
          meanOpen && (

            <div className='lg:hidden px-4 pb-3 absolute ml-30 top-12 left-4/6 bg-white  shadow-lg  rounded-b-3xl'>
                

                <ul className='flex flex-col gap-3'>

                    {
                        menuItems.map((item , index)=>(
                            
                            <li key={index} className='flex items-center gap-1'>
                                {item}
                            {item === 'Categories' && (
                              <RiArrowDropDownLine className='text-2xl  '/>

                            )}
                            </li>
                        ))}

                        
            
          
        
                    

                </ul>

            </div>
          )  
        }
    </div>
  )
}

export default Navbar