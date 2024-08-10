/*'use client'
import React from 'react'
import Link from 'next/link'
import { useState ,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
const page = (ctx) => {
    const [course, setCourse] = useState({});
    const router=useRouter();
    const { data: session, status } = useSession();
    if(!session){
      router.push("/login")
    }   
    useEffect(() => {
        async function fetchCourse() {
            const res = await fetch(`http://localhost:3000/api/createcourse/${ctx.params.id}`, { cache: 'no-store' })
            console.log(res)
            const course = await res.json()
            console.log("response is " + course)
        setCourse(course)
        }
        fetchCourse()
    }, [])
    const handleDelete = async () => {
      
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;
        try {
          // Mocking a delete API call
          await fetch(`http://localhost:3000/api/createcourse/${ctx.params.id}`, { method: 'DELETE' });
          // Redirect to home page or any other page after deletion
          router.push('/dashboard');
        } catch (error) {
          console.error('Error deleting course:', error);
        }
      };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded object-fill shadow-md w-full max-w-4xl">
        <img 
          src="course.jpeg"
          
          className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
        />
        <div className="text-center">
          <div className="text-sm text-gray-500">{course.Department}</div>
          <div className="text-2xl font-bold">{course.CourseName}</div>
          <div className="text-sm text-gray-700">{course.CourseDescription}</div>
          <div className="text-sm text-gray-500">{course.Credits} Credits</div>
          <div className="mt-4">
            <Link href={`/dashboard/edit/${course._id}`} passHref>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
            </Link>
            <button 
             onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page*/
/*'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const CoursePage = (ctx) => {
    const [course, setCourse] = useState({});
    const router = useRouter();
    const { data: session, status } = useSession();

    if (!session) {
        router.push("/login")
    }

    useEffect(() => {
        async function fetchCourse() {
            try {
                const res = await fetch(`http://localhost:3000/api/createcourse/${ctx.params.id}`, { cache: 'no-store' });
                const courseData = await res.json();
                setCourse(courseData.data);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            }
        }

        fetchCourse();
    }, [ctx.params.id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            await fetch(`http://localhost:3000/api/createcourse/${ctx.params.id}`, { method: 'DELETE' });
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const handleAttendance = () => {
        // Placeholder for attendance marking functionality
        console.log("Mark attendance for course:", course.CourseID);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
                <img
                    src="/course.jpeg"
                    alt="Course"
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                />
                <div className="text-center">
                    <div className="text-sm text-gray-500">{course.Department}</div>
                    <div className="text-2xl font-bold">{course.CourseName}</div>
                    <div className="text-sm text-gray-700 my-4">{course.CourseDescription}</div>
                    <div className="text-sm text-gray-500">{course.Credits} Credits</div>
                    <div className="mt-4">
                        <Link href={`/dashboard/edit/${course._id}`} passHref>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Delete
                        </button>
                        <button
                            onClick={handleAttendance}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Mark Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoursePage;
'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const CoursePage = (ctx) => {
    const [course, setCourse] = useState({});
    const router = useRouter();
    const { data: session, status } = useSession();

    if (!session) {
        router.push("/login");
    }

    useEffect(() => {
        async function fetchCourse() {
            try {
                const res = await fetch(`http://localhost:3000/api/createcourse/${ctx.params.id}`, { cache: 'no-store' });
                const courseData = await res.json();
                setCourse(courseData.data);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            }
        }

        fetchCourse();
    }, [ctx.params.id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            await fetch(`http://localhost:3000/api/createcourse/${ctx.params.id}`, { method: 'DELETE' });
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const handleAttendance = () => {
        // Placeholder for attendance marking functionality
        console.log("Mark attendance for course:", course.CourseID);
    };

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-6 sm:px-8 lg:px-10">
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-6xl">
        <div className="relative">
            <img
                src="/course.jpeg"
                alt="Course Banner"
                className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <h1 className="text-white text-3xl font-bold text-center">{course.CourseName}</h1>
            </div>
        </div>
        <div className="p-8">
            <div className="text-gray-600 text-sm mb-2">Course ID: {course.CourseID}</div>
            <div className="text-gray-600 text-sm mb-2">Department: {course.Department}</div>
            
            <div className="text-gray-600 text-base mb-4">Course Description: {course.CourseDescription}</div>
            <div className="text-gray-600 text-sm mb-4">Credits: {course.Credits}</div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mt-8">
            <Link href={`/dashboard/attendance/${course._id}`}>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded transition duration-300"
                >
                    Mark Attendance
                </button>
                </Link>  
                <Link href={`/dashboard/edit/${course._id}`} passHref>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition duration-300">Edit</button>
                </Link>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition duration-300"
                >
                    Delete
                </button>
                <Link href={`/dashboard/editTeacherAssign/${course._id}`} passHref>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition duration-300">Change Teacher</button>
                </Link>
                <div><Link href={`/dashboard/assignTeacher/${course._id}`} className="font-bold underline text-blue-500 text-lg mb-2">Assign Teacher</Link></div>
                    <Link href={`/dashboard/enrollment/${course._id}`} className="font-bold underline text-blue-500 text-lg mb-2">Enroll Student</Link>
            </div>
        </div>
    </div>
</div>

  
    );
}

export default CoursePage;
*/
/*'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const CoursePage = (ctx) => {
    const [course, setCourse] = useState({});
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }
    }, [session, router]);

    useEffect(() => {
        async function fetchCourse() {
            try {
                const res = await fetch(`http://localhost:3000/api/createcourse/${ctx.params.id}`, { cache: 'no-store' });
                const courseData = await res.json();
                setCourse(courseData.data);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            }
        }

        fetchCourse();
    }, [ctx.params.id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            await fetch(`http://localhost:3000/api/createcourse/${ctx.params.id}`, { method: 'DELETE' });
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-6 sm:px-8 lg:px-10 flex flex-col items-center">
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-6xl">
                <div className="relative">
                    <img
                        src="/course.jpeg"
                        alt="Course Banner"
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <h1 className="text-white text-3xl font-bold text-center">{course.CourseName}</h1>
                    </div>
                </div>
                <div className="p-6 sm:p-8">
                    <div className="text-gray-600 text-sm mb-2">Course ID: <span className="font-semibold">{course.CourseID}</span></div>
                    <div className="text-gray-600 text-sm mb-2">Department: <span className="font-semibold">{course.Department}</span></div>
                    <div className="text-gray-600 text-base mb-4">Course Description: <span className="font-semibold">{course.CourseDescription}</span></div>
                    <div className="text-gray-600 text-sm mb-4">Credits: <span className="font-semibold">{course.Credits}</span></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                        <Link href={`/dashboard/attendance/${course._id}`}>
                            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded transition duration-300">
                                Attendance
                            </button>
                        </Link>
                        <Link href={`/dashboard/edit/${course._id}`} passHref>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition duration-300">
                                Edit
                            </button>
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition duration-300"
                        >
                            Delete
                        </button>
                        <Link href={`/dashboard/editTeacherAssign/${course._id}`} passHref>
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded transition duration-300">
                                Change Teacher
                            </button>
                        </Link>
                        <Link href={`/dashboard/assignTeacher/${course._id}`}>
                            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded transition duration-300">
                                Assign Teacher
                            </button>
                        </Link>
                        <Link href={`/dashboard/enrollment/${course._id}`}>
                            <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded transition duration-300">
                                Enroll Student
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoursePage;*/

