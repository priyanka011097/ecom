import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Category = ({ token }) => {

  const [name, setName] = useState('')
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list')
      if (response.data.success) {
        setCategories(response.data.categories)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(backendUrl + '/api/category/add', { name }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        await fetchCategories()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeCategory = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/category/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchCategories()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className='flex flex-col gap-4'>

      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div className='w-full'>
          <p className='mb-2'>Category name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='e.g. Footwear' required />
        </div>
        <button type="submit" className='w-28 py-3 mt-2 bg-black text-white'>ADD</button>
      </form>

      <p className='mt-4 mb-2'>All Categories</p>
      <div className='flex flex-col gap-2'>
        {
          categories.length === 0
            ? <p className='text-gray-400'>No categories yet. Add one above.</p>
            : categories.map((item) => (
              <div key={item._id} className='flex items-center justify-between max-w-[500px] border px-3 py-2 bg-white'>
                <p>{item.name}</p>
                <p onClick={() => removeCategory(item._id)} className='text-right cursor-pointer text-lg text-red-500'>X</p>
              </div>
            ))
        }
      </div>

    </div>
  )
}

export default Category
