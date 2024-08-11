'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const InsertWeeklyTimetable = () => {
  const [courseID, setCourseID] = useState('');
  const [courses, setCourses] = useState([]);
  const [entries, setEntries] = useState({
    Monday: [{ startTime: '08:00', endTime: '09:00', room: '101' }],
    Tuesday: [{ startTime: '08:00', endTime: '09:00', room: '101' }],
    Wednesday: [{ startTime: '08:00', endTime: '09:00', room: '101' }],
    Thursday: [{ startTime: '08:00', endTime: '09:00', room: '101' }],
    Friday: [{ startTime: '08:00', endTime: '09:00', room: '101' }],
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);// State to handle button loading
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
      router.push("/login");
    }
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/fetchcourses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setMessage('Failed to fetch courses');
      }
    };

    fetchCourses();
  },[session , status, router]);

  const handleInputChange = (day, index, field, value) => {
    const newEntries = { ...entries };
    newEntries[day][index][field] = value;
    setEntries(newEntries);
  };

  const handleAddSlot = (day) => {
    const newEntries = { ...entries };
    newEntries[day].push({ startTime: '08:00', endTime: '09:00', room: '101' });
    setEntries(newEntries);
  };

  const handleRemoveSlot = (day, index) => {
    const newEntries = { ...entries };
    newEntries[day].splice(index, 1);
    setEntries(newEntries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on submit

    const data = [];
    for (const [day, slots] of Object.entries(entries)) {
      slots.forEach((entry) => {
        data.push({
          CourseID: courseID,
          Day: day,
          StartTime: entry.startTime,
          EndTime: entry.endTime,
          Room: entry.room,
        });
      });
    }

    try {
      const response = await fetch('http://localhost:3000/api/insert-weekly-timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Weekly timetable inserted successfully');
      } else {
        setMessage(result.error || 'Failed to insert weekly timetable');
      }
    } catch (error) {
      console.error('Error inserting weekly timetable:', error);
      setMessage('Failed to insert weekly timetable');
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Insert Weekly Timetable</h1>
      {message && <div className="mb-4">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Course</label>
          <select
            value={courseID}
            onChange={(e) => setCourseID(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course.CourseID}>
                {course.CourseName}
              </option>
            ))}
          </select>
        </div>
        {Object.keys(entries).map((day) => (
          <div key={day} className="space-y-2">
            <h2 className="text-xl font-bold">{day}</h2>
            {entries[day].map((entry, index) => (
              <div key={index} className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={entry.startTime}
                    onChange={(e) => handleInputChange(day, index, 'startTime', e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={entry.endTime}
                    onChange={(e) => handleInputChange(day, index, 'endTime', e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Room</label>
                  <select
                    value={entry.room}
                    onChange={(e) => handleInputChange(day, index, 'room', e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Room</option>
                    <option value="101">101</option>
                    <option value="102">102</option>
                    <option value="103">103</option>
                    <option value="104">104</option>
                  </select>
                </div>
                {entries[day].length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(day, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Slot
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddSlot(day)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Add Slot
            </button>
          </div>
        ))}
        <div>
          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? 'Submitting...' : 'Insert Weekly Timetable'}
          </button>
          <Link href='/timetable' className="inline-flex ml-6 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Generate Session Classes</Link>

        </div>
      </form>
    </div>
  );
};

export default InsertWeeklyTimetable;


