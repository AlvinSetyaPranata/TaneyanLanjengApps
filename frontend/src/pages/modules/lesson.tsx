import { Icon } from "@iconify/react";
import DetailLayout from "../../layouts/DetailLayout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getLessonDetail, updateLessonProgress } from '../../services/moduleService';
import type { Lesson, LessonDetailResponse } from '../../types/modules';

export default function LessonPage() {
  const { module_id, lesson_id } = useParams<{ module_id: string; lesson_id: string }>();
  const navigate = useNavigate();
  
  const [sidebarStatus, setSidebarStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<LessonDetailResponse | null>(null);

  // Fetch lesson data from backend
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
        
        // If this is an exam, redirect to student exam page
        if (data.lesson.lesson_type === 'exam') {
          navigate(`/student/modules/${module_id}/exam/${lesson_id}`);
          return;
        }
        
        setLessonData(data);
        
        // Update progress when lesson is loaded
        try {
          await updateLessonProgress(parseInt(module_id), parseInt(lesson_id));
        } catch (progressError) {
          console.error('Failed to update lesson progress:', progressError);
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [module_id, lesson_id, navigate]);

  // Calculate progress based on current lesson
  const calculateProgress = () => {
    if (!lessonData) return 0;
    const allLessons = lessonData.all_lessons;
    const currentIndex = allLessons.findIndex(l => l.id === lessonData.lesson.id);
    
    // If this is the last lesson and it's not an exam, set progress to 100%
    // Otherwise calculate normally
    if (currentIndex === allLessons.length - 1 && lessonData.lesson.lesson_type !== 'exam') {
      return 100;
    }
    
    return allLessons.length > 0 ? Math.round(((currentIndex + 1) / allLessons.length) * 100) : 0;
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (lessonData?.navigation.prev) {
      navigate(`/student/modules/${module_id}/lesson/${lessonData.navigation.prev.id}`);
    }
  };

  const handleNext = () => {
    if (lessonData?.navigation.next) {
      navigate(`/student/modules/${module_id}/lesson/${lessonData.navigation.next.id}`);
    } else if (lessonData) {
      // If there's no next lesson but there are exams, navigate to the first exam
      const exams = lessonData.all_lessons.filter(l => l.lesson_type === 'exam');
      if (exams.length > 0) {
        // Find the first exam
        const firstExam = exams[0];
        navigate(`/student/modules/${module_id}/exam/${firstExam.id}`);
      }
    }
  };

  const handleLessonClick = (lessonId: number) => {
    navigate(`/student/modules/${module_id}/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <DetailLayout title="Loading..." backUrl={`/student/modules/${module_id}/corridor`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon icon="line-md:loading-loop" className="text-6xl text-black mx-auto mb-4" />
            <p className="text-gray-600">Loading lesson...</p>
          </div>
        </div>
      </DetailLayout>
    );
  }

  if (error || !lessonData) {
    return (
      <DetailLayout title="Error" backUrl={`/student/modules/${module_id}/corridor`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon icon="tabler:alert-circle" className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error || 'Lesson not found'}</p>
            <button
              onClick={() => navigate(`/student/modules/${module_id}/corridor`)}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Back to Module
            </button>
          </div>
        </div>
      </DetailLayout>
    );
  }

  const { lesson, module, navigation, all_lessons } = lessonData;
  const progress = calculateProgress();

  // Check if there's a next lesson or exam available
  const hasNext = () => {
    if (lessonData?.navigation.next) {
      return true;
    }
    // Check if there are exams available
    if (lessonData) {
      const exams = lessonData.all_lessons.filter(l => l.lesson_type === 'exam');
      return exams.length > 0;
    }
    return false;
  };

  return (
    <DetailLayout title={module.title} backUrl={`/student/modules/${module_id}/corridor`}>
      <div className="flex min-h-screen relative">
        {/* Floating toggle button when sidebar is collapsed */}
        {!sidebarStatus && (
          <button
            onClick={() => setSidebarStatus(true)}
            className="fixed right-6 top-24 bg-black rounded-full p-2 hover:bg-gray-800 transition-colors shadow-lg z-50"
          >
            <Icon icon="line-md:chevron-left" className="text-white text-xl" />
          </button>
        )}

        {/* Content */}
        <div className={`flex-1 px-20 py-8 transition-all duration-300 ${
          sidebarStatus ? 'mr-0' : 'mr-0'
        }`}>
          {/* Article Metadata - Simplified without duplicate title */}
          <div className="mb-8">
            <div className="flex items-center gap-x-4 text-gray-600 text-sm">
              <span>📚 {module.title}</span>
              <span>•</span>
              <span>⏱️ {lesson.duration_minutes} menit</span>
              <span>•</span>
              <span>📅 Diperbarui {new Date(lesson.date_updated).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              {lesson.lesson_type === 'exam' && (
                <>
                  <span>•</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-semibold">UJIAN</span>
                </>
              )}
            </div>
          </div>

          {/* Markdown Content */}
          <article className="markdown-content prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content}
            </ReactMarkdown>
          </article>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={!navigation.prev}
              className={`flex items-center gap-x-2 px-6 py-3 rounded-lg transition-colors ${
                navigation.prev
                  ? 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Icon icon="tabler:arrow-left" className="text-xl" />
              <div className="text-left">
                <div className="text-xs text-gray-500">Sebelumnya</div>
                {navigation.prev && (
                  <div className="font-semibold text-sm">{navigation.prev.title}</div>
                )}
              </div>
            </button>
            
            <button
              onClick={handleNext}
              disabled={!hasNext()}
              className={`flex items-center gap-x-2 px-6 py-3 rounded-lg transition-colors ${
                hasNext()
                  ? 'bg-black hover:bg-gray-800 text-white cursor-pointer'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="text-right">
                <div className="text-xs">{hasNext() ? 'Selanjutnya' : 'Selesai'}</div>
                {lessonData?.navigation.next && (
                  <div className="font-semibold text-sm">{lessonData.navigation.next.title}</div>
                )}
                {!lessonData?.navigation.next && hasNext() && (
                  <div className="font-semibold text-sm">Ujian Akhir</div>
                )}
              </div>
              <Icon icon="tabler:arrow-right" className="text-xl" />
            </button>
          </div>
        </div>
        {/* End Content */}

        {/* Sidebar */}
        <div className={`border-l border-gray-200 py-8 flex-shrink-0 transition-all duration-300 ${
          sidebarStatus ? 'w-[300px]' : 'w-0 border-l-0 overflow-hidden'
        }`}>
          <div className="w-[300px] px-4">
            <button 
              onClick={() => setSidebarStatus(state => !state)} 
              className="bg-black rounded-full p-2 hover:cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <Icon icon={`line-md:chevron-${sidebarStatus ? 'right' : 'left'}`} className="text-white text-xl" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-[300px] border-b border-t border-gray-300 bg-gray-50 mt-8 py-6 px-4">
            <div className="w-full rounded-full h-[5px] bg-gray-300">
              <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-gray-700">{progress}% Selesai</p>
          </div>

          {/* Lessons List */}
          <div className="w-[300px] flex flex-col gap-y-2 p-4">
            <h3 className="font-semibold mb-2 text-gray-700">Daftar Pelajaran</h3>
            {all_lessons.map((lessonItem, index) => (
              <button
                key={lessonItem.id}
                onClick={() => handleLessonClick(lessonItem.id)}
                className={`flex items-start gap-x-3 p-3 rounded-lg transition-all ${
                  lessonItem.id === lesson.id
                    ? 'bg-gray-100 border-l-4 border-black'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  lessonItem.id === lesson.id
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-sm font-medium ${
                    lessonItem.id === lesson.id ? 'text-black' : 'text-gray-900'
                  }`}>
                    {lessonItem.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {lessonItem.duration_minutes} menit
                    {lessonItem.lesson_type === 'exam' && (
                      <span className="ml-2 px-1 py-0.5 bg-gray-200 text-gray-800 rounded text-[10px] font-semibold">UJIAN</span>
                    )}
                  </div>
                </div>
                {lessonItem.id === lesson.id && (
                  <Icon icon="tabler:player-play-filled" className="text-black flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
        {/* End Sidebar */}
      </div>
    </DetailLayout>
  );
}
