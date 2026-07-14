'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

const ChangeTeacherAssignment = ({ params }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [teachers, setTeachers] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
      router.push("/login");
      return;
    } else {
      async function fetchData() {
        try {
          const courseRes = await fetch(`/api/createcourse/${params.id}`, { cache: 'no-store' });
          const courseData = await courseRes.json();
          setCourse(courseData.data);

          const assignmentRes = await fetch(`/api/assignTeacher?courseId=${courseData.data.CourseID}`);
          const assignmentData = await assignmentRes.json();
          setAssignment(assignmentData.assignment);

          const teachersRes = await fetch('/api/addteacher');
          const teachersData = await teachersRes.json();
          setTeachers(teachersData.data);
        } catch (error) {
          setError(error.message);
        }
      }
      fetchData();
    }
  }, [params.id, session, status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment({ ...assignment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const deleteRes = await fetch(`/api/assignTeacher?courseId=${assignment.CourseID}`, {
        method: 'DELETE'
      });
      const deleteResult = await deleteRes.json();
      if (!deleteRes.ok) {
        setError(deleteResult.error);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/assignTeacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Course assigned successfully');
        router.push('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-lg animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
            <HiOutlineSwitchHorizontal className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Change Teacher</h1>
          {course && (
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              {course.CourseName} <span className="text-[var(--text-tertiary)]">(ID: {course.CourseID})</span>
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="AssignmentID" className="form-label">Assignment ID</label>
            <input type="text" id="AssignmentID" name="AssignmentID" value={assignment ? assignment.AssignmentID : ''} onChange={handleChange} className="form-input opacity-60" readOnly />
          </div>
          <div>
            <label htmlFor="TeacherID" className="form-label">New Teacher</label>
            <select id="TeacherID" name="TeacherID" value={assignment ? assignment.TeacherID : ''} onChange={handleChange} className="form-select">
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.TeacherID} value={teacher.TeacherID}>
                  {teacher.FirstName} {teacher.LastName} ({teacher.Department}) ({teacher.TeacherID})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="AssignmentDate" className="form-label">Assignment Date</label>
            <input type="date" id="AssignmentDate" name="AssignmentDate" value={assignment ? assignment.AssignmentDate : ""} onChange={handleChange} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-full btn-lg mt-2" disabled={loading}>
            {loading ? (<><span className="spinner spinner-sm" /> Updating...</>) : 'Update Assignment'}
          </button>
          {error && <div className="alert alert-error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ChangeTeacherAssignment;
