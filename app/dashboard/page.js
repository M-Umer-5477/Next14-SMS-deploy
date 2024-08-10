/* 'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  

  useEffect(() => {
    if(!session){
      router.push("/login")
    }
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/createcourse', {
            method: 'GET'
          });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setCourses(data);
        } else {
          console.error('Error fetching courses:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Courses Dashboard</h2>
      {courses.length === 0 ? (
        <p className="text-center">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
            >
              <img src="course.jpeg" alt={course.CourseName} className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">{course.Department}</div>
                <Link href={`/dashboard/${course._id}`} className="font-bold text-lg mb-2">{course.CourseName}</Link>
                <div className="text-sm text-gray-700 mb-2">{course.CourseDescription}</div>
                <div className="text-sm text-gray-600">Credits: {course.Credits}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};

export default Dashboard; */
/*'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      fetchCourses(currentPage);
    }
  }, [session, currentPage]);

  const fetchCourses = async (page) => {
    try {
      const response = await fetch(`http://localhost:3000/api/createcourse?page=${page}&limit=4`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        console.error('Error fetching courses:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Courses Dashboard</h2>
        {courses.length === 0 ? (
          <p className="text-center">No courses available.</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
                >
                  <img src="course.jpeg" alt={course.CourseName} className="w-full h-32 object-cover rounded-t-lg" />
                  <div className="p-4">
                    <div className="text-sm text-gray-600 mb-1">{course.Department}</div>
                    <Link href={`/dashboard/${course._id}`} className="font-bold text-lg mb-2">{course.CourseName}</Link>
                    <div className="text-sm text-gray-700 mb-2">{course.CourseDescription}</div>
                    <div className="text-sm text-gray-600">Credits: {course.Credits}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
            <p className="text-center mt-4">Page {currentPage} of {totalPages}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;*/
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.email.includes('@teacher.com') || session.user?.email.includes('@student.com')) {
      router.push("/login");
    } else {
      fetchCourses(currentPage, searchQuery);
    }
  }, [session, currentPage, searchQuery]);

  const fetchCourses = async (page, query) => {
    try {
      const response = await fetch(`http://localhost:3000/api/createcourse?page=${page}&limit=6&query=${query}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        console.error('Error fetching courses:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <div className=" bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full mt-7 max-w-5xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Courses Dashboard</h2>
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search courses by name or department"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        {courses.length === 0 ? (
          <p className="text-center">No courses available.</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
                >
                  <img src="course.jpeg" alt={course.CourseName} className="w-full h-32 object-cover rounded-t-lg" />
                  <div className="p-4">
                    <div className="text-sm text-gray-600 mb-1">{course.Department}</div>
                    <Link href={`/dashboard/${course._id}`} className="font-bold text-lg mb-2">{course.CourseName}</Link>
                    <div className="text-sm text-gray-700 mb-2">{course.CourseDescription}</div>
                    
                    <div className="text-sm text-gray-600">Credits: {course.Credits}</div>
                    
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
            <p className="text-center mt-4">Page {currentPage} of {totalPages}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


