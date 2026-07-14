'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HiOutlineUserAdd } from 'react-icons/hi';

const AddEnrollment = ({ params }) => {
    const router = useRouter();
    const { data: session, status } = useSession();

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
    const [success, setSuccess] = useState('');

    const fetchCourse = useCallback(async (courseId) => {
        try {
            const response = await fetch(`/api/createcourse/${courseId}`);
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
            const response = await fetch('/api/addstudent');
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
        setSuccess('');

        try {
            const response = await fetch('/api/enrollment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollment),
            });

            const result = await response.json();
            if (response.ok) {
                setSuccess('Enrollment created successfully!');
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
        <div className="page-container flex items-center justify-center">
            <div className="glass-card p-8 w-full max-w-2xl animate-slide-up">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
                        <HiOutlineUserAdd className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Enroll Student</h1>
                    {course && (
                        <p className="text-[var(--text-secondary)] text-sm mt-1">
                            {course.CourseName} <span className="text-[var(--text-tertiary)]">(ID: {course.CourseID})</span>
                        </p>
                    )}
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="EnrollmentID" className="form-label">Enrollment ID</label>
                            <input type="text" name="EnrollmentID" placeholder="Enrollment ID" value={enrollment.EnrollmentID} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="StudentID" className="form-label">Student</label>
                            <select name="StudentID" value={enrollment.StudentID} onChange={handleChange} required className="form-select">
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option key={student.StudentID} value={student.StudentID}>
                                        {student.FirstName} {student.LastName} ({student.StudentID})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="EnrollmentDate" className="form-label">Enrollment Date</label>
                            <input type="date" name="EnrollmentDate" value={enrollment.EnrollmentDate} onChange={handleChange} required className="form-input" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full btn-lg mt-2" disabled={loading}>
                        {loading ? (<><span className="spinner spinner-sm" /> Enrolling...</>) : 'Enroll Student'}
                    </button>
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                </form>
            </div>
        </div>
    );
};

export default AddEnrollment;
