import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Banner = ({ token }) => {

  const [image, setImage] = useState(false)
  const [heading, setHeading] = useState('')
  const [subText, setSubText] = useState('')
  const [banners, setBanners] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const fetchBanners = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/banner/list')
      if (response.data.success) {
        setBanners(response.data.banners)
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

    if (submitting) {
      return
    }
    if (!image) {
      toast.error('Please upload a banner image')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('heading', heading)
      formData.append('subText', subText)

      const response = await axios.post(backendUrl + '/api/banner/add', formData, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        setImage(false)
        setHeading('')
        setSubText('')
        await fetchBanners()
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

  const removeBanner = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/banner/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchBanners()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  return (
    <div className='flex flex-col gap-4'>

      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Banner Image</p>
          <label htmlFor="bannerImage">
            <img className='w-36 cursor-pointer' src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="bannerImage" hidden />
          </label>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Small label (e.g. OUR BESTSELLERS)</p>
          <input onChange={(e) => setSubText(e.target.value)} value={subText} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='OUR BESTSELLERS' />
        </div>

        <div className='w-full'>
          <p className='mb-2'>Heading (e.g. Latest Arrivals)</p>
          <input onChange={(e) => setHeading(e.target.value)} value={heading} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Latest Arrivals' />
        </div>

        <button type="submit" disabled={submitting} className='w-32 py-3 mt-2 bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed'>{submitting ? 'ADDING...' : 'ADD SLIDE'}</button>
      </form>

      <p className='mt-4 mb-2'>Current Banner Slides</p>
      <div className='flex flex-col gap-2'>
        {
          banners.length === 0
            ? <p className='text-gray-400'>No slides yet. Add one above. (The storefront shows a default banner until you add slides.)</p>
            : banners.map((item) => (
              <div key={item._id} className='flex items-center gap-4 max-w-[600px] border px-3 py-2 bg-white text-sm'>
                <img className='w-20 h-14 object-cover' src={item.image} alt="" />
                <div className='flex-1'>
                  <p className='text-gray-500 text-xs'>{item.subText}</p>
                  <p className='font-medium'>{item.heading}</p>
                </div>
                <p onClick={() => removeBanner(item._id)} className='cursor-pointer text-lg text-red-500'>X</p>
              </div>
            ))
        }
      </div>

    </div>
  )
}

export default Banner
