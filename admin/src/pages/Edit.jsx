import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Edit = ({ token }) => {

  const { id } = useParams()
  const navigate = useNavigate()

  // For each image slot: a newly chosen File (or false) and the existing URL (or "")
  const [newImages, setNewImages] = useState([false, false, false, false])
  const [existingImages, setExistingImages] = useState(["", "", "", ""])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/category/list")
      if (response.data.success) {
        setCategories(response.data.categories)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/product/single", { productId: id })
      if (response.data.success) {
        const p = response.data.product
        setName(p.name)
        setDescription(p.description)
        setPrice(p.price)
        setCategory(p.category)
        setSubCategory(p.subCategory)
        setBestseller(p.bestseller)
        setSizes(p.sizes || [])
        const imgs = ["", "", "", ""]
        ;(p.image || []).slice(0, 4).forEach((url, i) => { imgs[i] = url })
        setExistingImages(imgs)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProduct()
  }, [id])

  const setSlotImage = (index, file) => {
    setNewImages((prev) => {
      const next = [...prev]
      next[index] = file
      return next
    })
  }

  const toggleSize = (size) => {
    setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size])
  }

  const validateForm = () => {
    const hasImage = newImages.some(Boolean) || existingImages.some(Boolean)
    if (!hasImage) {
      toast.error("Please keep or upload at least one product image")
      return false
    }
    if (!name.trim()) {
      toast.error("Product name is required")
      return false
    }
    if (name.trim().length < 2) {
      toast.error("Product name must be at least 2 characters")
      return false
    }
    if (!description.trim()) {
      toast.error("Product description is required")
      return false
    }
    if (description.trim().length < 10) {
      toast.error("Product description must be at least 10 characters")
      return false
    }
    if (!category) {
      toast.error("Please select a category")
      return false
    }
    if (price === "" || isNaN(Number(price))) {
      toast.error("Please enter a valid price")
      return false
    }
    if (Number(price) <= 0) {
      toast.error("Price must be greater than 0")
      return false
    }
    if (sizes.length === 0) {
      toast.error("Please select at least one size")
      return false
    }
    return true
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (submitting) {
      return
    }

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("id", id)
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      for (let i = 0; i < 4; i++) {
        if (newImages[i]) {
          formData.append(`image${i + 1}`, newImages[i])
        } else if (existingImages[i]) {
          formData.append(`existingImage${i + 1}`, existingImages[i])
        }
      }

      const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/list')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[0, 1, 2, 3].map((i) => {
            const preview = newImages[i]
              ? URL.createObjectURL(newImages[i])
              : (existingImages[i] || assets.upload_area)
            return (
              <label htmlFor={`image${i}`} key={i}>
                <img className='w-20 h-20 object-cover' src={preview} alt="" />
                <input onChange={(e) => setSlotImage(i, e.target.files[0])} type="file" id={`image${i}`} hidden />
              </label>
            )
          })}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
            {
              categories.length === 0
                ? <option value="">No categories</option>
                : categories.map((item) => (
                    <option key={item._id} value={item.name}>{item.name}</option>
                  ))
            }
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} onClick={() => toggleSize(size)}>
              <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller((prev) => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <div className='flex gap-3'>
        <button type="submit" disabled={submitting} className='w-28 py-3 mt-4 bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed'>{submitting ? 'UPDATING...' : 'UPDATE'}</button>
        <button type="button" onClick={() => navigate('/list')} className='w-28 py-3 mt-4 border border-gray-400'>CANCEL</button>
      </div>
    </form>
  )
}

export default Edit
