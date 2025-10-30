// Type definitions for modules and lessons

export interface Lesson {
  id: number;
  title: string;
  content: string;
  lesson_type: 'lesson' | 'exam';
  order: number;
  duration_minutes: number;
  is_published: boolean;
  module_id: number;
  date_created: string;
  date_updated: string;
}

export interface Module {
  id: number;
  title: string;
  description?: string;
  deadline: string;
  author: number;
  author_name?: string;
  cover_image?: string;
  is_published: boolean;
  date_created: string;
  date_updated: string;
  lessons: Lesson[];
  progress?: number; // 0-100 representing completion percentage
  lessons_count?: number;
}

export interface ModulesOverviewResponse {
  success: boolean;
  count: number;
  modules: Module[];
}

export interface ModuleDetailResponse {
  success: boolean;
  module: Module;
}

export interface LessonDetailResponse {
  success: boolean;
  lesson: Lesson;
  module: {
    id: number;
    title: string;
    description?: string;
    cover_image?: string;
  };
  navigation: {
    prev: { id: number; title: string } | null;
    next: { id: number; title: string } | null;
  };
  all_lessons: Lesson[];
}
