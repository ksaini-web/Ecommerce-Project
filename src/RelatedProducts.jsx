import React from 'react'
import { Link } from 'react-router-dom'

function RelatedProducts({ products = [] }) {

  if (!products || products.length === 0) {
    return <p>No related products</p>
  }



  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>

      <div className="flex gap-6 overflow-x-auto items-center p-6 ">

        {products.map((p) => {
          return (
            <Link to={`/productdetail/${p.id}`} key={p.id}>

              <div className="min-w-[200px] border p-3 rounded-xl ">

                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="h-40 w-full object-cover"
                />

                <h1 className='text-sm font-extrabold ' >{p.title}</h1>

                <p className='text-green-600 font-bold text-lg ml-1'>${p.price}</p>

                <p className='text-gray-400 line-through'>${(p.price/(1-p.discountPercentage/100)).toFixed(2)}</p>

                 <div className='flex justify-center mt-1'>
                        {
                            Array.from({length: 5},(_,i) =>(
                                <span key={i} className={i<Math.round(p.rating)?"text-yellow-500":"text-gray-300"}>★</span>
                            ))
                        }
                    </div>

                  

              </div>

            </Link>
          )
        })}

      </div>
    </div>
  )
}

export default RelatedProducts