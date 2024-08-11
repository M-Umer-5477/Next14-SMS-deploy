/*
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const AddEnrollment = (ctx) => {
    const router = useRouter();
    const { data: session } = useSession();

    const [students, setStudents] = useState([]);
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState({
        EnrollmentID: '',
        StudentID: '',
        CourseID: '',
        EnrollmentDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCourse = useCallback(async (courseId) => {
        try {
            const courseRes = await fetch(`http://localhost:3000/api/createcourse/${courseId}`);
            if (!courseRes.ok) throw new Error('Failed to fetch course');
            const courseData = await courseRes.json();
            return courseData.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }, []);

    const fetchStudents = useCallback(async () => {
        try {
            const studentsRes = await fetch('http://localhost:3000/api/addstudent');
            if (!studentsRes.ok) throw new Error('Failed to fetch students');
            const studentsData = await studentsRes.json();
            return studentsData.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }, []);

    useEffect(() => {
        const fetchCourseAndStudents = async () => {
            try {
                if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
                    router.push("/login");
                    return;
                }

                const [courseData, studentsData] = await Promise.all([
                    fetchCourse(ctx.params.id),
                    fetchStudents()
                ]);

                setCourse(courseData.data);
                setStudents(studentsData);
                setEnrollment((prev) => ({ ...prev, CourseID: courseData.CourseID }));
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCourseAndStudents();
    }, [ctx.params.id, fetchCourse, fetchStudents, session, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEnrollment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/enrollment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollment),
            });

            const result = await res.json();
            if (res.ok) {
                alert('Enrollment created successfully');
            } else {
                setError(result.error || 'Failed to create enrollment');
            }
        } catch (error) {
            setError('Failed to create enrollment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                <div>
                    <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Add Enrollment</h1>
                    {course && (
                        <p className="text-center text-lg text-gray-600 mb-6">
                            Course: {course.CourseName} (ID: {course.CourseID})
                        </p>
                    )}
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="EnrollmentID" className="block text-gray-700 text-sm font-bold mb-2">
                                Enrollment ID
                            </label>
                            <input
                                type="text"
                                name="EnrollmentID"
                                placeholder="Enrollment ID"
                                value={enrollment.EnrollmentID}
                                onChange={handleChange}
                                required
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="StudentID" className="block text-gray-700 text-sm font-bold mb-2">
                                Student ID
                            </label>
                            <select
                                name="StudentID"
                                value={enrollment.StudentID}
                                onChange={handleChange}
                                required
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option key={student.StudentID} value={student.StudentID}>
                                        {student.FirstName} {student.LastName} ({student.StudentID})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="EnrollmentDate" className="block text-gray-700 text-sm font-bold mb-2">
                                Enrollment Date
                            </label>
                            <input
                                type="date"
                                name="EnrollmentDate"
                                placeholder="Enrollment Date"
                                value={enrollment.EnrollmentDate}
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
                            {loading ? 'Adding Enrollment...' : 'Add Enrollment'}
                        </button>
                        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEnrollment;*/
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const AddEnrollment = ({ params }) => {
    const router = useRouter();
    const { data: session , status } = useSession();

    const [students, setStudents] = useState([]);
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState({
        EnrollmentID: '',
        StudentID: '',
        CourseID: '',
        EnrollmentDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCourse = useCallback(async (courseId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/createcourse/${courseId}`);
            if (!response.ok) throw new Error('Failed to fetch course');
            const data = await response.json();
            return data.data;
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, []);

    const fetchStudents = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/addstudent');
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            return data.data;
        } catch (err) {
            setError(err.message);
            return [];
        }
    }, []);

    useEffect(() => {
        const initialize = async () => {
            if (status === 'loading') return;
            if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
                router.push("/login");
                return;
            }

            try {
                const [fetchedCourse, fetchedStudents] = await Promise.all([
                    fetchCourse(params.id),
                    fetchStudents()
                ]);

                if (fetchedCourse) {
                    setCourse(fetchedCourse);
                    setEnrollment((prev) => ({ ...prev, CourseID: fetchedCourse.CourseID }));
                }
                setStudents(fetchedStudents);
            } catch (err) {
                setError('Failed to load data');
            }
        };

        initialize();
    }, [params.id, fetchCourse, fetchStudents, session, status, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEnrollment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/enrollment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollment),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Enrollment created successfully');// Optional: Redirect to a success page
            } else {
                setError(result.error || 'Failed to create enrollment');
            }
        } catch (err) {
            setError('Failed to create enrollment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">Add Enrollment</h1>
                    {course && (
                        <p className="text-center text-lg text-gray-600 mb-6">
                            Course: {course.CourseName} (ID: {course.CourseID})
                        </p>
                    )}
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="EnrollmentID" className="block text-gray-700 text-sm font-bold mb-2">
                                Enrollment ID
                            </label>
                            <input
                                type="text"
                                name="EnrollmentID"
                                placeholder="Enrollment ID"
                                value={enrollment.EnrollmentID}
                                onChange={handleChange}
                                required
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="StudentID" className="block text-gray-700 text-sm font-bold mb-2">
                                Student ID
                            </label>
                            <select
                                name="StudentID"
                                value={enrollment.StudentID}
                                onChange={handleChange}
                                required
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option key={student.StudentID} value={student.StudentID}>
                                        {student.FirstName} {student.LastName} ({student.StudentID})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="EnrollmentDate" className="block text-gray-700 text-sm font-bold mb-2">
                                Enrollment Date
                            </label>
                            <input
                                type="date"
                                name="EnrollmentDate"
                                value={enrollment.EnrollmentDate}
                                onChange={handleChange}
                                required
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            disabled={loading}
                        >
                            {loading ? 'Adding Enrollment...' : 'Add Enrollment'}
                        </button>
                        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEnrollment;
