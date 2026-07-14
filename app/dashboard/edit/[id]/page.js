'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HiOutlinePencil } from 'react-icons/hi';

const EditCourse = ({ params }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  
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
        const res = await fetch(`/api/createcourse/${params.id}`, { cache: 'no-store' });
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
      const res = await fetch(`/api/createcourse/${params.id}`, {
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
    <div className="page-container flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-lg animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
            <HiOutlinePencil className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Update course information</p>
        </div>
        {error && <div className="alert alert-error mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="CourseName" className="form-label">Course Name</label>
            <input type="text" id="CourseName" name="CourseName" value={formData.CourseName} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label htmlFor="CourseDescription" className="form-label">Course Description</label>
            <textarea id="CourseDescription" name="CourseDescription" value={formData.CourseDescription} onChange={handleChange} className="form-textarea" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="Credits" className="form-label">Credits</label>
              <input type="text" id="Credits" name="Credits" value={formData.Credits} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label htmlFor="Department" className="form-label">Department</label>
              <input type="text" id="Department" name="Department" value={formData.Department} onChange={handleChange} className="form-input" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full btn-lg mt-2" disabled={loading}>
            {loading ? (<><span className="spinner spinner-sm" /> Updating...</>) : 'Update Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
