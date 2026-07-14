'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineCalendar, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

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
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
      router.push("/login");
    }
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/fetchcourses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setMessage('Failed to fetch courses');
        setMessageType('error');
      }
    };

    fetchCourses();
  }, [session, status, router]);

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
    setLoading(true);
    setMessage('');

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
      const response = await fetch('/api/insert-weekly-timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Weekly timetable inserted successfully');
        setMessageType('success');
      } else {
        setMessage(result.error || 'Failed to insert weekly timetable');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error inserting weekly timetable:', error);
      setMessage('Failed to insert weekly timetable');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const dayColors = {
    Monday: 'var(--accent)',
    Tuesday: 'var(--success)',
    Wednesday: 'var(--warning)',
    Thursday: 'var(--info)',
    Friday: 'hsl(340, 75%, 55%)',
  };

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="page-header animate-slide-up">
          <h1 className="page-title">Weekly Timetable</h1>
          <p className="page-subtitle">Configure the weekly class schedule</p>
        </div>

        <div className="glass-card p-6 sm:p-8 animate-fade-in">
          {message && (
            <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="form-label">Course</label>
              <select value={courseID} onChange={(e) => setCourseID(e.target.value)} className="form-select" required>
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course.CourseID}>
                    {course.CourseName}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Sections */}
            {Object.keys(entries).map((day) => (
              <div key={day} className="rounded-xl border border-[var(--border-subtle)] overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-input)]" style={{ borderLeft: `3px solid ${dayColors[day]}` }}>
                  <HiOutlineCalendar className="w-4 h-4" style={{ color: dayColors[day] }} />
                  <h3 className="font-semibold text-sm">{day}</h3>
                  <span className="text-xs text-[var(--text-tertiary)]">{entries[day].length} slot{entries[day].length !== 1 ? 's' : ''}</span>
                </div>
                <div className="p-4 space-y-3">
                  {entries[day].map((entry, index) => (
                    <div key={index} className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="form-label">Start</label>
                        <input type="time" value={entry.startTime} onChange={(e) => handleInputChange(day, index, 'startTime', e.target.value)} className="form-input" required />
                      </div>
                      <div className="flex-1">
                        <label className="form-label">End</label>
                        <input type="time" value={entry.endTime} onChange={(e) => handleInputChange(day, index, 'endTime', e.target.value)} className="form-input" required />
                      </div>
                      <div className="flex-1">
                        <label className="form-label">Room</label>
                        <select value={entry.room} onChange={(e) => handleInputChange(day, index, 'room', e.target.value)} className="form-select" required>
                          <option value="">Room</option>
                          <option value="101">101</option>
                          <option value="102">102</option>
                          <option value="103">103</option>
                          <option value="104">104</option>
                        </select>
                      </div>
                      {entries[day].length > 0 && (
                        <button type="button" onClick={() => handleRemoveSlot(day, index)} className="btn btn-ghost btn-sm text-[var(--danger)] hover:bg-[var(--danger-bg)] mb-0.5">
                          <HiOutlineX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => handleAddSlot(day)} className="btn btn-ghost btn-sm text-[var(--success)] hover:bg-[var(--success-bg)]">
                    <HiOutlinePlus className="w-4 h-4" />
                    Add Slot
                  </button>
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg flex-1">
                {loading ? (<><span className="spinner spinner-sm" /> Submitting...</>) : 'Save Weekly Timetable'}
              </button>
              <Link href='/timetable' className="btn btn-outline btn-lg flex-1 text-center">
                Generate Session Classes
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InsertWeeklyTimetable;
