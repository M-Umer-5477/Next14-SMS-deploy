// pages/admin/timetable.js

/*'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminTimetable = () => {
    const [courses, setCourses] = useState([]);
    const [courseID, setCourseID] = useState('');
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [room, setRoom] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false); // State to track form submission status
    const router = useRouter();

    const rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 104']; // Example room options
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        // Fetch all courses
        const fetchCourses = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/fetchcourses');
                const data = await res.json();
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!courseID || !day || !startTime || !endTime || !room) {
            setError('Please fill in all fields.');
            return;
        }

        setSubmitting(true); // Set submitting to true when the form starts submitting

        try {
            const res = await fetch('http://localhost:3000/api/timetable', {
                method: 'POST',
                body: JSON.stringify({ CourseID: courseID, Day: day, StartTime: startTime, EndTime: endTime, Room: room }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error);
                return;
            }

            setSuccess('Timetable entry created successfully.');
            setError('');
            // Reset form fields if needed
            setCourseID('');
            setDay('');
            setStartTime('');
            setEndTime('');
            setRoom('');
        } catch (error) {
            console.error('Failed to create timetable entry:', error);
            setError('Failed to create timetable entry.');
        } finally {
            setSubmitting(false); // Reset submitting state when done
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Timetable</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course</label>
                    <select
                        value={courseID}
                        onChange={(e) => setCourseID(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course.CourseID}>
                                {course.CourseName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Day</label>
                    <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">Select a day</option>
                        {daysOfWeek.map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Room</label>
                    <select
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">Select a room</option>
                        {rooms.map((room) => (
                            <option key={room} value={room}>
                                {room}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={submitting} // Disable the button while submitting
                    >
                        {submitting ? 'Submitting...' : 'Create Timetable Entry'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminTimetable;*/
// pages/admin/timetable.js
'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const GenerateSessionTimetable = () => {
  const [courses, setCourses] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [sessionID, setSessionID] = useState('');
  const [sessionStartDate, setSessionStartDate] = useState('');
  const [sessionEndDate, setSessionEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // State to handle button loading
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
      router.push("/login");
    }
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/fetchcourses');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        setError('Failed to fetch courses.');
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  },[session , router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on submit

    // Validation
    if (!courseID || !sessionID || !sessionStartDate || !sessionEndDate) {
      setError('Please fill in all fields.');
      setLoading(false); // Set loading to false if validation fails
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/generate-session-timetable', {
        method: 'POST',
        body: JSON.stringify({
          CourseID: courseID,
          SessionID: sessionID,
          sessionStartDate,
          sessionEndDate
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(result.message);
        setError('');
      } else {
        setError(result.error || 'Failed to generate session timetable.');
        setSuccess('');
      }
    } catch (error) {
      setError('Failed to generate session timetable.');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Session Timetable</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Course</label>
          <select
            value={courseID}
            onChange={(e) => setCourseID(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course.CourseID}>
                {course.CourseName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Session ID</label>
          <input
            type="text"
            value={sessionID}
            onChange={(e) => setSessionID(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Session Start Date</label>
          <input
            type="date"
            value={sessionStartDate}
            onChange={(e) => setSessionStartDate(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Session End Date</label>
          <input
            type="date"
            value={sessionEndDate}
            onChange={(e) => setSessionEndDate(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading} // Disable button while loading
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Generating...' : 'Generate Timetable'}
        </button>
      </form>
    </div>
  );
};

export default GenerateSessionTimetable;
