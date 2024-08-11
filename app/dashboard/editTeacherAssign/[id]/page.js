'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
          const courseRes = await fetch(`http://localhost:3000/api/createcourse/${params.id}`, { cache: 'no-store' });
          const courseData = await courseRes.json();
          setCourse(courseData.data);

          const assignmentRes = await fetch(`http://localhost:3000/api/assignTeacher?courseId=${courseData.data.CourseID}`);
          const assignmentData = await assignmentRes.json();
          setAssignment(assignmentData.assignment);

          const teachersRes = await fetch('http://localhost:3000/api/addteacher');
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
      const deleteRes = await fetch(`http://localhost:3000/api/assignTeacher?courseId=${assignment.CourseID}`, {
        method: 'DELETE'
      });
      const deleteResult = await deleteRes.json();
      if (!deleteRes.ok) {
        setError(deleteResult.error);
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:3000/api/assignTeacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Course assigned successfully');
        router.push('/dashboard'); // Redirect to success page or dashboard
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Change Teacher Assignment</h2>
        {course && (
          <p className="text-center text-lg text-gray-600 mb-6">
            Course: {course.CourseName} (ID: {course.CourseID})
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="AssignmentID" className="block text-gray-700 font-bold mb-2">Assignment ID</label>
            <input
              type="text"
              id="AssignmentID"
              name="AssignmentID"
              value={assignment ? assignment.AssignmentID : ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label htmlFor="TeacherID" className="block text-gray-700 font-bold mb-2">Teacher ID</label>
            <select
              id="TeacherID"
              name="TeacherID"
              value={assignment ? assignment.TeacherID : ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.TeacherID} value={teacher.TeacherID}>
                  {teacher.FirstName} {teacher.LastName} ({teacher.Department}) ({teacher.TeacherID})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="AssignmentDate" className="block text-gray-700 font-bold mb-2">Assignment Date</label>
            <input
              type="date"
              id="AssignmentDate"
              name="AssignmentDate"
              value={assignment ? assignment.AssignmentDate : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Updating Assignment...' : 'Update Assignment'}
          </button>
          {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ChangeTeacherAssignment;


