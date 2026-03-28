import React ,{ useState} from 'react'


import { Link } from 'react-router-dom';
import {useContext} from "react"

import { CartContext } from './CartContext';







  

   function Cards({products}) {
      

    const {addToCart} = useContext(CartContext);

   const [qty,setqty] = useState(1);

   
   console.log("Total:", products.length);
console.log("Deals:", products.filter(item => item.discountPercentage > 10).length)
;


    const categoryColors = {

        smartphones:"bg-blue-500",
        laptops:"bg-purple-500",
        fragrances:"bg-pink-500",
        beauty:"bg-green-500",
        groceries:"bg-yellow-500",
        
        "home-decoration":"bg-gray-500",
        others:"bg-gray-500"
    };

  




  return (
    <div>

    

    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5  '>

        {

 
           products?.map((product)=>{

                  const price = product.price;
    const discount = product.discountPercentage;

  
    const oldPrice = (price/(1-discount/100)).toFixed(2);

                const background = categoryColors[product.category]||categoryColors["others"];

                return(
                    <div  key={product.id} className='bg-white shadow-lg p-4 rounded-xl hover:shadow-2xl transition' >
                <Link to={`/productdetail/${product.id}`}>
                <div  className=''>
                                       <p className={`${background}  text-white  rounded-2xl inline-block text-center w-28 font-bold my-1.5 mb-2 px-3 py-1`}>Up To {product.discountPercentage}%</p>

                     <img src={product.thumbnail} alt={"img"} className='h-40 w-full object-contain mx-auto '/>
                     <div className='mt-2 text-center'>

                    <h1 className='text-sm font-extrabold ' >{product.title}</h1>
                 <div className='text-center  m-1'>
                    <p className='text-gray-400 line-through'>${oldPrice}</p>
                    <p  className='text-green-600 font-bold text-lg ml-1'>${product.price}</p>
                    </div>
                    </div>

                    <div className='flex justify-center mt-1'>
                        {
                            Array.from({length: 5},(_,i) =>(
                                <span key={i} className={i<Math.round(product.rating)?"text-yellow-500":"text-gray-300"}>★</span>
                            ))
                        }
                    </div>
                      

                     


                </div>
                </Link>

                 <button className='bg-black text-white w-full py-2   hover:bg-green-700 transition  text-xl  border-black inline-block px-3 py-1 rounded-full font-bold' onClick={() => addToCart(product , qty)}>Add To Card</button>
                 </div>);
})
        }

</div>
    
    </div>
  );
}


export default Cards