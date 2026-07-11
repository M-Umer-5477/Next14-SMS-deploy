'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Signup = () => {
    const [role, setRole] = useState('Admin'); // Default role
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        registrationCode: '',
        // Teacher/Student specific fields
        TeacherID: '',
        StudentID: '',
        FirstName: '',
        LastName: '',
        PersonalEmail: '',
        Department: '',
        DateOfBirth: '',
        Gender: '',
        ContactInfo: '',
        Address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;
        if (session) {
            if (session.user.email.includes('@teacher.com')) {
                router.push('/teacherDashboard');
            } else if (session.user.email.includes('@student.com')) {
                router.push('/studentDashboard');
            } else {
                router.push('/dashboard');
            }
        }
    }, [session, status, router]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const payload = { ...formData, role };

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            setLoading(false);

            if (response.ok) {
                setSuccess('Signup successful! You can now login.');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    setError(errorData.error || 'Signup failed. Please try again.');
                } else {
                    setError('Signup failed. Please try again.');
                }
            }
        } catch (error) {
            setLoading(false);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Student Management System</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Role Selection */}
                    <div>
                        <label htmlFor="role" className="block text-gray-700 font-bold mb-2">I am registering as a:</label>
                        <select id="role" value={role} onChange={handleRoleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300">
                            <option value="Admin">Admin</option>
                            <option value="SuperAdmin">Super Admin</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Student">Student</option>
                        </select>
                    </div>

                    {/* Registration Code (Required for all roles) */}
                    <div>
                        <label htmlFor="registrationCode" className="block text-gray-700 font-bold mb-2">Registration Code:</label>
                        <input type="password" id="registrationCode" value={formData.registrationCode} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300" required placeholder="Provided by your school" />
                    </div>

                    {/* Admin / SuperAdmin Fields */}
                    {(role === 'Admin' || role === 'SuperAdmin') && (
                        <>
                            <div>
                                <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
                                <input type="text" id="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">System Email:</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required />
                            </div>
                        </>
                    )}

                    {/* Teacher Fields */}
                    {role === 'Teacher' && (
                        <>
                            <div><label htmlFor="TeacherID" className="block text-gray-700 font-bold mb-2">Teacher ID:</label>
                            <input type="text" id="TeacherID" value={formData.TeacherID} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label htmlFor="FirstName" className="block text-gray-700 font-bold mb-2">First Name:</label>
                                <input type="text" id="FirstName" value={formData.FirstName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                                <div><label htmlFor="LastName" className="block text-gray-700 font-bold mb-2">Last Name:</label>
                                <input type="text" id="LastName" value={formData.LastName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                            </div>
                            <div><label htmlFor="email" className="block text-gray-700 font-bold mb-2">System Email (ends with @teacher.com):</label>
                            <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                            <div><label htmlFor="PersonalEmail" className="block text-gray-700 font-bold mb-2">Personal Email:</label>
                            <input type="email" id="PersonalEmail" value={formData.PersonalEmail} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                            <div><label htmlFor="Department" className="block text-gray-700 font-bold mb-2">Department:</label>
                            <input type="text" id="Department" value={formData.Department} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                        </>
                    )}

                    {/* Student Fields */}
                    {role === 'Student' && (
                        <>
                            <div><label htmlFor="StudentID" className="block text-gray-700 font-bold mb-2">Student ID:</label>
                            <input type="text" id="StudentID" value={formData.StudentID} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label htmlFor="FirstName" className="block text-gray-700 font-bold mb-2">First Name:</label>
                                <input type="text" id="FirstName" value={formData.FirstName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                                <div><label htmlFor="LastName" className="block text-gray-700 font-bold mb-2">Last Name:</label>
                                <input type="text" id="LastName" value={formData.LastName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label htmlFor="DateOfBirth" className="block text-gray-700 font-bold mb-2">Date of Birth:</label>
                                <input type="date" id="DateOfBirth" value={formData.DateOfBirth} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                                <div><label htmlFor="Gender" className="block text-gray-700 font-bold mb-2">Gender:</label>
                                <select id="Gender" value={formData.Gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select></div>
                            </div>
                            <div><label htmlFor="ContactInfo" className="block text-gray-700 font-bold mb-2">Contact Info:</label>
                            <input type="text" id="ContactInfo" value={formData.ContactInfo} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                            <div><label htmlFor="Address" className="block text-gray-700 font-bold mb-2">Address:</label>
                            <input type="text" id="Address" value={formData.Address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                            <div><label htmlFor="email" className="block text-gray-700 font-bold mb-2">System Email (ends with @student.com):</label>
                            <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                            <div><label htmlFor="PersonalEmail" className="block text-gray-700 font-bold mb-2">Personal Email:</label>
                            <input type="email" id="PersonalEmail" value={formData.PersonalEmail} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" required /></div>
                        </>
                    )}

                    {/* Common Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
                        <input type="password" id="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300" required />
                    </div>

                    <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                    {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                    {success && <p className="mt-4 text-center text-green-500 font-bold">{success}</p>}
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
