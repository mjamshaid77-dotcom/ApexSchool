import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, Student, Course, ToastMessage } from './types/database';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { StudentsManager } from './components/StudentsManager';
import { CoursesManager } from './components/CoursesManager';
import { StudentModal } from './components/StudentModal';
import { CourseModal } from './components/CourseModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { ToastContainer } from './components/Toast';
import { getSupabaseClient, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isConfigured, setIsConfigured] = useState<boolean>(() => isSupabaseConfigured());
  const [configModalOpen, setConfigModalOpen] = useState(false);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  // Student modal states
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  // Course modal states
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  // Delete modal states
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'student' | 'course';
    item: Student | Course | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    type: 'student',
    item: null,
    isDeleting: false,
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Students from Supabase
  const fetchStudents = useCallback(async (showToastOnError = false) => {
    const client = getSupabaseClient();
    if (!client) {
      setStudents([]);
      return;
    }

    setIsLoadingStudents(true);
    try {
      const { data, error } = await client
        .from('students')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }

      setStudents(data || []);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      if (showToastOnError) {
        addToast(
          'error',
          'Failed to load students',
          err.message || 'Could not query the students table.'
        );
      }
    } finally {
      setIsLoadingStudents(false);
    }
  }, [addToast]);

  // Fetch Courses from Supabase
  const fetchCourses = useCallback(async (showToastOnError = false) => {
    const client = getSupabaseClient();
    if (!client) {
      setCourses([]);
      return;
    }

    setIsLoadingCourses(true);
    try {
      const { data, error } = await client
        .from('courses')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }

      setCourses(data || []);
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      if (showToastOnError) {
        addToast(
          'error',
          'Failed to load courses',
          err.message || 'Could not query the courses table.'
        );
      }
    } finally {
      setIsLoadingCourses(false);
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (configured) {
      fetchStudents(false);
      fetchCourses(false);
    }
  }, [fetchStudents, fetchCourses]);

  // Handle configuration update
  const handleCredentialsUpdated = () => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);
    if (configured) {
      addToast('success', 'Supabase credentials updated', 'Fetching latest records...');
      fetchStudents(true);
      fetchCourses(true);
    }
  };

  // Student Actions
  const handleOpenAddStudent = () => {
    if (!isConfigured) {
      setConfigModalOpen(true);
      addToast('info', 'Supabase Setup Required', 'Please connect Supabase first to save student records.');
      return;
    }
    setStudentToEdit(null);
    setStudentModalOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setStudentModalOpen(true);
  };

  const handleSaveStudent = async (studentData: {
    full_name: string;
    email: string;
    class_name: string;
  }): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      setConfigModalOpen(true);
      addToast('error', 'Supabase not connected', 'Please configure your Supabase credentials.');
      return false;
    }

    try {
      if (studentToEdit) {
        // Edit existing student
        const { error } = await client
          .from('students')
          .update({
            full_name: studentData.full_name,
            email: studentData.email,
            class_name: studentData.class_name,
          })
          .eq('id', studentToEdit.id);

        if (error) throw error;
        addToast('success', 'Student updated successfully', `${studentData.full_name} has been updated.`);
      } else {
        // Add new student
        const { error } = await client.from('students').insert([
          {
            full_name: studentData.full_name,
            email: studentData.email,
            class_name: studentData.class_name,
          },
        ]);

        if (error) throw error;
        addToast('success', 'Student added successfully', `${studentData.full_name} is now registered.`);
      }

      await fetchStudents(true);
      return true;
    } catch (err: any) {
      console.error('Error saving student:', err);
      addToast('error', 'Failed to save student', err.message || 'An unexpected error occurred.');
      return false;
    }
  };

  const handleOpenDeleteStudent = (student: Student) => {
    setDeleteModalState({
      isOpen: true,
      type: 'student',
      item: student,
      isDeleting: false,
    });
  };

  // Course Actions
  const handleOpenAddCourse = () => {
    if (!isConfigured) {
      setConfigModalOpen(true);
      addToast('info', 'Supabase Setup Required', 'Please connect Supabase first to create courses.');
      return;
    }
    setCourseToEdit(null);
    setCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setCourseToEdit(course);
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async (courseData: {
    course_name: string;
    course_description: string;
  }): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      setConfigModalOpen(true);
      addToast('error', 'Supabase not connected', 'Please configure your Supabase credentials.');
      return false;
    }

    try {
      if (courseToEdit) {
        // Edit existing course
        const { error } = await client
          .from('courses')
          .update({
            course_name: courseData.course_name,
            course_description: courseData.course_description,
          })
          .eq('id', courseToEdit.id);

        if (error) throw error;
        addToast('success', 'Course updated successfully', `"${courseData.course_name}" was updated.`);
      } else {
        // Add new course
        const { error } = await client.from('courses').insert([
          {
            course_name: courseData.course_name,
            course_description: courseData.course_description,
          },
        ]);

        if (error) throw error;
        addToast('success', 'Course added successfully', `"${courseData.course_name}" has been created.`);
      }

      await fetchCourses(true);
      return true;
    } catch (err: any) {
      console.error('Error saving course:', err);
      addToast('error', 'Failed to save course', err.message || 'An unexpected error occurred.');
      return false;
    }
  };

  const handleOpenDeleteCourse = (course: Course) => {
    setDeleteModalState({
      isOpen: true,
      type: 'course',
      item: course,
      isDeleting: false,
    });
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    const { item, type } = deleteModalState;
    if (!item) return;

    const client = getSupabaseClient();
    if (!client) {
      addToast('error', 'Supabase not connected', 'Please configure Supabase first.');
      return;
    }

    setDeleteModalState((prev) => ({ ...prev, isDeleting: true }));

    try {
      if (type === 'student') {
        const student = item as Student;
        const { error } = await client.from('students').delete().eq('id', student.id);
        if (error) throw error;

        addToast('success', 'Student deleted', `${student.full_name} was removed from the database.`);
        await fetchStudents(true);
      } else {
        const course = item as Course;
        const { error } = await client.from('courses').delete().eq('id', course.id);
        if (error) throw error;

        addToast('success', 'Course deleted', `"${course.course_name}" was removed from the catalog.`);
        await fetchCourses(true);
      }

      setDeleteModalState({ isOpen: false, type: 'student', item: null, isDeleting: false });
    } catch (err: any) {
      console.error('Error deleting item:', err);
      addToast('error', 'Failed to delete record', err.message || 'An unexpected error occurred.');
      setDeleteModalState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        isConfigured={isConfigured}
        onOpenConfig={() => setConfigModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentView === 'home' && (
          <Home
            studentCount={students.length}
            courseCount={courses.length}
            isLoading={isLoadingStudents || isLoadingCourses}
            onNavigate={(view) => setCurrentView(view)}
            onOpenAddStudent={handleOpenAddStudent}
            onOpenAddCourse={handleOpenAddCourse}
            isConfigured={isConfigured}
            onOpenConfig={() => setConfigModalOpen(true)}
          />
        )}

        {currentView === 'students' && (
          <StudentsManager
            students={students}
            isLoading={isLoadingStudents}
            onRefresh={() => fetchStudents(true)}
            onAddStudent={handleOpenAddStudent}
            onEditStudent={handleOpenEditStudent}
            onDeleteStudent={handleOpenDeleteStudent}
            isConfigured={isConfigured}
            onOpenConfig={() => setConfigModalOpen(true)}
          />
        )}

        {currentView === 'courses' && (
          <CoursesManager
            courses={courses}
            isLoading={isLoadingCourses}
            onRefresh={() => fetchCourses(true)}
            onAddCourse={handleOpenAddCourse}
            onEditCourse={handleOpenEditCourse}
            onDeleteCourse={handleOpenDeleteCourse}
            isConfigured={isConfigured}
            onOpenConfig={() => setConfigModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Student & Course Manager — Simple Academic Record App</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setConfigModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Supabase Connection & SQL Setup
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        onSubmit={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      <CourseModal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        onSubmit={handleSaveCourse}
        courseToEdit={courseToEdit}
      />

      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.type === 'student' ? 'Delete Student Record' : 'Delete Course'}
        itemName={
          deleteModalState.item
            ? deleteModalState.type === 'student'
              ? (deleteModalState.item as Student).full_name
              : (deleteModalState.item as Course).course_name
            : ''
        }
        isLoading={deleteModalState.isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteModalState({ isOpen: false, type: 'student', item: null, isDeleting: false })
        }
      />

      <SupabaseConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        onCredentialsUpdated={handleCredentialsUpdated}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
