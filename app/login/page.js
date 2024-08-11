'use client'
import { useState ,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { data: session ,status } = useSession();
    useEffect(() => {
        if (status === 'loading') return;
        if (session) {
            if(session.user.email.includes( '@teacher.com')){
                router.push('/teacherDashboard');
            }
            else if(session.user.email.includes( '@student.com')){
                router.push('/studentDashboard');
            }
            else{
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
                router.push('/teacherDashboard'); // Redirect to teacher dashboard
            }else if (email.includes('@student.com')) {
                router.push('/studentDashboard'); // Redirect to teacher dashboard
            } else {
                router.push('/dashboard'); // Redirect to admin/dashboard
            }
        } else {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Student Management System</h1>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                            Email:
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
    Don&apos;t have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up here</Link>
</p>
            </div>
        </div>
    );
};

export default Login;

