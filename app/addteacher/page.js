'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HiOutlineAcademicCap } from 'react-icons/hi';

export default function AddTeacher() {
  const [formData, setFormData] = useState({
    TeacherID: '',
    FirstName: '',
    LastName: '',
    PersonalEmail: '',
    Department: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
        router.push("/login");
    }
}, [session, status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const validate = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.TeacherID) {
      formErrors.TeacherID = 'Teacher ID is required';
      isValid = false;
    }

    if (!formData.FirstName) {
      formErrors.FirstName = 'First Name is required';
      isValid = false;
    }

    if (!formData.LastName) {
      formErrors.LastName = 'Last Name is required';
      isValid = false;
    }

    if (!formData.PersonalEmail || !/\S+@\S+\.\S+/.test(formData.PersonalEmail)) {
      formErrors.PersonalEmail = 'Valid Personal Email is required';
      isValid = false;
    }

    if (!formData.Department) {
      formErrors.Department = 'Department is required';
      isValid = false;
    }

    return { formErrors, isValid };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { formErrors, isValid } = validate();
    if (!isValid) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setSuccess('');
    setSubmitError('');

    const email = generateLoginUsername(formData.FirstName, formData.TeacherID);
    const password = generatePassword(formData.FirstName, formData.TeacherID);

    try {
      const response = await fetch('/api/addteacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: email,
          password: password
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Teacher added successfully!');
        setFormData({
          TeacherID: '',
          FirstName: '',
          LastName: '',
          PersonalEmail: '',
          Department: ''
        });
        setErrors({});
      } else {
        setSubmitError(data.error || 'Failed to add teacher.');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const generateLoginUsername = (firstName, teacherID) => {
    return `${firstName.toLowerCase()}${teacherID}@teacher.com`;
  };

  const generatePassword = (firstName, teacherID) => {
    return `${firstName.toLowerCase()}${teacherID}`;
  };

  const fields = [
    { name: 'TeacherID', label: 'Teacher ID', type: 'text' },
    { name: 'FirstName', label: 'First Name', type: 'text' },
    { name: 'LastName', label: 'Last Name', type: 'text' },
    { name: 'PersonalEmail', label: 'Personal Email', type: 'email' },
    { name: 'Department', label: 'Department', type: 'text' },
  ];

  return (
    <div className="page-container flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-2xl animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
            <HiOutlineAcademicCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Add Teacher</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Register a new teacher in the system</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="form-label">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className={`form-input ${errors[field.name] ? 'error' : ''}`}
                />
                {errors[field.name] && <p className="form-error">{errors[field.name]}</p>}
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full btn-lg mt-2"
          >
            {loading ? (<><span className="spinner spinner-sm" /> Adding Teacher...</>) : 'Add Teacher'}
          </button>
          {submitError && <div className="alert alert-error">{submitError}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </form>
      </div>
    </div>
  );
}
