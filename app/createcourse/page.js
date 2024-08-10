'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AddCourse = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
        router.push("/login");
    }
}, [session, router]);

  const [course, setCourse] = useState({
    CourseID: '',
    CourseName: '',
    CourseDescription: '',
    Credits: '',
    Department: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    try {
      const response = await fetch('http://localhost:3000/api/createcourse', {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add a New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">CourseID:</label>
            <input
              type="text"
              name="CourseID"
              value={course.CourseID}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">CourseName:</label>
            <input
              type="text"
              name="CourseName"
              value={course.CourseName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">CourseDescription:</label>
            <input
              type="text"
              name="CourseDescription"
              value={course.CourseDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Credits:</label>
            <input
              type="number"
              name="Credits"
              value={course.Credits}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Department:</label>
            <input
              type="text"
              name="Department"
              value={course.Department}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Adding Course...' : 'Add Course'}
          </button>
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
