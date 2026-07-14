'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { signOut, useSession } from 'next-auth/react';

const Navbarr = () => {
    const { data: session, status } = useSession();
    const [navIsVisible, setNavIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(status === 'loading');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (status !== 'loading') {
            setIsLoading(false);
        }
    }, [status]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navVisibilityHandler = () => {
        setNavIsVisible((curState) => !curState);
    };

    const NavLink = ({ href, children, onClick }) => (
        <Link
            href={href}
            onClick={onClick}
            className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium text-sm transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-[var(--bg-card-hover)] lg:hover:bg-transparent lg:after:content-[''] lg:after:absolute lg:after:bottom-0 lg:after:left-1/2 lg:after:-translate-x-1/2 lg:after:w-0 lg:after:h-[2px] lg:after:bg-[var(--accent)] lg:after:transition-all lg:after:duration-300 lg:hover:after:w-full"
        >
            {children}
        </Link>
    );

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--bg-card)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-lg' : 'bg-transparent border-b border-transparent'}`}>
            <div className="container mx-auto px-5 flex justify-between items-center py-3">
                <div className="flex-shrink-0">
                    <Link href='/' className='font-bold text-lg sm:text-xl tracking-tight transition-all duration-300'>
                        <span className="gradient-text">SMS</span>
                        <span className="text-[var(--text-secondary)] ml-1.5 font-normal hidden sm:inline">Portal</span>
                    </Link>
                </div>
                <div className="lg:hidden z-50">
                    <button onClick={navVisibilityHandler} className="p-2 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors duration-200 text-[var(--text-secondary)]">
                        {navIsVisible ? (
                            <AiOutlineClose className="w-5 h-5" />
                        ) : (
                            <AiOutlineMenu className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Mobile Overlay */}
                {navIsVisible && (
                    <div className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-30 lg:hidden" onClick={navVisibilityHandler} />
                )}

                <nav className={`${navIsVisible ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out fixed top-0 right-0 bottom-0 w-72 bg-[var(--bg-card)] border-l border-[var(--border-subtle)] z-40 lg:translate-x-0 lg:static lg:w-auto lg:bg-transparent lg:border-none flex flex-col lg:flex-row justify-start lg:justify-end items-stretch lg:items-center pt-16 lg:pt-0 px-4 lg:px-0`}>
                    <ul className='flex flex-col lg:flex-row gap-1 lg:gap-0.5 items-stretch lg:items-center'>
                        {isLoading ? (
                            <li className='px-3 py-2'>
                                <div className="skeleton h-4 w-20 rounded" />
                            </li>
                        ) : (
                            <>
                                <li>
                                    <NavLink href='/dashboard' onClick={() => setNavIsVisible(false)}>Home</NavLink>
                                </li>
                                {session?.user && !session.user.email.includes('@student.com') && !session.user.email.includes('@teacher.com') && (
                                    <>
                                        <li><NavLink href='/createcourse' onClick={() => setNavIsVisible(false)}>Create Course</NavLink></li>
                                        <li><NavLink href='/addstudent' onClick={() => setNavIsVisible(false)}>Add Student</NavLink></li>
                                        <li><NavLink href='/addteacher' onClick={() => setNavIsVisible(false)}>Add Teacher</NavLink></li>
                                        <li><NavLink href='/weeklytimetable' onClick={() => setNavIsVisible(false)}>Timetable</NavLink></li>
                                        <li><NavLink href='/adminrequests' onClick={() => setNavIsVisible(false)}>Requests</NavLink></li>
                                    </>
                                )}
                                {session?.user && session.user.email.includes('@teacher.com') && (
                                    <>
                                        <li><NavLink href='/teacherDashboard' onClick={() => setNavIsVisible(false)}>My Courses</NavLink></li>
                                        <li><NavLink href='/teacherDashboard' onClick={() => setNavIsVisible(false)}>Attendance</NavLink></li>
                                    </>
                                )}
                                {session?.user && session.user.email.includes('@student.com') && (
                                    <>
                                        <li><NavLink href='/studentDashboard' onClick={() => setNavIsVisible(false)}>My Courses</NavLink></li>
                                        <li><NavLink href='/studentDashboard' onClick={() => setNavIsVisible(false)}>My Attendance</NavLink></li>
                                    </>
                                )}
                                <li className="lg:ml-2 mt-2 lg:mt-0">
                                    {session?.user ? (
                                        <button
                                            onClick={() => signOut()}
                                            className='btn btn-outline btn-sm w-full lg:w-auto'
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <div className="flex flex-col lg:flex-row gap-2">
                                            <Link href='/login' onClick={() => setNavIsVisible(false)} className='btn btn-ghost btn-sm'>
                                                Login
                                            </Link>
                                            <Link href='/signup' onClick={() => setNavIsVisible(false)} className='btn btn-primary btn-sm'>
                                                Register
                                            </Link>
                                        </div>
                                    )}
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbarr;
