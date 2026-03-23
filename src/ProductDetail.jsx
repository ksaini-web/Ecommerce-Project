import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import { useParams } from 'react-router-dom'
import axios from 'axios'
import RelatedProducts from './RelatedProducts';
import {useContext} from "react";
import {CartContext} from './CartContext';
import Navbar from './Navbar';


function ProductDetail() {

    const {id} = useParams();
    const[product,setproducts] = useState(null);
    const[relatedProducts ,setrelatedProducts] = useState([]);
//remove same id 
    const FilteredProduct =  product ? relatedProducts.filter(
      p=>product && p.id !== product.id):[];
   

    const decreaseQty =()=>{

      if(qty>1){
       setQty(qty-1);
      }

    };

    const {addToCart} = useContext(CartContext);

    


    


    const [qty , setQty] = useState(1);
    console.log(product,qty);
   

    useEffect(()=>{
        axios.get(`https://dummyjson.com/products/${id}`)
        .then(res=>setproducts(res.data))
        .catch(err=>console.log(err)); 
    },[id]);

    useEffect(()=>{
      if(product){
          axios.get(`https://dummyjson.com/products/category/${product.category}`)
           .then(res =>setrelatedProducts(res.data.products) )
           .catch(err =>console.log(err));
      }
      },[product]
    )




    if(!product) return <p>Loading</p>
  return (
    <div>

      <Navbar/>
        
        <div className='gap-12 m-3 px-7 py-7 max-w-7xl mx-auto p-5  flex-col grid md:grid-cols-2 md:flex-row items-start '>
            
            <div className='bg-white p-6 rounded-2xl shadow-2xl'>
            <img src={product.thumbnail} className='w-full h-[300px] sm:h-[300px] md:h-[300px]   lg:h-[400px] object-cover '/>
           </div>
           <div>
            <h1 className='text-3xl font-bold'>{product.title}</h1>
            <h1 className='text-yellow-400'>★ {product.rating}</h1>
            <p className='mt-4 text-2xl font-semibold text-green-600'>$ {product.price*qty}</p>
           <h1 className='mt-4 text-gray-600'>{product.description}</h1>
           
           
           <div className='text-2xl font-extrabold bg-amber-300  m-8 py-1.5 rounded-full text-center h-12 w-40 '>
            
            <button className='mr-7 cursor-pointer ' onClick={decreaseQty}>-</button>
            <span className=''>{qty}</span>
            <button className='ml-7 cursor-pointer 'onClick={()=>setQty(qty+1)}>+</button>
            </div>

           
            <button className='mt-6 border  bg-white text-black px-6 py-3 rounded-b-md hover:bg-orange-600 hover:cursor-pointer hover:shadow-2xl font-semibold text-xl' onClick={()=> addToCart(product,qty)}>Add To Cart</button>
           
                      <button className=' ml-10 mt-6 bg-yellow-400 text-black px-6 py-3 rounded-b-md hover:bg-yellow-600 hover:cursor-pointer hover:shadow-2xl font-semibold text-xl'>Buy Now </button>
                      


           
           
</div>


        </div>

        <div>
          <RelatedProducts products={FilteredProduct}/>
          
        </div>
    </div>
  )
}

export default ProductDetail