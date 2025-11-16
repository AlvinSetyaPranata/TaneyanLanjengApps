// User service for profile management

import { authFetch } from '../utils/auth';
import type { User } from '../utils/auth';

const API_BASE_URL = import.meta.env.BASE_API_URL || 'http://localhost:8000/api';

export interface UserProfileResponse {
  message: string;
  user: User;
}

export interface UpdateProfileData {
  full_name?: string;
  email?: string;
  institution?: string;
  semester?: number;
  profile_photo?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface PasswordChangeResponse {
  message: string;
}

/**
 * Fetch the current user's profile
 * @returns Promise with user profile data
 */
export async function getUserProfile(): Promise<UserProfileResponse> {
  const response = await authFetch(`${API_BASE_URL}/user/profile/`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return await response.json();
}

/**
 * Update the current user's profile
 * @param profileData - The profile data to update
 * @returns Promise with updated user data
 */
export async function updateUserProfile(profileData: UpdateProfileData): Promise<UserProfileResponse> {
  const response = await authFetch(`${API_BASE_URL}/user/profile/update/`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update profile');
  }
  
  return await response.json();
}

/**
 * Change the current user's password
 * @param passwordData - Current and new password
 * @returns Promise with success message
 */
export async function changePassword(passwordData: ChangePasswordData): Promise<PasswordChangeResponse> {
  const response = await authFetch(`${API_BASE_URL}/user/password/change/`, {
    method: 'POST',
    body: JSON.stringify(passwordData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to change password');
  }
  
  return await response.json();
}