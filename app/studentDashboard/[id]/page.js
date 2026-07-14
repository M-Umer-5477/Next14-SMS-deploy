'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HiOutlineClipboardCheck } from 'react-icons/hi';


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
                const res = await fetch(`/api/createcourse/${params.id}`, { cache: 'no-store' });
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
            const res = await fetch(`/api/attendance/getAttendance?courseId=${course.CourseID}&studentemail=${session.user.email}`, { cache: 'no-store' });
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

    const getStatusBadge = (statusVal) => {
        switch(statusVal) {
            case 'Present': return 'badge-success';
            case 'Absent': return 'badge-danger';
            case 'Excused': return 'badge-warning';
            default: return 'badge-info';
        }
    };

    return (
        <div className="page-container">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="glass-card overflow-hidden animate-slide-up">
                    {/* Course Header */}
                    <div className="relative h-48 bg-gradient-to-br from-[var(--accent)] to-[hsl(280,85%,45%)] flex items-end">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="relative z-10 p-6 pb-5 w-full">
                            <h1 className="text-white text-2xl sm:text-3xl font-bold">{course.CourseName}</h1>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Course ID', value: course.CourseID },
                                { label: 'Department', value: course.Department },
                                { label: 'Credits', value: course.Credits },
                                { label: 'Status', value: 'Enrolled' },
                            ].map((item, i) => (
                                <div key={i} className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                                    <div className="text-xs text-[var(--text-tertiary)] mb-1">{item.label}</div>
                                    <div className="font-semibold text-sm">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        {course.CourseDescription && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Description</h3>
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{course.CourseDescription}</p>
                            </div>
                        )}

                        <button
                            className="btn btn-outline w-full"
                            onClick={handleShowAttendance}
                        >
                            <HiOutlineClipboardCheck className="w-4 h-4" />
                            {showAttendance ? 'Hide Attendance' : 'View Attendance Records'}
                        </button>

                        {showAttendance && (
                            <div className="mt-6 animate-slide-down">
                                <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
                                {attendanceRecords.length > 0 ? (
                                    <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Time Slot</th>
                                                    <th className="text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceRecords.map((record, index) => (
                                                    <tr key={index}>
                                                        <td>{record.Date.split('T')[0]}</td>
                                                        <td>{record.Timeslot.StartTime} - {record.Timeslot.EndTime}</td>
                                                        <td className="text-center">
                                                            <span className={`badge ${getStatusBadge(record.Status)}`}>
                                                                {record.Status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="empty-state py-8">
                                        <p className="text-sm">No attendance records found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentCoursePage;
