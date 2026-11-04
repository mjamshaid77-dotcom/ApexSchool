import React, { useState } from 'react';
import { Student } from '../types/database';
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  AlertCircle,
  Database,
  Calendar,
  Mail,
  GraduationCap,
} from 'lucide-react';

interface StudentsManagerProps {
  students: Student[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  isConfigured: boolean;
  onOpenConfig: () => void;
}

export const StudentsManager: React.FC<StudentsManagerProps> = ({
  students,
  isLoading,
  onRefresh,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  isConfigured,
  onOpenConfig,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students by name (case-insensitive)
  const filteredStudents = students.filter((student) =>
    student.full_name?.toLowerCase().includes(searchQuery.toLowerCase().trim())
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
              Manage Students
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {students.length} {students.length === 1 ? 'Student' : 'Students'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            View, search, add, edit, and delete student records directly from Supabase.
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
            onClick={onAddStudent}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Connection notice if not configured */}
      {!isConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              Supabase credentials not detected yet. Enter your project URL and key to save and load live records.
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
            placeholder="Search student by name..."
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

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading && students.length === 0 ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">Loading student records...</p>
            <p className="text-xs text-gray-400 mt-1">Connecting to Supabase</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-base font-bold text-gray-900">No students found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  No registered student names match &quot;{searchQuery}&quot;. Try clearing the search filter.
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
                <h3 className="text-base font-bold text-gray-900">No students registered yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Get started by adding your first student to the database.
                </p>
                <button
                  onClick={onAddStudent}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Add First Student
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
                    Student ID
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Email Address
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Class Name
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Registration Date
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right w-36">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    {/* Student ID */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-gray-500">
                      #{student.id}
                    </td>

                    {/* Full Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                          {student.full_name?.charAt(0) || 'S'}
                        </div>
                        <span className="font-semibold text-gray-900">
                          {student.full_name}
                        </span>
                      </div>
                    </td>

                    {/* Email Address */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-xs">{student.email}</span>
                      </div>
                    </td>

                    {/* Class Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                        {student.class_name}
                      </span>
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{formatDate(student.registration_date)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditStudent(student)}
                          className="px-2.5 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md font-semibold transition-colors inline-flex items-center gap-1"
                          title="Edit student"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student)}
                          className="px-2.5 py-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-md font-semibold transition-colors inline-flex items-center gap-1"
                          title="Delete student"
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
