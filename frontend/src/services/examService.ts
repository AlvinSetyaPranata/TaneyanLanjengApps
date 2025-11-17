// Service for exam-related API calls

import { authFetch } from '../utils/auth';

/**
 * Submit exam answers
 * @param lessonId - The ID of the exam lesson
 * @param answers - The answers to submit
 * @returns Promise with submission response
 */
export async function submitExamAnswers(lessonId: number, answers: {[key: number]: string}) {
  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/exam/${lessonId}/submit`, {
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

/**
 * Get exam history for the current student
 * @returns Promise with exam history data
 */
export async function getExamHistory() {
  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/student/exam-history`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch exam history');
  }
  
  return await response.json();
}