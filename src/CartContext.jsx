import React from 'react'

import { createContext ,useState } from 'react'


export const CartContext = createContext();

export const CartProvider = ({children}) =>{

    const [cart , setCart ] =useState([]);

    const addToCart = (product , qty = 1) => {

        const existing = cart.find(item => item.id === product.id);

        if(existing){

            const updated = cart.map(item =>

                item.id === product.id ? {...item,quantity: item.quantity + qty}:item
            );

            setCart(updated);
        }
        else{

            setCart([...cart,{...product , quantity:qty}]) ;
        }
    };
     return (
   <CartContext.Provider value={{cart , addToCart}}>
    {children}
   </CartContext.Provider>
  );
};


 


