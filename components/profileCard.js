'use client';

import React, { useState } from 'react';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';

const ProfileCard = ({ user }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const isStudent = user.email.includes('@student.com');
    const isTeacher = user.email.includes('@teacher.com');

    return (
        <div className="glass-card p-6 max-w-md mx-auto">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
                {user.ProfilePicture ? (
                    <img
                        src={user.ProfilePicture}
                        alt="Profile Picture"
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-[var(--border-accent)]"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-xl bg-accent-gradient flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">{user.FirstName?.[0]}{user.LastName?.[0]}</span>
                    </div>
                )}
                <div className="min-w-0">
                    <h2 className="text-lg font-semibold truncate">{`${user.FirstName} ${user.LastName}`}</h2>
                    <p className="text-sm text-[var(--text-secondary)] truncate">{user.email}</p>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={handleToggle}
                className="btn btn-ghost btn-sm w-full mt-4 text-[var(--text-secondary)]"
            >
                {isExpanded ? (
                    <><HiOutlineChevronUp className="w-4 h-4" /> Hide Details</>
                ) : (
                    <><HiOutlineChevronDown className="w-4 h-4" /> Show Details</>
                )}
            </button>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] animate-slide-down space-y-4">
                    {isStudent && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Student ID', value: user.StudentID },
                                    { label: 'Date of Birth', value: user.DateOfBirth },
                                    { label: 'Gender', value: user.Gender },
                                    { label: 'Contact', value: user.ContactInfo },
                                ].map((item, i) => (
                                    <div key={i} className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                                        <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-0.5">{item.label}</div>
                                        <div className="text-sm font-medium truncate">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                                <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-0.5">Address</div>
                                <div className="text-sm font-medium">{user.Address}</div>
                            </div>
                            <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                                <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-0.5">Personal Email</div>
                                <div className="text-sm font-medium">{user.PersonalEmail}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Courses</div>
                                {user.Courses.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.Courses.map((course) => (
                                            <span key={course} className="badge badge-info">{course}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-[var(--text-tertiary)]">No courses assigned.</p>
                                )}
                            </div>
                        </>
                    )}
                    {isTeacher && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Teacher ID', value: user.TeacherID },
                                    { label: 'Department', value: user.Department },
                                ].map((item, i) => (
                                    <div key={i} className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                                        <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-0.5">{item.label}</div>
                                        <div className="text-sm font-medium">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                                <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-0.5">Personal Email</div>
                                <div className="text-sm font-medium">{user.PersonalEmail}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Courses</div>
                                {user.Courses.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.Courses.map((course) => (
                                            <span key={course} className="badge badge-info">{course}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-[var(--text-tertiary)]">No courses assigned.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
