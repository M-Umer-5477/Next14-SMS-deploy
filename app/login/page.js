'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === 'loading') return;
        if (session) {
            if (session.user.email.includes('@teacher.com')) {
                router.push('/teacherDashboard');
            }
            else if (session.user.email.includes('@student.com')) {
                router.push('/studentDashboard');
            }
            else {
                router.push('/dashboard');
            }
        }
    }, [session, router, status]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        setLoading(false);

        if (result.ok) {
            if (email.includes('@teacher.com')) {
                router.push('/teacherDashboard');
            } else if (email.includes('@student.com')) {
                router.push('/studentDashboard');
            } else {
                router.push('/dashboard');
            }
        } else {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="page-container flex items-center justify-center">
            {/* Background accents */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-[var(--accent)] opacity-[0.06] blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-[hsl(280,85%,55%)] opacity-[0.04] blur-3xl" />
            </div>

            <div className="glass-card p-8 w-full max-w-md animate-slide-up relative z-10">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
                        <HiOutlineLockClosed className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">Sign in to your SMS Portal account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="alert alert-error">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="form-label">Email</label>
                        <div className="relative">
                            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                            <input
                                type="text"
                                id="email"
                                name="email"
                                className="form-input pl-10"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input pl-10"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full btn-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner spinner-sm" />
                                Signing in...
                            </>
                        ) : 'Sign In'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-[var(--accent-light)] hover:text-[var(--accent)] font-medium transition-colors">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