'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const CoursePage = ({ params }) => {
    const [course, setCourse] = useState({});
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user?.email.includes('@student.com')) {
            router.push('/login');
            return;
          }
        async function fetchCourse() {
            try {
                const res = await fetch(`http://localhost:3000/api/createcourse/${params.id}`, { cache: 'no-store' });
                const courseData = await res.json();
                setCourse(courseData.data);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            }
        }

        fetchCourse();
    }, [params.id],session, router);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            await fetch(`http://localhost:3000/api/createcourse/${params.id}`, { method: 'DELETE' });
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const isTeacher = session?.user?.email?.includes('@teacher.com');

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-6 sm:px-8 lg:px-10 flex flex-col items-center">
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-6xl">
                <div className="relative">
                    <img
                        src="/course.jpeg"
                        alt="Course Banner"
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <h1 className="text-white text-3xl font-bold text-center">{course.CourseName}</h1>
                    </div>
                </div>
                <div className="p-6 sm:p-8">
                    <div className="text-gray-600 text-sm mb-2">Course ID: <span className="font-semibold">{course.CourseID}</span></div>
                    <div className="text-gray-600 text-sm mb-2">Department: <span className="font-semibold">{course.Department}</span></div>
                    <div className="text-gray-600 text-base mb-4">Course Description: <span className="font-semibold">{course.CourseDescription}</span></div>
                    <div className="text-gray-600 text-sm mb-4">Credits: <span className="font-semibold">{course.Credits}</span></div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                        <Link href={`/dashboard/attendance/${course._id}`}>
                            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded transition duration-300">
                                Mark Attendance
                            </button>
                        </Link>
                        {!isTeacher && (
                            <>
                                <Link href={`/dashboard/edit/${course._id}`} passHref>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition duration-300">
                                        Edit
                                    </button>
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition duration-300"
                                >
                                    Delete
                                </button>
                                <Link href={`/dashboard/editTeacherAssign/${course._id}`} passHref>
                                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded transition duration-300">
                                        Change Teacher
                                    </button>
                                </Link>
                                <Link href={`/dashboard/assignTeacher/${course._id}`}>
                                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded transition duration-300">
                                        Assign Teacher
                                    </button>
                                </Link>
                                <Link href={`/dashboard/enrollment/${course._id}`}>
                                    <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded transition duration-300">
                                        Enroll Student
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoursePage;



