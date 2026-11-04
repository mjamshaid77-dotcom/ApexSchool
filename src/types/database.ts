export interface Student {
  id: number | string;
  full_name: string;
  email: string;
  class_name: string;
  registration_date: string;
}

export interface Course {
  id: number | string;
  course_name: string;
  course_description: string;
  creation_date: string;
}

export type ViewMode = 'home' | 'students' | 'courses';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
