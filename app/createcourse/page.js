'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HiOutlineBookOpen } from 'react-icons/hi';

const AddCourse = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
        router.push("/login");
    }
}, [session, status, router]);

  const [course, setCourse] = useState({
    CourseID: '',
    CourseName: '',
    CourseDescription: '',
    Credits: '',
    Department: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/createcourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        console.log('Course added:', data);
        setSuccess('Course created successfully!');
        setCourse({
          CourseID: '',
          CourseName: '',
          CourseDescription: '',
          Credits: '',
          Department: ''
        });
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          setError(errorData.error || 'Error adding course. Please try again.');
        } else {
          setError('Error adding course. Please try again.');
        }
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="page-container flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-lg animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
            <HiOutlineBookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create Course</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Add a new course to the system</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Course ID</label>
            <input type="text" name="CourseID" value={course.CourseID} onChange={handleChange} className="form-input" required />
          </div>
          <div>
            <label className="form-label">Course Name</label>
            <input type="text" name="CourseName" value={course.CourseName} onChange={handleChange} className="form-input" required />
          </div>
          <div>
            <label className="form-label">Description</label>
            <input type="text" name="CourseDescription" value={course.CourseDescription} onChange={handleChange} className="form-input" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Credits</label>
              <input type="number" name="Credits" value={course.Credits} onChange={handleChange} className="form-input" required />
            </div>
            <div>
              <label className="form-label">Department</label>
              <input type="text" name="Department" value={course.Department} onChange={handleChange} className="form-input" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full btn-lg mt-2" disabled={loading}>
            {loading ? (<><span className="spinner spinner-sm" /> Adding Course...</>) : 'Create Course'}
          </button>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
