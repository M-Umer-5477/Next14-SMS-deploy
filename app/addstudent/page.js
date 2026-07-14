'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HiOutlineUserAdd } from 'react-icons/hi';

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
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    try {
      const { email, password } = generateLoginCredentials();
      const response = await fetch('/api/addstudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student, email, password }),
      });

      if (response.ok) {
        setSuccess('Student added successfully!');
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

  const fields = [
    { name: 'StudentID', label: 'Student ID', type: 'text' },
    { name: 'FirstName', label: 'First Name', type: 'text' },
    { name: 'LastName', label: 'Last Name', type: 'text' },
    { name: 'DateOfBirth', label: 'Date of Birth', type: 'date' },
    { name: 'Gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
    { name: 'ContactInfo', label: 'Contact Info', type: 'text' },
    { name: 'Address', label: 'Address', type: 'text' },
    { name: 'PersonalEmail', label: 'Personal Email', type: 'email' },
  ];

  return (
    <div className="page-container flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-2xl animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
            <HiOutlineUserAdd className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Add Student</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Register a new student in the system</p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="form-label">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={student[field.name]}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  value={student[field.name]}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              )}
            </div>
          ))}
          <div className="sm:col-span-2 space-y-3 mt-2">
            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading ? (<><span className="spinner spinner-sm" /> Adding Student...</>) : 'Add Student'}
            </button>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
