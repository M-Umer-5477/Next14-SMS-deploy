/*'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; 
const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const { data: session, status } = useSession(); 
    if(session?.user){
        return;
    }
    const fetchCurrentRole = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/signup/fetchRole?email=${session.user.email}`);
            const data = await res.json();
            setCurrrentRole(data);

        } catch (error) {
            console.error('Failed to fetch role', error);
            setError('Failed to fetch role.');
        }
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/adminrequest`);
                const data = await res.json();
                setRequests(data);
            } catch (error) {
                console.error('Failed to fetch requests', error);
                setError('Failed to fetch requests.');
            }
        };
        const fetchCurrentRole = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/signup?email=${session.user.email}`);
                const data = await res.json();
                setCurrrentRole(data);
            } catch (error) {
                console.error('Failed to fetch requests', error);
                setError('Failed to fetch requests.');
            }
        };
        fetchCurrentRole()
        if(currentRole=='SuperAdmin'){
            fetchRequests();
        }
    }, []);

    const handleApprove = async (email) => {
        try {
            await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            setRequests((prevRequests) => prevRequests.filter(request => request.email !== email));
        } catch (error) {
            console.error('Failed to approve admin', error);
            alert('Failed to approve admin.');
        }
    };

    const handleDelete = async (email) => {
        try {
            await fetch(`http://localhost:3000/api/adminrequest/deletereq?email=${email}`, {
                method: 'DELETE',
            });
            setRequests((prevRequests) => prevRequests.filter(request => request.email !== email));
        } catch (error) {
            console.error('Failed to delete request', error);
            alert('Failed to delete request.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Requests</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="bg-white shadow-md rounded-lg p-6">
                <ul className="space-y-4">
                    {requests.map((request) => (
                        <li key={request.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow">
                            <span className="text-gray-700">{request.email}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleApprove(request.email)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDelete(request.email)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminRequests;
*/

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; 

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const { data: session, status } = useSession(); 

    useEffect(() => {
        const fetchCurrentRole = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/signup/fetchRole?email=${session.user.email}`);
                const data = await res.json();
                setCurrentRole(data.role); // Assuming data contains a field 'role'
            } catch (error) {
                console.error('Failed to fetch role', error);
                setError('Failed to fetch role.');
            }
        };
        if (status === 'loading') return;   
        if (session?.user) {
            fetchCurrentRole();
        }
    }, [session, status ]);

    const fetchCurrentRole = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/signup/fetchRole?email=${session.user.email}`);
            const data = await res.json();
            setCurrentRole(data.role); // Assuming data contains a field 'role'
        } catch (error) {
            console.error('Failed to fetch role', error);
            setError('Failed to fetch role.');
        }
    };

    useEffect(() => {
        if (currentRole === 'SuperAdmin') {
            fetchRequests();
        }
    }, [currentRole]);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/adminrequest`);
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            setError('Failed to fetch requests.');
        }
    };

    const handleApprove = async (email) => {
        try {
            await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            setRequests((prevRequests) => prevRequests.filter(request => request.email !== email));
        } catch (error) {
            console.error('Failed to approve admin', error);
            alert('Failed to approve admin.');
        }
    };

    const handleDelete = async (email) => {
        try {
            await fetch(`http://localhost:3000/api/adminrequest/deletereq?email=${email}`, {
                method: 'DELETE',
            });
            setRequests((prevRequests) => prevRequests.filter(request => request.email !== email));
        } catch (error) {
            console.error('Failed to delete request', error);
            alert('Failed to delete request.');
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return <div>You need to be authenticated to view this page.</div>;
    }

    if (currentRole !== 'SuperAdmin') {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Requests</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="bg-white shadow-md rounded-lg p-6">
                <ul className="space-y-4">
                    {requests.map((request) => (
                        <li key={request.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow">
                            <span className="text-gray-700">{request.email}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleApprove(request.email)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDelete(request.email)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminRequests;
