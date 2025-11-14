// Service for exam-related API calls

import { authFetch } from '../utils/auth';

const API_BASE_URL = 'http://localhost:8000/api'; // Updated to match the correct backend port

/**
 * Submit exam answers
 * @param lessonId - The ID of the exam lesson
 * @param answers - The answers to submit
 * @returns Promise with submission response
 */
export async function submitExamAnswers(lessonId: number, answers: {[key: number]: string}) {
  const response = await authFetch(`${API_BASE_URL}/exam/${lessonId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit exam answers');
  }
  
  return await response.json();
}