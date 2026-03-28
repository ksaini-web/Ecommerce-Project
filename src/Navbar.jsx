import React, { useState,useEffect } from 'react'
import { MdAddShoppingCart } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link } from "react-router-dom"

function Navbar({ products, setFilteredProduct ,setCurrentPage}) {

    const [menuOpen, setMenuOpen] = useState(false)

    const menuItems = ["Categories","Deals","What's New","Delivery"]

    const handleFilter = (type) => {

        let filtered = [];

        if(type === "Deals"){
          
   filtered = products
     .filter(item => item.discountPercentage > 10)
     .sort((a,b) => b.discountPercentage - a.discountPercentage)
     .slice(0,10);
          }
        else if(type === "What's New"){
           filtered = products.slice(0,10);
        }
        else if(type === "Delivery"){
           filtered = products.filter(item => item.stock > 10);
        }
        else{
           filtered = products;
        }

        setFilteredProduct(filtered);
        setMenuOpen(false);
        setCurrentPage(1);
    }
     
    const [search,setSearch] = useState("");

    const handleSearch = (value) =>{

        if(value === ""){
            setFilteredProduct(products);
            return;
        }

        setSearch(value)

        const filtered = products.filter(item =>
        item.title.toLowerCase().includes(value.toLowerCase())
    );

    
    }

    return (
        <div className='bg-white flex items-center justify-between px-4 py-2 relative font-bold'>

            
            <Link to="/">
                <h1 className='font-extrabold lg:text-xl text-green-900 flex items-center'>
                    <span className='text-3xl'><MdAddShoppingCart /></span>
                    Shopcart
                </h1>
            </Link>

            
            <ul className='hidden lg:flex gap-7 items-center'>
                {menuItems.map((item,index) =>(
                    <li 
                        key={index} 
                        className='flex items-center cursor-pointer'
                        onClick={() => handleFilter(item)}
                    >
                        {item}
                        {item === "Categories" && (
                            <RiArrowDropDownLine className='text-2xl' />
                        )}
                    </li>
                ))}
            </ul>

            
            <div className='bg-amber-300 flex w-64 h-8 items-center rounded-full px-2'>
                <input 
                    type="text" 
                    placeholder='Search Product' 
                    className='bg-transparent outline-none flex-1 px-2'
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={(e)=>{
                        if(e.key === "Enter"){
                           handleSearch(); 
                        }
                    }}
                />
                <FaSearch />
            </div>

            
            <div className='hidden lg:flex items-center gap-1'>
                <FaRegUser /> Account
            </div>

           
            <Link to="/cart" className='flex items-center gap-1'>
                Cart <MdAddShoppingCart />
            </Link>

           
            <IoMenu 
                className='text-2xl lg:hidden cursor-pointer'
                onClick={() => setMenuOpen(!menuOpen)}
            />

            
            {menuOpen && (
                <div className='lg:hidden px-4 py-3 absolute right-4 top-12 bg-white shadow-lg rounded-xl'>
                    <ul className='flex flex-col gap-3'>
                        {menuItems.map((item,index)=>(
                            <li 
                                key={index} 
                                className='cursor-pointer'
                                onClick={() => handleFilter(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    )
}

export default Navbar