'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AddStudent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
      router.push('/login');
    }
  }, [session, router, status]);

  const [student, setStudent] = useState({
    StudentID: '',
    FirstName: '',
    LastName: '',
    DateOfBirth: '',
    Gender: '',
    ContactInfo: '',
    Address: '',
    PersonalEmail: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const generateLoginCredentials = () => {
    const email = `${student.FirstName.toLowerCase()}${student.StudentID}@student.com`;
    const password = `${student.FirstName.toLowerCase()}${student.StudentID}`;
    return { email, password };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { email, password } = generateLoginCredentials();
      const response = await fetch('http://localhost:3000/api/addstudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student, email, password }),
      });

      if (response.ok) {
        alert('Student added successfully!');
        setStudent({
          StudentID: '',
          FirstName: '',
          LastName: '',
          DateOfBirth: '',
          Gender: '',
          ContactInfo: '',
          Address: '',
          PersonalEmail: '',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error adding student. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen w-full mx-auto mt-10">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Add Student</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {['StudentID', 'FirstName', 'LastName', 'DateOfBirth', 'Gender', 'ContactInfo', 'Address', 'PersonalEmail'].map((field, index) => (
              <div key={index} className="mb-4">
                <label htmlFor={field} className="block text-gray-700 text-sm font-bold mb-2">
                  {field.split(/(?=[A-Z])/).join(' ')}
                </label>
                {field === 'Gender' ? (
                  <select
                    name={field}
                    value={student[field]}
                    onChange={handleChange}
                    required
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    type={field === 'DateOfBirth' ? 'date' : field === 'PersonalEmail' ? 'email' : 'text'}
                    name={field}
                    placeholder={field.split(/(?=[A-Z])/).join(' ')}
                    value={student[field]}
                    onChange={handleChange}
                    required
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                )}
              </div>
            ))}
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? 'Adding Student...' : 'Add Student'}
              </button>
              {error && <p className="text-red-500 text-xs italic mt-2">Error: {error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
