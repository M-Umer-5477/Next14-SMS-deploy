'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';

const GenerateSessionTimetable = () => {
  const [courses, setCourses] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [sessionID, setSessionID] = useState('');
  const [sessionStartDate, setSessionStartDate] = useState('');
  const [sessionEndDate, setSessionEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        const res = await fetch('/api/fetchcourses');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        setError('Failed to fetch courses.');
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!courseID || !sessionID || !sessionStartDate || !sessionEndDate) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/generate-session-timetable', {
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
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-lg animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
            <HiOutlineCalendar className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Generate Timetable</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Create session timetable from weekly schedule</p>
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Course</label>
            <select value={courseID} onChange={(e) => setCourseID(e.target.value)} className="form-select">
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course.CourseID}>
                  {course.CourseName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Session ID</label>
            <input type="text" value={sessionID} onChange={(e) => setSessionID(e.target.value)} className="form-input" placeholder="e.g., Fall-2024" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Date</label>
              <input type="date" value={sessionStartDate} onChange={(e) => setSessionStartDate(e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input type="date" value={sessionEndDate} onChange={(e) => setSessionEndDate(e.target.value)} className="form-input" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg mt-2">
            {loading ? (<><span className="spinner spinner-sm" /> Generating...</>) : 'Generate Timetable'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateSessionTimetable;
