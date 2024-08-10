import React from 'react'
import Link from 'next/link'
const page = () => {
  return (
    <div className=" ">
      
      <div className="mb-8 relative">
        {/* Add your banner component here */}
        <img src="banner.jpg" alt="Banner" className="w-full  h-96" />
      </div>

      {/* Welcome Message */}
      <h1 className="text-3xl font-bold text-center absolute left-96 top-6">Welcome to Student Management System</h1>
      <p className="text-lg text-center mb-8">Manage your students efficiently with our user-friendly platform.</p>
      {/* Login Button */}
      <div className="flex justify-center">
        <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded">Login</Link>
      </div>
    </div>
  )
}

export default page