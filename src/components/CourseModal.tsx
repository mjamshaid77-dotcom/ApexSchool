import React, { useState, useEffect } from 'react';
import { X, BookPlus, Save, AlertCircle } from 'lucide-react';
import { Course } from '../types/database';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: { course_name: string; course_description: string }) => Promise<boolean>;
  courseToEdit?: Course | null;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courseToEdit,
}) => {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (courseToEdit) {
      setCourseName(courseToEdit.course_name || '');
      setCourseDescription(courseToEdit.course_description || '');
    } else {
      setCourseName('');
      setCourseDescription('');
    }
    setError(null);
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = courseName.trim();
    const trimmedDesc = courseDescription.trim();

    if (!trimmedName) {
      setError('Please enter the course name.');
      return;
    }

    setSubmitting(true);
    try {
      const success = await onSubmit({
        course_name: trimmedName,
        course_description: trimmedDesc,
      });

      if (success) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isEditMode = Boolean(courseToEdit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isEditMode ? 'Edit Course Information' : 'Add New Course'}
              </h3>
              <p className="text-xs text-gray-500">
                {isEditMode
                  ? 'Update course details in the Supabase database'
                  : 'Enter the details of the course you want to offer'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. Introduction to Computer Science"
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Course Description
              </label>
              <textarea
                rows={4}
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Briefly describe what this course covers, prerequisites, or objectives..."
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : isEditMode ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
