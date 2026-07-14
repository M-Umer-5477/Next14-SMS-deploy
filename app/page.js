import React from 'react'
import Link from 'next/link'
import { HiAcademicCap, HiClipboardCheck, HiCalendar } from 'react-icons/hi'

const page = () => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background gradient shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--accent)] opacity-[0.07] blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[hsl(280,85%,55%)] opacity-[0.05] blur-3xl" />
        </div>

        <div className="container mx-auto px-5 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-glow)] border border-[var(--border-accent)] text-[var(--accent-light)] text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              Student Management System
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Manage Your Campus{' '}
              <span className="gradient-text">Effortlessly</span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              A modern platform for managing students, courses, attendance, and timetables — all in one place. Built for administrators, teachers, and students.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="btn btn-primary btn-lg w-full sm:w-auto">
                Get Started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link href="/signup" className="btn btn-outline btn-lg w-full sm:w-auto">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-5">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Everything You Need
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              Powerful tools to streamline your educational institution&apos;s management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <HiAcademicCap className="w-8 h-8" />,
                title: 'Course Management',
                description: 'Create, edit, and organize courses. Assign teachers and enroll students with ease.',
                color: 'var(--accent)',
              },
              {
                icon: <HiClipboardCheck className="w-8 h-8" />,
                title: 'Attendance Tracking',
                description: 'Mark and monitor attendance in real-time. View detailed records by course and student.',
                color: 'var(--success)',
              },
              {
                icon: <HiCalendar className="w-8 h-8" />,
                title: 'Timetable Scheduling',
                description: 'Build weekly timetables and generate session schedules automatically.',
                color: 'var(--warning)',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card glass-card-hover p-6 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${feature.color}20`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="glass-card p-10 text-center max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Join your institution&apos;s portal and start managing your academic activities today.
              </p>
              <Link href="/login" className="btn btn-primary">
                Login to Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default page