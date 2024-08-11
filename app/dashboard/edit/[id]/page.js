'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const EditCourse = ({ params }) => {
  const router = useRouter();
  const { data: session , status} = useSession();
  
  const [formData, setFormData] = useState({
    CourseName: '',
    CourseDescription: '',
    Credits: '',
    Department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
      router.push('/login');
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/createcourse/${params.id}`, { cache: 'no-store' });
        const { success, data, error } = await res.json();

        if (!res.ok || !success) {
          throw new Error(error || 'Failed to fetch course data');
        }

        setFormData({
          CourseName: data.CourseName || '',
          CourseDescription: data.CourseDescription || '',
          Credits: data.Credits || '',
          Department: data.Department || '',
        });
      } catch (error) {
        console.error('Failed to fetch course data:', error);
        setError('Failed to load course data');
      }
    };

    fetchCourse();
  }, [params.id, session, status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:3000/api/createcourse/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to update course');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Error updating course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Course</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="CourseName" className="block text-gray-700 font-bold mb-2">Course Name</label>
            <input
              type="text"
              id="CourseName"
              name="CourseName"
              value={formData.CourseName}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="CourseDescription" className="block text-gray-700 font-bold mb-2">Course Description</label>
            <textarea
              id="CourseDescription"
              name="CourseDescription"
              value={formData.CourseDescription}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Credits" className="block text-gray-700 font-bold mb-2">Credits</label>
            <input
              type="text"
              id="Credits"
              name="Credits"
              value={formData.Credits}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Department" className="block text-gray-700 font-bold mb-2">Department</label>
            <input
              type="text"
              id="Department"
              name="Department"
              value={formData.Department}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;

