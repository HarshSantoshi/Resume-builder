import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='w-full flex items-center justify-between border-t border-slate-500'>
      <div>
        <p className='text-sm'>© 2024</p>

      </div>
      <div className='flex items-center justify-center gap-6'>
        <Link to="/" className='text-blue-400' >Home</Link>
        <Link to="/" className='text-blue-400' >About</Link>
        <Link to="/" className='text-blue-400' >Contact</Link>
        <Link to="/" className='text-blue-400 whitespace-nowrap' >Private Policy</Link>
      </div>
    </div>
  )
}

export default Footer
