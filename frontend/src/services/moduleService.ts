import { authFetch } from '../utils/auth';
import type { 
  ModulesOverviewResponse, 
  ModuleDetailResponse, 
  LessonDetailResponse 
} from '../types/modules';

const API_BASE_URL = 'http://localhost:8004/api';

/**
 * Fetch all modules with their lessons
 */
export const getAllModules = async (): Promise<ModulesOverviewResponse> => {
  const response = await authFetch(`${API_BASE_URL}/modules/overview`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch modules overview');
  }
  
  return await response.json();
};

/**
 * Fetch a specific module with all its lessons
 */
export const getModuleDetail = async (moduleId: number): Promise<ModuleDetailResponse> => {
  const response = await authFetch(`${API_BASE_URL}/modules/${moduleId}/detail`);
  
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
  const response = await authFetch(`${API_BASE_URL}/modules/${moduleId}/lessons/${lessonId}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Lesson not found');
    }
    throw new Error('Failed to fetch lesson detail');
  }
  
  return await response.json();
};
