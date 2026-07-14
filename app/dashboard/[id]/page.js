'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HiOutlineClipboardCheck, HiOutlinePencil, HiOutlineTrash, HiOutlineUserAdd, HiOutlineAcademicCap, HiOutlineSwitchHorizontal } from 'react-icons/hi';

const CoursePage = ({ params }) => {
    const [course, setCourse] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
                const res = await fetch(`/api/createcourse/${params.id}`, { cache: 'no-store' });
                const courseData = await res.json();
                setCourse(courseData.data);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            }
        }

        fetchCourse();
    }, [params.id, status, session, router]);

    const handleDelete = async () => {
        try {
            await fetch(`/api/createcourse/${params.id}`, { method: 'DELETE' });
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const isTeacher = session?.user?.email?.includes('@teacher.com');

    const actions = [
        {
            href: `/dashboard/attendance/${course._id}`,
            icon: <HiOutlineClipboardCheck className="w-6 h-6" />,
            label: 'Mark Attendance',
            color: 'var(--success)',
            show: true,
        },
        {
            href: `/dashboard/edit/${course._id}`,
            icon: <HiOutlinePencil className="w-6 h-6" />,
            label: 'Edit Course',
            color: 'var(--info)',
            show: !isTeacher,
        },
        {
            href: `/dashboard/assignTeacher/${course._id}`,
            icon: <HiOutlineAcademicCap className="w-6 h-6" />,
            label: 'Assign Teacher',
            color: 'var(--accent)',
            show: !isTeacher,
        },
        {
            href: `/dashboard/editTeacherAssign/${course._id}`,
            icon: <HiOutlineSwitchHorizontal className="w-6 h-6" />,
            label: 'Change Teacher',
            color: 'var(--warning)',
            show: !isTeacher,
        },
        {
            href: `/dashboard/enrollment/${course._id}`,
            icon: <HiOutlineUserAdd className="w-6 h-6" />,
            label: 'Enroll Student',
            color: 'hsl(180, 60%, 48%)',
            show: !isTeacher,
        },
    ];

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

                    {/* Course Details */}
                    <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Course ID', value: course.CourseID },
                                { label: 'Department', value: course.Department },
                                { label: 'Credits', value: course.Credits },
                                { label: 'Status', value: 'Active' },
                            ].map((item, i) => (
                                <div key={i} className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                                    <div className="text-xs text-[var(--text-tertiary)] mb-1">{item.label}</div>
                                    <div className="font-semibold text-sm">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        {course.CourseDescription && (
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Description</h3>
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{course.CourseDescription}</p>
                            </div>
                        )}

                        {/* Action Cards */}
                        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Actions</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {actions.filter(a => a.show).map((action, i) => (
                                <Link
                                    key={i}
                                    href={action.href}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-card-hover)] transition-all duration-200 group"
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                                        style={{ background: `${action.color}18`, color: action.color }}
                                    >
                                        {action.icon}
                                    </div>
                                    <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors text-center">
                                        {action.label}
                                    </span>
                                </Link>
                            ))}
                            {!isTeacher && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] hover:border-[var(--danger)] hover:bg-[var(--danger-bg)] transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--danger-bg)] text-[var(--danger)] transition-transform duration-200 group-hover:scale-110">
                                        <HiOutlineTrash className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--danger)] transition-colors text-center">
                                        Delete Course
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Delete Confirmation */}
                        {showDeleteConfirm && (
                            <div className="mt-4 p-4 rounded-lg border border-[var(--danger)] bg-[var(--danger-bg)] animate-slide-down">
                                <p className="text-sm text-[var(--danger)] font-medium mb-3">Are you sure you want to delete this course? This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button onClick={handleDelete} className="btn btn-danger btn-sm">Yes, Delete</button>
                                    <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost btn-sm">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoursePage;
