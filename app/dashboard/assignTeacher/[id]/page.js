'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const AssignTeacher = ({ params }) => {
    const router = useRouter();
    const { data: session, status } = useSession();

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

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
            router.push("/login");
        }
    }, [session, status, router]);

    useEffect(() => {
        const fetchCourseAndTeachers = async () => {
            try {
                const [courseRes, teachersRes] = await Promise.all([
                    fetch(`/api/createcourse/${params.id}`),
                    fetch('/api/addteacher')
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
            const res = await fetch('/api/assignTeacher', {
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
        <div className="page-container flex items-center justify-center">
            <div className="glass-card p-8 w-full max-w-2xl animate-slide-up">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
                        <HiOutlineAcademicCap className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Assign Teacher</h1>
                    {course && (
                        <p className="text-[var(--text-secondary)] text-sm mt-1">
                            {course.CourseName} <span className="text-[var(--text-tertiary)]">(ID: {course.CourseID})</span>
                        </p>
                    )}
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="AssignmentID" className="form-label">Assignment ID</label>
                            <input type="text" name="AssignmentID" placeholder="Assignment ID" value={assignment.AssignmentID} onChange={handleChange} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="TeacherID" className="form-label">Teacher</label>
                            <select name="TeacherID" value={assignment.TeacherID} onChange={handleChange} required className="form-select">
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.TeacherID} value={teacher.TeacherID}>
                                        {teacher.FirstName} {teacher.LastName} ({teacher.Department}) ({teacher.TeacherID})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="AssignmentDate" className="form-label">Assignment Date</label>
                            <input type="date" name="AssignmentDate" value={assignment.AssignmentDate} onChange={handleChange} required className="form-input" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full btn-lg mt-2" disabled={loading}>
                        {loading ? (<><span className="spinner spinner-sm" /> Assigning...</>) : 'Assign Teacher'}
                    </button>
                    {error && <div className="alert alert-error">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default AssignTeacher;
