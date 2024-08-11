import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const page = () => {
  return (
    <div className=" ">
      
      <div className="mb-6 relative">
        {/* Add your banner component here */}
        <Image src="banner.jpg" alt="Banner" className="w-full  h-96" />
      </div>

      {/* Welcome Message */}
    
      <p className="text-lg text-center mb-4">Manage your students efficiently with our user-friendly platform.</p>
      {/* Login Button */}
      <div className="flex justify-center">
        <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded">Login</Link>
      </div>
    </div>
  )
}

export default page