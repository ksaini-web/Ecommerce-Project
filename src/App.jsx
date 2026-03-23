import React from 'react'
import Cards from './cards'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProductDetail from './ProductDetail'
import Home from './assets/Home'
import { CartProvider } from './CartContext'
import Cart from './assets/Cart'


function App() {
  return (
    <CartProvider>
    
    <BrowserRouter>
    
    <Routes>
    
  <Route path='/' element= {<Home/>} />

  <Route  path ="/productdetail/:id" element={<ProductDetail/>}/>


<Route path = "/cart" element={<Cart/>}/>


    </Routes>
    
    </BrowserRouter>
    </CartProvider>
   
  )
}

export default App