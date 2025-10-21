// Type definitions for modules and lessons

export interface Lesson {
  id: number;
  content: string;
  module_id: number;
}

export interface Module {
  id: number;
  title: string;
  deadline: string;
  author_id: number;
  date_created: string;
  date_updated: string;
  lessons: Lesson[];
  progress: number; // 0-100 representing completion percentage
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
