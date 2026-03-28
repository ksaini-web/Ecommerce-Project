import React, { useState } from 'react'
import { MdAddShoppingCart } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link } from "react-router-dom"
import { useContext } from 'react';
import { CartContext } from './CartContext';

function Navbar({ products, setFilteredProduct, setCurrentPage }) {

    const [menuOpen, setMenuOpen] = useState(false)
    const [search, setSearch] = useState("");

    const menuItems = ["Categories","Deals","What's New","Delivery"]

    const handleFilter = (type) => {

        let filtered = [];

        if(type === "Deals"){
           filtered = [...products]
             .filter(item => item.discountPercentage > 10)
             .sort((a,b) => b.discountPercentage - a.discountPercentage)
             .slice(0,10);
        }
        else if(type === "What's New"){
           filtered = products.slice(0,10);
        }
        else if(type === "Delivery"){
           filtered = products.filter(item => item.stock > 0);
        }
        else{
           filtered = products;
        }

        setFilteredProduct(filtered);
        setCurrentPage(1);
        setMenuOpen(false);
    }

    const handleSearch = (value) => {

        setSearch(value);

        if(value === ""){
            setFilteredProduct(products);
            setCurrentPage(1);
            return;
        }

        const filtered = products.filter(item =>
            item.title.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredProduct(filtered);
        setCurrentPage(1);
    }

    const {totalItems} = useContext(CartContext);

    return (
        <div className='bg-white flex items-center justify-between px-4 py-2 relative font-bold z-50'>

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
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={(e)=>{
                        if(e.key === "Enter"){
                           handleSearch(search);
                        }
                    }}
                />
                <FaSearch />
            </div>

            <div className='hidden lg:flex items-center gap-1'>
                <FaRegUser /> Account
            </div>

<Link to="/cart" className='relative flex items-center gap-1'>

    <div className='relative'>
        <MdAddShoppingCart className='text-2xl mt-2.5'/>

        
        {totalItems > 0 && (
            <span className='absolute -top-2 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full'>
                {totalItems}
            </span>
        )}
    </div>

    Cart

</Link>

            <IoMenu 
                className='text-2xl lg:hidden cursor-pointer'
                onClick={() => setMenuOpen(!menuOpen)}
            />

            {menuOpen && (
                <div className='lg:hidden px-4 py-3 absolute right-4 top-12 bg-white shadow-lg rounded-xl z-50'>
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