'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HiOutlineSearch, HiOutlineBookOpen } from 'react-icons/hi';

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
  }, [session, status, router, currentPage, searchQuery]);

  const fetchCourses = async (page, query) => {
    try {
      const response = await fetch(`/api/createcourse?page=${page}&limit=6&query=${query}`, {
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
    setCurrentPage(1);
  };

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="page-header animate-slide-up">
          <h1 className="page-title">Courses Dashboard</h1>
          <p className="page-subtitle">Manage and browse all courses</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8 animate-fade-in">
          <div className="relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search courses by name or department..."
              className="form-input pl-12 py-3 text-base"
            />
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state py-20 animate-fade-in">
            <HiOutlineBookOpen className="w-12 h-12 mb-3 text-[var(--text-tertiary)]" />
            <p className="text-lg font-medium text-[var(--text-secondary)]">No courses available</p>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">Create a new course to get started</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  href={`/dashboard/${course._id}`}
                  key={course._id}
                  className="glass-card glass-card-hover overflow-hidden group block"
                >
                  <div className="h-1.5 bg-accent-gradient" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className="badge badge-info">{course.Department}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">{course.Credits} credits</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--accent-light)] transition-colors">
                      {course.CourseName}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {course.CourseDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span className="text-sm text-[var(--text-secondary)]">
                Page <span className="font-semibold text-[var(--text-primary)]">{currentPage}</span> of {totalPages}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
