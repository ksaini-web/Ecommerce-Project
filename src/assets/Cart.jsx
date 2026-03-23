import React, { useContext } from 'react'

import { CartContext } from '../CartContext'
import Navbar from '../Navbar';

import { Link } from 'react-router-dom';

import { FaCartArrowDown } from "react-icons/fa";

function Cart() {

    const {cart} = useContext(CartContext);
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (

    <div>
        <Navbar/>
    <div className='max-w-7xl mx-auto  p-5 bg-white rounded-2xl shadow-lg '>
     
     <div className='text-center  text-lg font-extrabold  md:text-2xl rounded-2xl w-2xl bg-amber-300'> Hurry up! Your items are reserved for 10 minutes</div>
    
    <div className='mt-28'>
        {
            cart.length === 0 ?
             (
                <p className='text-2xl font-bold text-center flex  flex-col text-gray-700 '> <FaCartArrowDown className='mx-auto my-6 animate-bounce text-9xl m-6'/><span className='text-2xl font-semibold'>Your cart is empty</span></p>
            ) : (
                cart.map(item =>(

                
                    <div key ={item.id} className='flex items-center justify-center  py-4  '>
                        
                      
                           
                      <div className='flex items-center gap-4 w-1/2'>
                        
                        <img className='h-24 w-24 object-cover rounded ' src={item.thumbnail}/>

                       
                         
                        

                        </div>
                       

                        <div className= 'w-1/4 font-bold text-lg '>
                            <h2 className='font-semibold text-lg'>{item.title}</h2>
                            <p className='text-gray-600'>Qty : {item.quantity}</p>
                        </div>

                        <p className='text-lg font-bold'>
                            ${item.price * item.quantity}
                        </p>
                    </div>

                ))
            )
        } 
        </div>

      <h1 className='text-2xl font-bold text-right mt-6 '> Total Price : ${total}</h1>
    </div>

    </div>
  )
}

export default Cart