import { authFetch } from '../utils/auth';
import type { 
  ModulesOverviewResponse, 
  ModuleDetailResponse, 
  LessonDetailResponse 
} from '../types/modules';


/**
 * Fetch all modules with their lessons
 */
export const getAllModules = async (): Promise<ModulesOverviewResponse> => {
  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/modules/overview`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch modules overview');
  }
  
  return await response.json();
};

/**
 * Fetch a specific module with all its lessons
 */
export const getModuleDetail = async (moduleId: number): Promise<ModuleDetailResponse> => {
  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/modules/${moduleId}/detail`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Module not found');
    }
    throw new Error('Failed to fetch module detail');
  }
  
  return await response.json();
};

/**
 * Fetch a specific lesson with navigation and module context
 */
export const getLessonDetail = async (
  moduleId: number, 
  lessonId: number
): Promise<LessonDetailResponse> => {
  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/modules/${moduleId}/lessons/${lessonId}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Lesson not found');
    }
    throw new Error('Failed to fetch lesson detail');
  }
  
  return await response.json();
};

/**
 * Update lesson progress
 * @param moduleId - The ID of the module
 * @param lessonId - The ID of the lesson
 * @returns Promise with progress update response
 */
export async function updateLessonProgress(moduleId: number, lessonId: number) {
  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/student/modules/${moduleId}/lessons/${lessonId}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to update lesson progress');
  }
  
  return await response.json();
}