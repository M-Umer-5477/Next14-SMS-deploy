'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { signOut, useSession } from 'next-auth/react';

const Navbarr = () => {
    const { data: session, status } = useSession();
    const [navIsVisible, setNavIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(status === 'loading');

    useEffect(() => {
        // When session status changes, update loading state
        if (status !== 'loading') {
            setIsLoading(false);
        }
    }, [status]);

    const navVisibilityHandler = () => {
        setNavIsVisible((curState) => !curState);
    };

    return (
        <header className='container mx-auto px-5 flex justify-between items-center py-4 z-50'>
            <div className="flex-shrink-0">
                <Link href='/' className='text-primary text-xl sm:text-2xl md:text-3xl font-bold hover:bg-gray-950 p-2 rounded-md hover:text-white transition-all duration-300 whitespace-nowrap'>
                    Student Management System
                </Link>
            </div>
            <div className="lg:hidden z-50">
                {navIsVisible ? (
                    <AiOutlineClose className="w-6 h-6 cursor-pointer" onClick={navVisibilityHandler} />
                ) : (
                    <AiOutlineMenu className="w-6 h-6 cursor-pointer" onClick={navVisibilityHandler} />
                )}
            </div>

            <nav className={`${navIsVisible ? 'right-0' : '-right-full'} transition-all duration-300 fixed top-0 bottom-0 bg-primary lg:bg-transparent w-full lg:static flex flex-col lg:flex-row justify-center lg:justify-end items-center`}>
                <ul className='gap-y-5 items-center flex gap-x-5 flex-col lg:flex-row font-semibold'>
                    {isLoading ? (
                        <li className='text-orange-300 text-lg sm:text-xl font-bold'>Loading...</li>
                    ) : (
                        <>
                            <li>
                                <Link href='/dashboard' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                    <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Home</span>
                                </Link>
                            </li>
                            {session?.user && !session.user.email.includes('@student.com') && !session.user.email.includes('@teacher.com') && (
                                <>
                                    <li>
                                        <Link href='/createcourse' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Create Course</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='/addstudent' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Add Student</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='/addteacher' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Add Teacher</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='/weeklytimetable' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Create TimeTable</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='/adminrequests' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Admin Requests</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                            {session?.user && session.user.email.includes('@teacher.com') && (
                                <>
                                    <li>
                                        <Link href='/teachercourses' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>My Courses</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='/markattendance' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Mark Attendance</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                            {session?.user && session.user.email.includes('@student.com') && (
                                <>
                                    <li>
                                        <Link href='/mycourses' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>My Courses</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='/myattendance' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>My Attendance</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                            {session?.user ? (
                                <li>
                                    <button
                                        onClick={() => signOut()}
                                        className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white w-full text-left hover:bg-orange-700 p-2 rounded-md transition-all duration-300'
                                    >
                                        Logout
                                    </button>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <Link href='/login' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Login</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='/signup' className='hover:bg-orange-700 p-2 rounded-md transition-all duration-300'>
                                            <span className='text-orange-300 text-lg sm:text-xl font-bold hover:text-white'>Register</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbarr;
