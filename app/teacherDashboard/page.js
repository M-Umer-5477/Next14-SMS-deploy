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
                    const response = await fetch(`/api/teacherdata?email=${session.user.email}`);
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
    }, [session, status, router]);

    if (loading) return (
        <div className="page-container flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
                <p className="text-[var(--text-secondary)] text-sm">Loading your dashboard...</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="page-container flex items-center justify-center">
            <div className="alert alert-error max-w-md">Error: {error}</div>
        </div>
    );
    if (!teacherData) return (
        <div className="page-container flex items-center justify-center">
            <div className="empty-state"><p>No teacher data available</p></div>
        </div>
    );

    return (
        <div className="page-container">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="page-header animate-slide-up">
                    <h1 className="page-title">Teacher Dashboard</h1>
                    <p className="page-subtitle">Welcome back, {teacherData.FirstName}</p>
                </div>

                <div className="mb-8 animate-fade-in">
                    <ProfileCard user={teacherData} />
                </div>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-[var(--text-secondary)]">Assigned Courses</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {courses.map((course) => (
                        <Link
                            href={`/dashboard/${course._id}`}
                            key={course.CourseID}
                            className="glass-card glass-card-hover overflow-hidden group block"
                        >
                            <div className="h-1.5 bg-accent-gradient" />
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="badge badge-info">{course.Department}</span>
                                    <span className="text-xs text-[var(--text-tertiary)]">{course.Credits} credits</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--accent-light)] transition-colors">
                                    {course.CourseName}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                    {course.CourseDescription}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
