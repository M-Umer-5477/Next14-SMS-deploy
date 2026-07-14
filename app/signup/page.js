'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HiOutlineUserAdd } from 'react-icons/hi';

const Signup = () => {
    const [role, setRole] = useState('Admin');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        registrationCode: '',
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

    const handleRoleChange = (newRole) => {
        setRole(newRole);
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

    const roles = ['Admin', 'SuperAdmin', 'Teacher', 'Student'];

    return (
        <div className="page-container flex items-center justify-center py-10">
            {/* Background accents */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-[var(--accent)] opacity-[0.06] blur-3xl" />
                <div className="absolute bottom-1/3 -left-32 w-80 h-80 rounded-full bg-[hsl(280,85%,55%)] opacity-[0.04] blur-3xl" />
            </div>

            <div className="glass-card p-8 w-full max-w-xl animate-slide-up relative z-10">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
                        <HiOutlineUserAdd className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">Register for the SMS Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Role Selection — Segmented Control */}
                    <div>
                        <label className="form-label">I am registering as</label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-[var(--bg-input)] rounded-lg border border-[var(--border-subtle)]">
                            {roles.map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => handleRoleChange(r)}
                                    className={`py-2 px-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                                        role === r
                                            ? 'bg-[var(--accent)] text-white shadow-md'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                                    }`}
                                >
                                    {r === 'SuperAdmin' ? 'Super Admin' : r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Registration Code */}
                    <div>
                        <label htmlFor="registrationCode" className="form-label">Registration Code</label>
                        <input type="password" id="registrationCode" value={formData.registrationCode} onChange={handleChange} className="form-input" required placeholder="Provided by your school" />
                    </div>

                    {/* Admin / SuperAdmin Fields */}
                    {(role === 'Admin' || role === 'SuperAdmin') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="username" className="form-label">Username</label>
                                <input type="text" id="username" value={formData.username} onChange={handleChange} className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="form-label">System Email</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} className="form-input" required />
                            </div>
                        </div>
                    )}

                    {/* Teacher Fields */}
                    {role === 'Teacher' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="TeacherID" className="form-label">Teacher ID</label>
                                <input type="text" id="TeacherID" value={formData.TeacherID} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="FirstName" className="form-label">First Name</label>
                                    <input type="text" id="FirstName" value={formData.FirstName} onChange={handleChange} className="form-input" required />
                                </div>
                                <div>
                                    <label htmlFor="LastName" className="form-label">Last Name</label>
                                    <input type="text" id="LastName" value={formData.LastName} onChange={handleChange} className="form-input" required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="form-label">System Email (ends with @teacher.com)</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="PersonalEmail" className="form-label">Personal Email</label>
                                <input type="email" id="PersonalEmail" value={formData.PersonalEmail} onChange={handleChange} className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="Department" className="form-label">Department</label>
                                <input type="text" id="Department" value={formData.Department} onChange={handleChange} className="form-input" required />
                            </div>
                        </div>
                    )}

                    {/* Student Fields */}
                    {role === 'Student' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="StudentID" className="form-label">Student ID</label>
                                <input type="text" id="StudentID" value={formData.StudentID} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="FirstName" className="form-label">First Name</label>
                                    <input type="text" id="FirstName" value={formData.FirstName} onChange={handleChange} className="form-input" required />
                                </div>
                                <div>
                                    <label htmlFor="LastName" className="form-label">Last Name</label>
                                    <input type="text" id="LastName" value={formData.LastName} onChange={handleChange} className="form-input" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="DateOfBirth" className="form-label">Date of Birth</label>
                                    <input type="date" id="DateOfBirth" value={formData.DateOfBirth} onChange={handleChange} className="form-input" required />
                                </div>
                                <div>
                                    <label htmlFor="Gender" className="form-label">Gender</label>
                                    <select id="Gender" value={formData.Gender} onChange={handleChange} className="form-select" required>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="ContactInfo" className="form-label">Contact Info</label>
                                <input type="text" id="ContactInfo" value={formData.ContactInfo} onChange={handleChange} className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="Address" className="form-label">Address</label>
                                <input type="text" id="Address" value={formData.Address} onChange={handleChange} className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="form-label">System Email (ends with @student.com)</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="PersonalEmail" className="form-label">Personal Email</label>
                                <input type="email" id="PersonalEmail" value={formData.PersonalEmail} onChange={handleChange} className="form-input" required />
                            </div>
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" id="password" value={formData.password} onChange={handleChange} className="form-input" required />
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner spinner-sm" />
                                Registering...
                            </>
                        ) : 'Create Account'}
                    </button>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                </form>

                <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--accent-light)] hover:text-[var(--accent)] font-medium transition-colors">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
