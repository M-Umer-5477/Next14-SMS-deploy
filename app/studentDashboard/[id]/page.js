'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const StudentCoursePage = ({ params }) => {
    const [course, setCourse] = useState({});
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [showAttendance, setShowAttendance] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {

        if (status === 'loading') return;
      if (!session ||!session.user?.email.includes('@student.com')) {
            router.push('/login');
            return;
          }
    }, [status, router,session]);

    useEffect(() => {
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
    }, [params.id]);

    async function fetchAttendance() {
        try {
            const res = await fetch(`http://localhost:3000/api/attendance/getAttendance?courseId=${course.CourseID}&studentemail=${session.user.email}`, { cache: 'no-store' });
            const data = await res.json();
            setAttendanceRecords(data);
        } catch (error) {
            console.error("Failed to fetch attendance:", error);
        }
    }

    const handleShowAttendance = () => {
        fetchAttendance();
        setShowAttendance(!showAttendance);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-6 sm:px-8 lg:px-10 flex flex-col items-center">
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-6xl">
                <div className="relative">
                    <Image
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
                        <button
                            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded transition duration-300"
                            onClick={handleShowAttendance}
                        >
                            {showAttendance ? 'Hide Attendance' : 'Show Attendance'}
                        </button>
                    </div>
                    
                    {showAttendance && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Attendance Records</h3>
                            {attendanceRecords.length > 0 ? (
                                <ul className="list-disc ml-6">
                                    {attendanceRecords.map((record, index) => (
                                        <li key={index} className="mb-2">
                                            <span className="font-semibold">Date:</span>  {`${record.Date.split('T')[0]} ${record.Timeslot.StartTime} - ${record.Timeslot.EndTime}`}, <span className="font-semibold">Status:</span> {record.Status}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No attendance records found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentCoursePage;
