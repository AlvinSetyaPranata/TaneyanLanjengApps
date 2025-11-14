// API service for modules and user management

import { authFetch } from './auth';
import type { ModulesOverviewResponse, ModuleDetailResponse } from '../types/modules';

const API_BASE_URL = 'http://localhost:8000/api'; // Updated to match the correct backend port

/**
 * Fetch all modules with their lessons
 * @returns Promise with modules overview data
 */
export async function fetchModulesOverview(): Promise<ModulesOverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/modules/overview`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch modules overview');
  }
  
  return await response.json();
}

/**
 * Fetch a specific module with its lessons
 * @param moduleId - The ID of the module to fetch
 * @returns Promise with module detail data
 */
export async function fetchModuleDetail(moduleId: number): Promise<ModuleDetailResponse> {
  const response = await authFetch(`${API_BASE_URL}/modules/${moduleId}/detail`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Module not found');
    }
    throw new Error('Failed to fetch module detail');
  }
  
  return await response.json();
}

// Re-export user service functions for convenience
export { getUserProfile, updateUserProfile, changePassword } from '../services/userService';

// Re-export auth service functions for convenience
export { login, register, refreshAccessToken } from '../services/authService';