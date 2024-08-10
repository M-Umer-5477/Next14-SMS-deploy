'use client'
import { useState , useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
export default function AddTeacher() {
  const [formData, setFormData] = useState({
    TeacherID: '',
    FirstName: '',
    LastName: '',
    PersonalEmail: '',
    Department: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Track submission state
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
        router.push("/login");
    }
}, [session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear the error when the user starts typing
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

    setLoading(true); // Disable the button and show loading state

    // Generate loginUsername and password
    const email = generateLoginUsername(formData.FirstName, formData.TeacherID);
    const password = generatePassword(formData.FirstName, formData.TeacherID);

    try {
      const response = await fetch('http://localhost:3000/api/addteacher', {
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
        alert('Teacher added successfully!');
        setFormData({
          TeacherID: '',
          FirstName: '',
          LastName: '',
          PersonalEmail: '',
          Department: ''
        });
        setErrors({});
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false); // Re-enable the button
    }
  };

  const generateLoginUsername = (firstName, teacherID) => {
    return `${firstName.toLowerCase()}${teacherID}@teacher.com`;
  };

  const generatePassword = (firstName, teacherID) => {
    return `${firstName.toLowerCase()}${teacherID}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Teacher</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="TeacherID" className="block text-sm font-medium text-gray-700">Teacher ID:</label>
              <input
                type="text"
                name="TeacherID"
                id="TeacherID"
                value={formData.TeacherID}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.TeacherID ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.TeacherID && <p className="mt-1 text-sm text-red-600">{errors.TeacherID}</p>}
            </div>
            <div>
              <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">First Name:</label>
              <input
                type="text"
                name="FirstName"
                id="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.FirstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.FirstName && <p className="mt-1 text-sm text-red-600">{errors.FirstName}</p>}
            </div>
            <div>
              <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input
                type="text"
                name="LastName"
                id="LastName"
                value={formData.LastName}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.LastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.LastName && <p className="mt-1 text-sm text-red-600">{errors.LastName}</p>}
            </div>
            <div>
              <label htmlFor="PersonalEmail" className="block text-sm font-medium text-gray-700">Personal Email:</label>
              <input
                type="email"
                name="PersonalEmail"
                id="PersonalEmail"
                value={formData.PersonalEmail}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.PersonalEmail ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.PersonalEmail && <p className="mt-1 text-sm text-red-600">{errors.PersonalEmail}</p>}
            </div>
            <div>
              <label htmlFor="Department" className="block text-sm font-medium text-gray-700">Department:</label>
              <input
                type="text"
                name="Department"
                id="Department"
                value={formData.Department}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.Department ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.Department && <p className="mt-1 text-sm text-red-600">{errors.Department}</p>}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`w-full py-2 px-4 ${loading ? 'bg-gray-500' : 'bg-indigo-600'} text-white font-semibold rounded-md shadow-sm hover:${loading ? 'bg-gray-500' : 'bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            {loading ? 'Adding Teacher...' : 'Add Teacher'}
          </button>
        </form>
      </div>
    </div>
  );
}


