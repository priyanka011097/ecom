import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import axios from 'axios'

const Hero = () => {

  const { backendUrl } = useContext(ShopContext)
  const [banners, setBanners] = useState([])
  const [current, setCurrent] = useState(0)

  const fetchBanners = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/banner/list')
      if (response.data.success) {
        setBanners(response.data.banners)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  // Fallback to the original static banner when no slides are configured.
  const slides = banners.length > 0
    ? banners
    : [{ _id: 'default', image: assets.hero_img, heading: 'Latest Arrivals', subText: 'OUR BESTSELLERS' }]

  // Auto-rotate when there is more than one slide.
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  // Keep the index valid if the number of slides changes.
  useEffect(() => {
    if (current >= slides.length) setCurrent(0)
  }, [slides.length, current])

  const slide = slides[current]

  const goTo = (i) => setCurrent(i)
  const next = () => setCurrent((prev) => (prev + 1) % slides.length)
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length)

  return (
    <div className='relative border border-gray-400'>
      <div className='flex flex-col sm:flex-row'>
        {/* Hero Left Side */}
        <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
          <div className='text-[#414141]'>
            <div className='flex items-center gap-2'>
              <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
              <p className='font-medium text-sm md:text-base'>{slide.subText}</p>
            </div>
            <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>{slide.heading}</h1>
            <div className='flex items-center gap-2'>
              <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
              <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
            </div>
          </div>
        </div>
        {/* Hero Right Side */}
        <img className='w-full sm:w-1/2 h-[300px] sm:h-[400px] object-cover' src={slide.image} alt="" />
      </div>

      {/* Slider controls (only when more than one slide) */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label='Previous slide' className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow'>‹</button>
          <button onClick={next} aria-label='Next slide' className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow'>›</button>
          <div className='absolute bottom-3 left-0 right-0 flex justify-center gap-2'>
            {slides.map((s, i) => (
              <button
                key={s._id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition ${i === current ? 'bg-[#414141]' : 'bg-gray-300'}`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Hero
