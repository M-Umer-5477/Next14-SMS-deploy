'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Attendance = ({ params }) => {
    const [students, setStudents] = useState([]);
    const [course, setCourse] = useState({});
    const [timetable, setTimetable] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
                const resCourse = await fetch(`http://localhost:3000/api/createcourse/${params.id}`, { cache: 'no-store' });
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
    }, [params.id],session, router);

    useEffect(() => {
        if (selectedLecture) {
            initializeAttendanceRecords();
        }
    }, [selectedLecture]);

    const fetchEnrolledStudents = async (courseID) => {
        try {
            const res = await fetch(`http://localhost:3000/api/enrollment?courseId=${courseID}`);
            const data = await res.json();
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch enrolled students:', error);
            setError('Failed to fetch enrolled students.');
        }
    };

    const fetchTimetable = async (courseID) => {
        try {
            const res = await fetch(`http://localhost:3000/api/get-session-timetable?courseId=${courseID}`);
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

    const initializeAttendanceRecords = () => {
        const newRecords = students.map(student => ({
            AttendanceID: `${student.StudentID}-${Date.now()}`,
            StudentID: student.StudentID,
            CourseID: course.CourseID,
            Lecture: selectedLecture,
            Status: 'Present' // Default status
        }));
        setAttendanceRecords(newRecords);
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
            alert('Please select a lecture.');
            return;
        }

        const validRecords = attendanceRecords.filter(record => students.some(student => student.StudentID === record.StudentID));

        console.log("Sending attendance records:", validRecords);

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ attendanceRecords: validRecords })
            });
            setLoading(false);

            if (response.ok) {
                alert('Attendance saved successfully!');
                setAttendanceRecords([]);
                setSelectedLecture('');
            } else {
                throw new Error('Failed to save attendance');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Failed to save attendance. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Attendance</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Lecture</label>
                <select
                    value={selectedLecture}
                    onChange={(e) => setSelectedLecture(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm mb-4"
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
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-gray-200">Student ID</th>
                            <th className="py-2 px-4 border-b bg-gray-200">Name</th>
                            <th className="py-2 px-4 border-b bg-gray-200">Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.StudentID} className="hover:bg-gray-100">
                                <td className="py-2 px-4 text-center border-b">{student.StudentID}</td>
                                <td className="py-2 px-4 text-center border-b">{student.FirstName} {student.LastName}</td>
                                <td className="py-2 px-4 text-center border-b">
                                    <select 
                                        className="bg-gray-200 border border-gray-300 p-2 rounded" 
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
                <button 
                    onClick={handleSaveAttendance} 
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                   {loading ? 'Saving...' : 'Save Attendance'}
                </button>
            </div>
        </div>
    );
};

export default Attendance;


/*
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Attendance = (ctx) => {
    const [students, setStudents] = useState([]);
    const [course, setCourse] = useState({});
    const [timetable, setTimetable] = useState([]);
    const [selectedTimeslot, setSelectedTimeslot] = useState('');
    const [selectedDate, setSelectedDate] = useState(''); // State for class date
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        async function fetchCourse() {
            try {
                const res = await fetch(`http://localhost:3000/api/createcourse/${ctx.params.id}`, { cache: 'no-store' });
                const courseData = await res.json();
                setCourse(courseData.data);
                fetchEnrolledStudents(courseData.data.CourseID); // Call fetchEnrolledStudents after setting course data
                fetchTimetable(courseData.data.CourseID); // Fetch timetable slots
            } catch (error) {
                console.error("Failed to fetch course:", error);
            }
        }
    
        fetchCourse();
    }, [ctx.params.id]);
    
    const fetchEnrolledStudents = async (courseID) => {
        try {
            const res = await fetch(`http://localhost:3000/api/enrollment?courseId=${courseID}`);
            const data = await res.json();
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch enrolled students:', error);
        }
    };

    const fetchTimetable = async (courseID) => {
        try {
            const res = await fetch(`http://localhost:3000/api/coursetimetable?courseId=${courseID}`);
            const data = await res.json();
            if (data.error) {
                console.error('Error fetching timetable:', data.error);
                setTimetable([]); // Ensure timetable is set to an empty array if there is an error
            } else {
                setTimetable(data); // Assume the timetable is directly set here
            }
        } catch (error) {
            console.error('Failed to fetch timetable:', error);
            setTimetable([]); // Ensure timetable is set to an empty array on fetch error
        }
    };

    const handleAttendanceChange = (studentId, event) => {
        const newAttendanceRecords = [...attendanceRecords];
        const index = newAttendanceRecords.findIndex(record => record.StudentID === studentId && record.Date === selectedDate && record.Timeslot === selectedTimeslot);
        if (index !== -1) {
            newAttendanceRecords[index].Status = event.target.value;
        } else {
            newAttendanceRecords.push({
                AttendanceID: `${studentId}-${Date.now()}`, // Generate a unique ID for each attendance record
                StudentID: studentId,
                CourseID: course.CourseID,
                Date: selectedDate, // Use the selected date for the attendance record
                Status: event.target.value,
                Timeslot: selectedTimeslot // Save selected timeslot with attendance record
            });
        }
        setAttendanceRecords(newAttendanceRecords);
    };
    
    const handleSaveAttendance = async () => {
        if (!selectedTimeslot || !selectedDate) {
            alert('Please select both timeslot and date.');
            return;
        }
    
        // Log records to ensure Timeslot data is complete
        console.log("Sending attendance records:", attendanceRecords);
    
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ attendanceRecords })
            });
            setLoading(false);
    
            if (response.ok) {
                alert('Attendance saved successfully!');
                setAttendanceRecords([]);
                setSelectedTimeslot(''); // Reset selected timeslot after saving
                setSelectedDate(''); // Reset selected date after saving
            } else {
                throw new Error('Failed to save attendance');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Failed to save attendance. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Attendance</h1>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Class Date</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm mb-4"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Timeslot</label>
                <select
                    value={selectedTimeslot}
                    onChange={(e) => setSelectedTimeslot(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm mb-4"
                >
                    <option value="">Select a timeslot</option>
                    {timetable.map(slot => (
                        <option key={slot._id} value={`${slot.Day} ${slot.StartTime} - ${slot.EndTime}`}>
                            {`${slot.Day} ${slot.StartTime} - ${slot.EndTime}`}
                        </option>
                    ))}
                </select>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-gray-200">Student ID</th>
                            <th className="py-2 px-4 border-b bg-gray-200">Name</th>
                            <th className="py-2 px-4 border-b bg-gray-200">Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.StudentID} className="hover:bg-gray-100">
                                <td className="py-2 px-4 text-center border-b">{student.StudentID}</td>
                                <td className="py-2 px-4 text-center border-b">{student.FirstName} {student.LastName}</td>
                                <td className="py-2 px-4 text-center border-b">
                                    <select 
                                        className="bg-gray-200 border border-gray-300 p-2 rounded" 
                                        value={attendanceRecords.find(record => record.StudentID === student.StudentID && record.Date === selectedDate && record.Timeslot === selectedTimeslot)?.Status || 'Present'} 
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
                <button 
                    onClick={handleSaveAttendance} 
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                   {loading ? 'Saving...' : 'Save Attendance'}
                </button>
            </div>
        </div>
    );
};

export default Attendance;*/




