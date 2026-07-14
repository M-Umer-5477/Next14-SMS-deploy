'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; 
import { HiOutlineShieldCheck, HiOutlineCheck, HiOutlineX, HiOutlineLockClosed } from 'react-icons/hi';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const { data: session, status } = useSession(); 

    useEffect(() => {
        const fetchCurrentRole = async () => {
            try {
                const res = await fetch(`/api/signup/fetchRole?email=${session.user.email}`);
                const data = await res.json();
                setCurrentRole(data.role);
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
            const res = await fetch(`/api/signup/fetchRole?email=${session.user.email}`);
            const data = await res.json();
            setCurrentRole(data.role);
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
            const res = await fetch(`/api/adminrequest`);
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            setError('Failed to fetch requests.');
        }
    };

    const handleApprove = async (email) => {
        try {
            await fetch('/api/signup', {
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
            await fetch(`/api/adminrequest/deletereq?email=${email}`, {
                method: 'DELETE',
            });
            setRequests((prevRequests) => prevRequests.filter(request => request.email !== email));
        } catch (error) {
            console.error('Failed to delete request', error);
            alert('Failed to delete request.');
        }
    };

    if (status === 'loading') {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
                    <p className="text-[var(--text-secondary)] text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="glass-card p-8 text-center max-w-sm">
                    <HiOutlineLockClosed className="w-10 h-10 mx-auto mb-3 text-[var(--text-tertiary)]" />
                    <p className="text-[var(--text-secondary)]">You need to be authenticated to view this page.</p>
                </div>
            </div>
        );
    }

    if (currentRole !== 'SuperAdmin') {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="glass-card p-8 text-center max-w-sm">
                    <HiOutlineShieldCheck className="w-10 h-10 mx-auto mb-3 text-[var(--text-tertiary)]" />
                    <p className="text-[var(--text-secondary)]">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="page-header animate-slide-up">
                    <h1 className="page-title">Admin Requests</h1>
                    <p className="page-subtitle">Review and manage admin registration requests</p>
                </div>

                {error && <div className="alert alert-error mb-6">{error}</div>}

                <div className="space-y-3 animate-fade-in">
                    {requests.length === 0 ? (
                        <div className="empty-state py-16">
                            <HiOutlineShieldCheck className="w-12 h-12 mb-3 text-[var(--text-tertiary)]" />
                            <p className="text-lg font-medium text-[var(--text-secondary)]">No pending requests</p>
                            <p className="text-sm text-[var(--text-tertiary)] mt-1">All admin requests have been processed</p>
                        </div>
                    ) : (
                        requests.map((request) => (
                            <div key={request.email} className="glass-card p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center flex-shrink-0">
                                        <span className="text-[var(--accent-light)] font-bold text-sm">{request.email?.[0]?.toUpperCase()}</span>
                                    </div>
                                    <span className="text-sm font-medium truncate">{request.email}</span>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleApprove(request.email)}
                                        className="btn btn-success btn-sm"
                                    >
                                        <HiOutlineCheck className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleDelete(request.email)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        <HiOutlineX className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminRequests;
