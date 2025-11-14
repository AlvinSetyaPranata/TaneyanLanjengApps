# Modules Integration

## Overview

This document describes the integration of modules and lessons functionality in the frontend application.

## Setup Instructions

### Prerequisites

1. Backend server running on `http://localhost:8004`
2. Frontend development server running on `http://localhost:5173`
3. Node.js 16+ and Bun package manager installed
4. Database with sample modules and lessons

### Installation

1. Install dependencies:
   ```bash
   cd frontend
   bun install
   ```

2. Start development server:
   ```bash
   bun run dev
   ```

3. Verify backend is running (`http://localhost:8004`)

## API Integration

### Module Service

The module service is implemented in `src/services/moduleService.ts`:

```typescript
import { authFetch } from '../utils/auth';
import type { 
  ModulesOverviewResponse, 
  ModuleDetailResponse, 
  LessonDetailResponse 
} from '../types/modules';

const API_BASE_URL = 'http://localhost:8000/api';

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
```

### Module Types

Type definitions for modules are in `src/types/modules.ts`:

```typescript
export interface Module {
  id: number;
  title: string;
  description: string;
  deadline: string;
  author: number;
  author_name: string;
  cover_image: string | null;
  is_published: boolean;
  date_created: string;
  date_updated: string;
  lessons_count?: number;
  has_exam?: boolean;
  exam_count?: number;
  progress?: number;
}

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

export interface ModulesOverviewResponse {
  success: boolean;
  count: number;
  modules: Module[];
}

export interface ModuleDetailResponse {
  success: boolean;
  module: Module & {
    lessons: Lesson[];
  };
}

export interface LessonDetailResponse {
  success: boolean;
  lesson: Lesson;
  module: {
    id: number;
    title: string;
    description: string;
    cover_image: string | null;
  };
  navigation: {
    prev: { id: number; title: string } | null;
    next: { id: number; title: string } | null;
  };
  all_lessons: Array<{
    id: number;
    title: string;
    lesson_type: 'lesson' | 'exam';
    order: number;
    is_published: boolean;
  }>;
}
```

## Component Integration

### Modules Page

The modules page displays all available modules:

```tsx
// src/pages/modules/index.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllModules } from '../../services/moduleService';
import type { Module } from '../../types/modules';
import RootLayout from '../../layouts/RootLayout';
import DashboardCard from '../../components/atoms/DashboardCard';
import Button from '../../components/atoms/Button';

export default function ModulesPage() {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const data = await getAllModules();
        setModules(data.modules);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch modules');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return (
      <RootLayout title="Modules">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading modules...</p>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (error) {
    return (
      <RootLayout title="Modules">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout title="Modules">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Learning Modules</h1>
          <p className="text-gray-600 mt-2">
            Browse through available modules and start learning
          </p>
        </div>

        {modules.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📚</div>
            <p className="text-gray-600">No modules available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <DashboardCard
                key={module.id}
                title={module.title}
                description={module.description}
                imageUrl={module.cover_image || undefined}
                progress={module.progress}
                onClick={() => navigate(`/student/modules/${module.id}/corridor`)}
                footer={
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{module.lessons_count} lessons</span>
                    <span>by {module.author_name}</span>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </RootLayout>
  );
}
```

### Module Detail Page

The module detail page shows information about a specific module and its lessons:

