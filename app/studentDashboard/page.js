'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProfileCard from '@/components/profileCard';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const StudentDashboard = () => {
    const { data: session, status } = useSession();
    const [studentData, setStudentData] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;
      if (!session ||!session.user?.email.includes('@student.com')) {
            router.push('/login');
            return;
          }
        else{
            const fetchStudentData = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/studentdata?email=${session.user.email}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch teacher data');
                    }
                    const data = await response.json();
                    setStudentData(data.student);
                    setCourses(data.coursesEnrolled)
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchStudentData();
        }
    }, [session, status, router]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!studentData) return <div>No student data available</div>;
  return (
    <div>
    <div className="p-4">
         <ProfileCard user={studentData} />
     </div>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {courses.map((course) => (
       <div
         key={course.CourseID}
         className="border p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
       >
         <Image src="course.jpeg" alt={course.CourseName} className="w-full h-32 object-cover rounded-t-lg" />
         <div className="p-4">
           <div className="text-sm text-gray-600 mb-1">{course.Department}</div>
           <Link href={`/studentDashboard/${course._id}`} className="font-bold text-lg mb-2">{course.CourseName}</Link>
           <div className="text-sm text-gray-700 mb-2">{course.CourseDescription}</div>
           
           <div className="text-sm text-gray-600">Credits: {course.Credits}</div>
           
         </div>
       </div>
     ))}
   </div>
   </div>
  )
}

export default StudentDashboard