'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProfileCard from '@/components/profileCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TeacherDashboard = () => {
    const { data: session, status } = useSession();
    const [teacherData, setTeacherData] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;
      if (!session ||!session.user?.email.includes('@teacher.com')) {
            router.push('/login');
            return;
          }     
      if (session && session.user) {
            const fetchTeacherData = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/teacherdata?email=${session.user.email}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch teacher data');
                    }
                    const data = await response.json();
                    setTeacherData(data.teacher);
                    setCourses(data.coursesAssigned)
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchTeacherData();
        }
    }, [session]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!teacherData) return <div>No teacher data available</div>;

    return (
        <div>
       <div className="p-4">
            <ProfileCard user={teacherData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.CourseID}
            className="border p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
          >
            <img src="course.jpeg" alt={course.CourseName} className="w-full h-32 object-cover rounded-t-lg" />
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-1">{course.Department}</div>
              <Link href={`/dashboard/${course._id}`} className="font-bold text-lg mb-2">{course.CourseName}</Link>
              <div className="text-sm text-gray-700 mb-2">{course.CourseDescription}</div>
              
              <div className="text-sm text-gray-600">Credits: {course.Credits}</div>
              
            </div>
          </div>
        ))}
      </div>
      </div>
    );
};

export default TeacherDashboard;




    
