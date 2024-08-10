'use client';
import React, { useState } from 'react';

const ProfileCard = ({ user }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const isStudent = user.email.includes('@student.com');
    const isTeacher = user.email.includes('@teacher.com');

    return (
        <div className="relative bg-white shadow-lg rounded-lg p-4 max-w-sm mx-auto">
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
                <img
                    src={user.profilePicture || ''}
                    alt="Profile Picture"
                    className="w-16 h-16 rounded-full border-2 border-gray-200"
                />
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{`${user.FirstName} ${user.LastName}`}</h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>

            {/* Details Button */}
            <button
                onClick={handleToggle}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
                {isExpanded ? 'Hide Details' : 'Show Details'}
            </button>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="mt-4 border-t pt-4 text-gray-700">
                    {isStudent && (
                        <>
                            <p><strong>Student ID:</strong> {user.StudentID}</p>
                            <p><strong>Date of Birth:</strong> {user.DateOfBirth}</p>
                            <p><strong>Gender:</strong> {user.Gender}</p>
                            <p><strong>Contact Info:</strong> {user.ContactInfo}</p>
                            <p><strong>Address:</strong> {user.Address}</p>
                            <p><strong>Personal Email:</strong> {user.PersonalEmail}</p>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Courses:</h3>
                                {user.Courses.length > 0 ? (
                                    <ul className="list-disc ml-6">
                                        {user.Courses.map((course) => (
                                            <li key={course}>ID: {course}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No courses assigned.</p>
                                )}
                            </div>
                        </>
                    )}
                    {isTeacher && (
                        <>
                            <p><strong>Teacher ID:</strong> {user.TeacherID}</p>
                            <p><strong>Department:</strong> {user.Department}</p>
                            <p><strong>Personal Email:</strong> {user.PersonalEmail}</p>
                            {/* Display Courses */}
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Courses:</h3>
                                {user.Courses.length > 0 ? (
                                    <ul className="list-disc ml-6">
                                        {user.Courses.map((course) => (
                                            <li key={course}>ID: {course}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No courses assigned.</p>
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
