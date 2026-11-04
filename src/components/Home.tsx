import React from 'react';
import { ViewMode } from '../types/database';
import { Users, BookOpen, ArrowRight, UserPlus, BookPlus, Database, ShieldCheck, Sparkles } from 'lucide-react';

interface HomeProps {
  studentCount: number;
  courseCount: number;
  isLoading: boolean;
  onNavigate: (view: ViewMode) => void;
  onOpenAddStudent: () => void;
  onOpenAddCourse: () => void;
  isConfigured: boolean;
  onOpenConfig: () => void;
}

export const Home: React.FC<HomeProps> = ({
  studentCount,
  courseCount,
  isLoading,
  onNavigate,
  onOpenAddStudent,
  onOpenAddCourse,
  isConfigured,
  onOpenConfig,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl text-white p-8 md:p-10 shadow-md relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 rounded-full bg-blue-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-medium mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Database System</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Student & Course Manager
          </h1>

          <p className="mt-3 text-base md:text-lg text-blue-100 max-w-2xl leading-relaxed">
            Welcome! Manage all your student records and course offerings in one simple, organized workspace powered directly by Supabase.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('students')}
              className="px-5 py-2.5 rounded-lg bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 shadow-sm transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Manage Students
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => onNavigate('courses')}
              className="px-5 py-2.5 rounded-lg bg-blue-800/80 hover:bg-blue-800 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Manage Courses
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Connection Banner if needed */}
      {!isConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg flex-shrink-0 mt-0.5">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">Supabase Connection Required</h3>
              <p className="text-xs text-amber-700 mt-0.5">
                To save and view real student and course records, enter your Supabase Project URL and Anon Key.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenConfig}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex-shrink-0"
          >
            Connect Supabase Now
          </button>
        </div>
      )}

      {/* Two Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Students Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Students
              </span>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-4xl font-extrabold text-gray-900">
                {isLoading ? (
                  <span className="inline-block w-12 h-9 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  studentCount
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Active students registered in the database
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              <span>View all students</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Total Courses Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Courses
              </span>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-4xl font-extrabold text-gray-900">
                {isLoading ? (
                  <span className="inline-block w-12 h-9 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  courseCount
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Available courses created in the catalog
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              <span>View all courses</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenAddCourse}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <BookPlus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Main Navigation Options Details */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Main Navigation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Manage Students */}
          <div
            onClick={() => onNavigate('students')}
            className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Manage Students
                </h3>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Add new students, search registered students by name, update their class or email, and remove records when needed.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-blue-600">
                <span>Open Student Directory</span>
              </div>
            </div>
          </div>

          {/* Option 2: Manage Courses */}
          <div
            onClick={() => onNavigate('courses')}
            className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Manage Courses
                </h3>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Create new course titles, write descriptions, update existing syllabus descriptions, and remove discontinued courses.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-blue-600">
                <span>Open Course Catalog</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Schema Reference (Simple & Clear) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Database Schema (Only Two Tables)</h3>
          </div>
          <button
            onClick={onOpenConfig}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View SQL Setup
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
            <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Table 1: students</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-gray-600">
              <li><code className="text-[11px] font-mono text-gray-800">id</code> — Student ID</li>
              <li><code className="text-[11px] font-mono text-gray-800">full_name</code> — Full Name</li>
              <li><code className="text-[11px] font-mono text-gray-800">email</code> — Email Address</li>
              <li><code className="text-[11px] font-mono text-gray-800">class_name</code> — Class Name</li>
              <li><code className="text-[11px] font-mono text-gray-800">registration_date</code> — Registration Date</li>
            </ul>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
            <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Table 2: courses</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-gray-600">
              <li><code className="text-[11px] font-mono text-gray-800">id</code> — Course ID</li>
              <li><code className="text-[11px] font-mono text-gray-800">course_name</code> — Course Name</li>
              <li><code className="text-[11px] font-mono text-gray-800">course_description</code> — Course Description</li>
              <li><code className="text-[11px] font-mono text-gray-800">creation_date</code> — Creation Date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
