import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Title from './Title'

const ShopByCollection = () => {

  const { backendUrl } = useContext(ShopContext)
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list')
      if (response.data.success) {
        setCategories(response.data.categories)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (categories.length === 0) {
    return null
  }

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'SHOP BY'} text2={'COLLECTION'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Browse our curated collections
        </p>
      </div>

      {/* Collection Tiles */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          categories.map((item) => (
            <Link
              key={item._id}
              onClick={() => scrollTo(0, 0)}
              to={`/collection?category=${encodeURIComponent(item.name)}`}
              className='flex items-center justify-center h-32 sm:h-40 border border-gray-300 text-gray-700 text-lg sm:text-xl font-medium hover:bg-black hover:text-white transition ease-in-out'
            >
              {item.name}
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default ShopByCollection
