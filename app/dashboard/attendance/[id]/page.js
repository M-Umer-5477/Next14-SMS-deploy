'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HiOutlineClipboardCheck } from 'react-icons/hi';

const Attendance = ({ params }) => {
    const [students, setStudents] = useState([]);
    const [course, setCourse] = useState({});
    const [timetable, setTimetable] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || !session.user?.email.includes('@teacher.com')) {
            router.push('/login');
            return;
        }
        const fetchCourseAndTimetable = async () => {
            try {
                const resCourse = await fetch(`/api/createcourse/${params.id}`, { cache: 'no-store' });
                const courseData = await resCourse.json();
                setCourse(courseData.data);

                const courseID = courseData.data.CourseID;
                fetchEnrolledStudents(courseID);
                fetchTimetable(courseID);
            } catch (error) {
                console.error("Failed to fetch course:", error);
                setError('Failed to fetch course details.');
            }
        };

        fetchCourseAndTimetable();
    }, [params.id, session, router, status]);

    useEffect(() => {
        const initializeAttendanceRecords = () => {
            const newRecords = students.map(student => ({
                AttendanceID: `${student.StudentID}-${Date.now()}`,
                StudentID: student.StudentID,
                CourseID: course.CourseID,
                Lecture: selectedLecture,
                Status: 'Present'
            }));
            setAttendanceRecords(newRecords);
        };
        if (selectedLecture) {
            initializeAttendanceRecords();
        }
    }, [selectedLecture, students, course.CourseID]);

    const fetchEnrolledStudents = async (courseID) => {
        try {
            const res = await fetch(`/api/enrollment?courseId=${courseID}`);
            const data = await res.json();
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch enrolled students:', error);
            setError('Failed to fetch enrolled students.');
        }
    };

    const fetchTimetable = async (courseID) => {
        try {
            const res = await fetch(`/api/get-session-timetable?courseId=${courseID}`);
            const data = await res.json();
            if (data.error) {
                console.error('Error fetching timetable:', data.error);
                setError('Error fetching timetable.');
                setTimetable([]);
            } else {
                setTimetable(data);
            }
        } catch (error) {
            console.error('Failed to fetch timetable:', error);
            setError('Failed to fetch timetable.');
            setTimetable([]);
        }
    };

    const handleAttendanceChange = (studentId, event) => {
        const newStatus = event.target.value;
        setAttendanceRecords(prevRecords => {
            const existingIndex = prevRecords.findIndex(record => record.StudentID === studentId && record.Lecture === selectedLecture);
            if (existingIndex !== -1) {
                const updatedRecords = [...prevRecords];
                updatedRecords[existingIndex].Status = newStatus;
                return updatedRecords;
            } else {
                return [...prevRecords, {
                    AttendanceID: `${studentId}-${Date.now()}`,
                    StudentID: studentId,
                    CourseID: course.CourseID,
                    Lecture: selectedLecture,
                    Status: newStatus
                }];
            }
        });
    };

    const handleSaveAttendance = async () => {
        if (!selectedLecture) {
            setError('Please select a lecture.');
            return;
        }

        const validRecords = attendanceRecords.filter(record => students.some(student => student.StudentID === record.StudentID));

        console.log("Sending attendance records:", validRecords);

        setLoading(true);
        setSuccess('');
        setError('');
        try {
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ attendanceRecords: validRecords })
            });
            setLoading(false);

            if (response.ok) {
                setSuccess('Attendance saved successfully!');
                setAttendanceRecords([]);
                setSelectedLecture('');
            } else {
                throw new Error('Failed to save attendance');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            setError('Failed to save attendance. Please try again.');
        }
    };

    const getStatusColor = (statusVal) => {
        switch(statusVal) {
            case 'Present': return 'badge-success';
            case 'Absent': return 'badge-danger';
            case 'Excused': return 'badge-warning';
            default: return '';
        }
    };

    return (
        <div className="page-container">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="glass-card p-6 sm:p-8 animate-slide-up">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[var(--success-bg)] flex items-center justify-center text-[var(--success)]">
                            <HiOutlineClipboardCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Mark Attendance</h1>
                            <p className="text-sm text-[var(--text-secondary)]">{course.CourseName}</p>
                        </div>
                    </div>

                    {error && <div className="alert alert-error mb-4">{error}</div>}
                    {success && <div className="alert alert-success mb-4">{success}</div>}

                    <div className="mb-6">
                        <label className="form-label">Select Lecture</label>
                        <select
                            value={selectedLecture}
                            onChange={(e) => setSelectedLecture(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Select a lecture</option>
                            {timetable.map(slot => {
                                const date = new Date(slot.Date);
                                return (
                                    <option key={slot._id} value={`${date.toISOString()} ${slot.StartTime} - ${slot.EndTime}`}>
                                        {`${date.toDateString()} ${slot.StartTime} - ${slot.EndTime}`}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th className="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.StudentID}>
                                        <td className="font-mono text-sm">{student.StudentID}</td>
                                        <td>{student.FirstName} {student.LastName}</td>
                                        <td className="text-center">
                                            <select
                                                className="form-select py-1.5 px-3 text-sm w-auto inline-block"
                                                value={attendanceRecords.find(record => record.StudentID === student.StudentID && record.Lecture === selectedLecture)?.Status || 'Present'}
                                                onChange={(e) => handleAttendanceChange(student.StudentID, e)}
                                            >
                                                <option value="Present">Present</option>
                                                <option value="Absent">Absent</option>
                                                <option value="Excused">Excused</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button
                        onClick={handleSaveAttendance}
                        className="btn btn-success btn-lg w-full mt-6"
                        disabled={loading}
                    >
                        {loading ? (<><span className="spinner spinner-sm" /> Saving...</>) : 'Save Attendance'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