```tsx
// src/pages/modules/detail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModuleDetail } from '../../services/moduleService';
import type { Module, Lesson } from '../../types/modules';
import DetailLayout from '../../layouts/DetailLayout';
import Button from '../../components/atoms/Button';

export default function ModuleDetailPage() {
  const { module_id } = useParams<{ module_id: string }>();
  const navigate = useNavigate();
  const [module, setModule] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      if (!module_id) return;
      
      try {
        setLoading(true);
        const data = await getModuleDetail(parseInt(module_id));
        setModule(data.module);
        setLessons(data.module.lessons);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch module');
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [module_id]);

  if (loading) {
    return (
      <DetailLayout title="Loading...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading module...</p>
          </div>
        </div>
      </DetailLayout>
    );
  }

  if (error || !module) {
    return (
      <DetailLayout title="Error">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error || 'Module not found'}</p>
            <Button onClick={() => navigate('/student/modules')}>
              Back to Modules
            </Button>
          </div>
        </div>
      </DetailLayout>
    );
  }

  return (
    <DetailLayout title={module.title}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Module Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {module.cover_image && (
              <div className="md:w-1/3">
                <img
                  src={module.cover_image}
                  alt={module.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <div className={module.cover_image ? 'md:w-2/3' : 'w-full'}>
              <h1 className="text-3xl font-bold mb-4">{module.title}</h1>
              <p className="text-gray-700 mb-6">{module.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Author:</span> {module.author_name}
                </div>
                <div>
                  <span className="font-semibold">Lessons:</span> {lessons.length}
                </div>
                <div>
                  <span className="font-semibold">Deadline:</span> {new Date(module.deadline).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Lessons</h2>
          
          {lessons.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-5xl mb-4">📝</div>
              <p className="text-gray-600">No lessons available yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/student/modules/${module.id}/lessons/${lesson.id}`)}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <span className="font-semibold text-gray-700">{index + 1}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{lesson.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span>{lesson.duration_minutes} min</span>
                      {lesson.lesson_type === 'exam' && (
                        <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          Exam
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DetailLayout>
  );
}
```

### Lesson Page

The lesson page displays the content of a specific lesson:

```tsx
// src/pages/modules/lesson.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getLessonDetail } from '../../services/moduleService';
import type { LessonDetailResponse } from '../../types/modules';
import DetailLayout from '../../layouts/DetailLayout';
import Button from '../../components/atoms/Button';
import Sidebar from '../../components/molecules/Sidebar';

export default function LessonPage() {
  const { module_id, lesson_id } = useParams<{ module_id: string; lesson_id: string }>();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState<LessonDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!module_id || !lesson_id) {
        setError('Invalid module or lesson ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getLessonDetail(parseInt(module_id), parseInt(lesson_id));
        setLessonData(data);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [module_id, lesson_id]);

  if (loading) {
    return (
      <DetailLayout title="Loading...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
      </DetailLayout>
    );
  }

  if (error || !lessonData) {
    return (
      <DetailLayout title="Error">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error || 'Lesson not found'}</p>
            <Button onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </DetailLayout>
    );
  }

  const { lesson, module, navigation, all_lessons } = lessonData;

  return (
    <DetailLayout title={module.title}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          lessons={all_lessons} 
          currentLessonId={lesson.id}
          onLessonSelect={(lessonId) => 
            navigate(`/student/modules/${module_id}/lessons/${lessonId}`)
          }
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Lesson Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
              <div className="flex items-center text-sm text-gray-600">
                <span>{lesson.duration_minutes} min read</span>
                {lesson.lesson_type === 'exam' && (
                  <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    Exam
                  </span>
                )}
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8 markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {lesson.content}
              </ReactMarkdown>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {navigation.prev ? (
                <Button
                  variant="secondary"
                  onClick={() => 
                    navigate(`/student/modules/${module_id}/lessons/${navigation.prev!.id}`)
                  }
                >
                  ← Previous: {navigation.prev.title}
                </Button>
              ) : (
                <div></div>
              )}

              {navigation.next ? (
                <Button
                  onClick={() => 
                    navigate(`/student/modules/${module_id}/lessons/${navigation.next!.id}`)
                  }
                >
                  Next: {navigation.next.title} →
                </Button>
              ) : (
                <Button
                  onClick={() => 
                    navigate(`/student/modules/${module_id}/corridor`)
                  }
                >
                  Back to Module
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DetailLayout>
  );
}
```

## Exam Integration

### Student Exam Page

The student exam page handles exam functionality:

```tsx
// src/pages/modules/studentExam.tsx
import { Icon } from "@iconify/react";
import DetailLayout from "../../layouts/DetailLayout";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getLessonDetail } from '../../services/moduleService';
import { submitExamAnswers } from '../../services/examService';
import type { LessonDetailResponse } from '../../types/modules';
import { parseExamContent, type ExamQuestion } from '../../utils/examParser';

export default function StudentExamPage() {
  const { module_id, lesson_id } = useParams<{ module_id: string; lesson_id: string }>();
  const navigate = useNavigate();
  
  const [lessonData, setLessonData] = useState<LessonDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Timer states
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timerRef = useRef<number | null>(null);
  
  // Exam states
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  
  // Warning modal states
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      if (!module_id || !lesson_id) {
        setError('Invalid module or lesson ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getLessonDetail(parseInt(module_id), parseInt(lesson_id));
        
        // Verify this is an exam
        if (data.lesson.lesson_type !== 'exam') {
          setError('This is not an exam lesson');
          setLoading(false);
          return;
        }
        
        setLessonData(data);
        setTimeRemaining(data.lesson.duration_minutes * 60); // Convert to seconds
        
        // Parse exam content into questions
        const parsedQuestions = parseExamContent(data.lesson.content);
        setQuestions(parsedQuestions);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exam');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [module_id, lesson_id]);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0 && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timeRemaining, isSubmitted]);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    const percentage = (timeRemaining / (lessonData?.lesson.duration_minutes || 1) / 60) * 100;
    if (percentage > 50) return 'text-gray-700';
    if (percentage > 20) return 'text-gray-800';
    return 'text-red-600';
  };

  // Start exam
  const handleStartExam = () => {
    setHasStarted(true);
    setIsTimerRunning(true);
  };

  // Time up handler - auto submit
  const handleTimeUp = () => {
    setIsTimerRunning(false);
    handleSubmit(true); // Pass true to indicate auto-submit due to time up
  };

  // Handle answer change
  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Submit exam
  const handleSubmit = async (isAutoSubmit: boolean = false) => {
    setIsTimerRunning(false);
    setIsSubmitted(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    try {
      // Submit answers to backend
      await submitExamAnswers(parseInt(lesson_id!), answers);
      console.log('Exam answers submitted successfully');
      
      // Show a message if this was an auto-submit due to time up
      if (isAutoSubmit) {
        alert('Waktu ujian telah habis. Jawaban Anda telah otomatis dikumpulkan.');
      }
    } catch (error) {
      console.error('Error submitting exam answers:', error);
      // In a real implementation, you might want to show an error message to the user
      alert('Terjadi kesalahan saat mengumpulkan jawaban. Silakan coba lagi.');
    }
  };

  // Exit exam
  const handleExit = () => {
    navigate(`/student/modules/${module_id}/corridor`);
  };

  // ... rest of the component implementation
}
```

### Exam Parser Utility

The exam parser utility handles parsing exam content:

```typescript
// src/utils/examParser.ts
// Utility function to parse exam content into structured questions

export interface ExamQuestion {
  id: number;
  type: 'multiple-choice' | 'short-answer' | 'coding';
  question: string;
  options?: string[];
  points: number;
  correctAnswer?: string;
}

export function parseExamContent(content: string): ExamQuestion[] {
  try {
    // Try to parse as JSON first (new format from teacher editor)
    const jsonData = JSON.parse(content);
    
    // If it's an array, it's the new format
    if (Array.isArray(jsonData)) {
      return jsonData.map((item: any, index: number) => ({
        id: index + 1,
        type: 'multiple-choice',
        question: item.question || '',
        options: item.options ? item.options.map((opt: any) => opt.text || '') : [],
        points: 1, // Default points
        // Note: We don't include correctAnswer in the student view for security
      }));
    }
  } catch (e) {
    // If JSON parsing fails, fall back to markdown parsing
    return parseMarkdownExamContent(content);
  }
  
  // Default fallback
  return [];
}

// Original markdown parsing function (kept for backward compatibility)
function parseMarkdownExamContent(content: string): ExamQuestion[] {
  // ... implementation from previous version
}
```

## Testing

### Unit Tests

Example unit test for module service:

```typescript
// src/services/__tests__/moduleService.test.ts
import { getAllModules, getModuleDetail, getLessonDetail } from '../moduleService';

// Mock fetch
global.fetch = jest.fn();

describe('Module Service', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getAllModules', () => {
    it('should fetch modules overview successfully', async () => {
      const mockResponse = {
        success: true,
        count: 1,
        modules: [
          {
            id: 1,
            title: 'Test Module',
            description: 'Test Description',
            deadline: '2024-12-31T23:59:59Z',
            author: 1,
            author_name: 'Test Author',
            cover_image: null,
            is_published: true,
            date_created: '2024-01-01T00:00:00Z',
            date_updated: '2024-01-01T00:00:00Z',
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getAllModules();
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/modules/overview');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(getAllModules()).rejects.toThrow('Failed to fetch modules overview');
    });
  });

  // ... more tests
});
```

### Integration Tests

Example integration test for modules page:

```typescript
// src/pages/__tests__/modules.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModulesPage from '../modules/index';
import * as moduleService from '../../services/moduleService';

// Mock the module service
jest.mock('../../services/moduleService');

describe('Modules Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading state initially', () => {
    (moduleService.getAllModules as jest.Mock).mockResolvedValue({
      success: true,
      count: 0,
      modules: []
    });

    render(
      <BrowserRouter>
        <ModulesPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading modules...')).toBeInTheDocument();
  });

  it('should display modules when loaded', async () => {
    const mockModules = [
      {
        id: 1,
        title: 'Test Module',
        description: 'Test Description',
        deadline: '2024-12-31T23:59:59Z',
        author: 1,
        author_name: 'Test Author',
        cover_image: null,
        is_published: true,
        date_created: '2024-01-01T00:00:00Z',
        date_updated: '2024-01-01T00:00:00Z',
        lessons_count: 5,
        progress: 50
      }
    ];

    (moduleService.getAllModules as jest.Mock).mockResolvedValue({
      success: true,
      count: 1,
      modules: mockModules
    });

    render(
      <BrowserRouter>
        <ModulesPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Module')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  // ... more tests
});
```

## Error Handling

### API Error Handling

The module service includes proper error handling:

```typescript
export const getAllModules = async (): Promise<ModulesOverviewResponse> => {
  const response = await authFetch(`${API_BASE_URL}/modules/overview`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch modules overview');
  }
  
  return await response.json();
};
```

### UI Error Handling

Components display user-friendly error messages:

```tsx
if (error) {
  return (
    <RootLayout title="Modules">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    </RootLayout>
  );
}
```

## Performance Optimization

### Lazy Loading

Components are lazy loaded where appropriate:

```tsx
// App.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const ModulesPage = lazy(() => import('./pages/modules/index'));
const ModuleDetailPage = lazy(() => import('./pages/modules/detail'));
const LessonPage = lazy(() => import('./pages/modules/lesson'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/student/modules" element={<ModulesPage />} />
        <Route path="/student/modules/:module_id" element={<ModuleDetailPage />} />
        <Route path="/student/modules/:module_id/lessons/:lesson_id" element={<LessonPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization

Expensive computations are memoized:

```tsx
import { useMemo } from 'react';

const LessonPage = () => {
  // ... other code
  
  const parsedQuestions = useMemo(() => {
    return parseExamContent(lesson.content);
  }, [lesson.content]);
  
  // ... rest of component
};
```

## Accessibility

### Semantic HTML

Components use semantic HTML elements:

```tsx
<main>
  <header>
    <h1>{module.title}</h1>
  </header>
  <section>
    <article>{lesson.content}</article>
  </section>
  <nav>
    <button onClick={handlePrev}>Previous</button>
    <button onClick={handleNext}>Next</button>
  </nav>
</main>
```

### Keyboard Navigation

Interactive elements are keyboard accessible:

```tsx
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigateToLesson(lesson.id);
    }
  }}
  onClick={() => navigateToLesson(lesson.id)}
>
  {lesson.title}
</div>
```

## Responsive Design

Components adapt to different screen sizes:

```tsx
<div className="flex flex-col md:flex-row">
  <Sidebar className="w-full md:w-64" />
  <main className="flex-1">
    {/* Content */}
  </main>
</div>
```

## Security

### Content Security

Markdown content is sanitized:

```tsx
<ReactMarkdown 
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw]}
>
  {lesson.content}
</ReactMarkdown>
```

### Authentication

All API calls include proper authentication:

```typescript
const response = await authFetch(`${API_BASE_URL}/modules/${moduleId}/detail`);
```

## Deployment

### Environment Variables

API base URL can be configured with environment variables:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
```

### Build Process

The application can be built for production:

```bash
cd frontend
bun run build
```

The built files will be in the `dist` directory and can be served by any static file server.