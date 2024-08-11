'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const AssignTeacher = ({ params }) => {
    const router = useRouter();
    const { data: session , status} = useSession();

    const [teachers, setTeachers] = useState([]);
    const [course, setCourse] = useState(null);
    const [assignment, setAssignment] = useState({
        AssignmentID: '',
        TeacherID: '',
        CourseID: '',
        AssignmentDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if user is not authorized
    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
            router.push("/login");
        }
    }, [session, status, router]);

    // Fetch course and teachers data
    useEffect(() => {
        const fetchCourseAndTeachers = async () => {
            try {
                const [courseRes, teachersRes] = await Promise.all([
                    fetch(`http://localhost:3000/api/createcourse/${params.id}`),
                    fetch('http://localhost:3000/api/addteacher')
                ]);

                if (!courseRes.ok) throw new Error('Failed to fetch course');
                if (!teachersRes.ok) throw new Error('Failed to fetch teachers');

                const courseData = await courseRes.json();
                const teachersData = await teachersRes.json();

                setCourse(courseData.data);
                setTeachers(teachersData.data);
                setAssignment(prev => ({ ...prev, CourseID: courseData.data.CourseID }));
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCourseAndTeachers();
    }, [params.id]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setAssignment(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/assignTeacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(assignment),
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.error || 'Failed to assign course');
            }

            alert('Course assigned successfully');
            router.push('/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [assignment, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">
                        Assign Course to Teacher
                    </h1>
                </div>
                {course && (
                    <p className="text-center text-lg text-gray-600 mb-6">
                        Course: {course.CourseName} (ID: {course.CourseID})
                    </p>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="AssignmentID" className="block text-gray-700 text-sm font-bold mb-2">
                                Assignment ID
                            </label>
                            <input
                                type="text"
                                name="AssignmentID"
                                placeholder="Assignment ID"
                                value={assignment.AssignmentID}
                                onChange={handleChange}
                                required
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="TeacherID" className="block text-gray-700 text-sm font-bold mb-2">
                                Teacher ID
                            </label>
                            <select
                                name="TeacherID"
                                value={assignment.TeacherID}
                                onChange={handleChange}
                                required
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.TeacherID} value={teacher.TeacherID}>
                                        {teacher.FirstName} {teacher.LastName} ({teacher.Department}) ({teacher.TeacherID})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="AssignmentDate" className="block text-gray-700 text-sm font-bold mb-2">
                                Assignment Date
                            </label>
                            <input
                                type="date"
                                name="AssignmentDate"
                                placeholder="Assignment Date"
                                value={assignment.AssignmentDate}
                                onChange={handleChange}
                                required
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            disabled={loading}
                        >
                            {loading ? 'Assigning Course...' : 'Assign Course'}
                        </button>
                        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignTeacher;
