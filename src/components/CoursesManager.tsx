import React, { useState } from 'react';
import { Course } from '../types/database';
import {
  BookOpen,
  BookPlus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Database,
  Calendar,
  FileText,
} from 'lucide-react';

interface CoursesManagerProps {
  courses: Course[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
  isConfigured: boolean;
  onOpenConfig: () => void;
}

export const CoursesManager: React.FC<CoursesManagerProps> = ({
  courses,
  isLoading,
  onRefresh,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  isConfigured,
  onOpenConfig,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter courses by course name or description
  const filteredCourses = courses.filter((course) =>
    course.course_name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    course.course_description?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Manage Courses
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            View, add, edit, and delete course catalog items directly in Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <button
            onClick={onAddCourse}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
          >
            <BookPlus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Connection notice if not configured */}
      {!isConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              Supabase credentials not configured yet. Connect your database to save and load courses live.
            </span>
          </div>
          <button
            onClick={onOpenConfig}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-semibold flex-shrink-0 transition-colors"
          >
            Connect Supabase
          </button>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by name or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading && courses.length === 0 ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">Loading courses...</p>
            <p className="text-xs text-gray-400 mt-1">Connecting to Supabase</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-base font-bold text-gray-900">No courses match your search</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  No courses found matching &quot;{searchQuery}&quot;. Try a different search term.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Clear Search Filter
                </button>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-gray-900">No courses created yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Get started by adding your first course to the curriculum.
                </p>
                <button
                  onClick={onAddCourse}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <BookPlus className="w-3.5 h-3.5" />
                  Add First Course
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3.5 w-24">
                    Course ID
                  </th>
                  <th scope="col" className="px-6 py-3.5 w-1/4">
                    Course Name
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Course Description
                  </th>
                  <th scope="col" className="px-6 py-3.5 w-36">
                    Creation Date
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right w-36">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    {/* Course ID */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-gray-500">
                      #{course.id}
                    </td>

                    {/* Course Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-gray-900 leading-snug">
                          {course.course_name}
                        </span>
                      </div>
                    </td>

                    {/* Course Description */}
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-start gap-1.5 max-w-xl">
                        <FileText className="w-3.5 h-3.5 text-gray-400 mt-1 flex-shrink-0" />
                        <span className="line-clamp-2 text-xs leading-relaxed">
                          {course.course_description || (
                            <span className="text-gray-400 italic">No description provided</span>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Creation Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{formatDate(course.creation_date)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditCourse(course)}
                          className="px-2.5 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md font-semibold transition-colors inline-flex items-center gap-1"
                          title="Edit course"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteCourse(course)}
                          className="px-2.5 py-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-md font-semibold transition-colors inline-flex items-center gap-1"
                          title="Delete course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
