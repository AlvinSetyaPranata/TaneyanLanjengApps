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
    handleSubmit();
  };

  // Handle answer change
  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Submit exam
  const handleSubmit = async () => {
    setIsTimerRunning(false);
    setIsSubmitted(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    try {
      // Submit answers to backend
      await submitExamAnswers(parseInt(lesson_id!), answers);
      console.log('Exam answers submitted successfully');
    } catch (error) {
      console.error('Error submitting exam answers:', error);
      // In a real implementation, you might want to show an error message to the user
    }
  };

  // Exit exam
  const handleExit = () => {
    navigate(`/student/modules/${module_id}/corridor`);
  };

  if (loading) {
    return (
      <DetailLayout title="Loading...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon icon="line-md:loading-loop" className="text-6xl text-black mx-auto mb-4" />
            <p className="text-gray-600">Loading exam...</p>
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
            <Icon icon="tabler:alert-circle" className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error || 'Exam not found'}</p>
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

  const { lesson, module } = lessonData;

  // Before exam starts
  if (!hasStarted) {
    return (
      <DetailLayout title={module.title} backUrl={`/student/modules/${module_id}/corridor`}>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="mdi:clipboard-text-clock" className="text-5xl text-black" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
              <p className="text-gray-600 mb-8">Modul: {module.title}</p>
              
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-8">
                <h2 className="font-semibold text-lg mb-4 flex items-center justify-center gap-2">
                  <Icon icon="mdi:information" className="text-gray-700" />
                  Instruksi Ujian
                </h2>
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Icon icon="mdi:clock-outline" className="text-gray-600 mt-1 flex-shrink-0" />
                    <span>Waktu ujian: <strong>{lesson.duration_minutes} menit</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="mdi:alert" className="text-gray-600 mt-1 flex-shrink-0" />
                    <span>Timer akan dimulai segera setelah Anda klik "Mulai Ujian"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="mdi:check-circle" className="text-gray-600 mt-1 flex-shrink-0" />
                    <span>Pastikan koneksi internet Anda stabil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="mdi:lock" className="text-gray-600 mt-1 flex-shrink-0" />
                    <span>Jangan keluar dari halaman saat ujian berlangsung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="mdi:format-list-bulleted" className="text-gray-600 mt-1 flex-shrink-0" />
                    <span>Ujian ini terdiri dari {questions.length} soal</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleExit}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={handleStartExam}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
                >
                  <Icon icon="mdi:play" className="text-xl" />
                  Mulai Ujian
                </button>
              </div>
            </div>
          </div>
        </div>
      </DetailLayout>
    );
  }

  // After submission
  if (isSubmitted) {
    return (
      <DetailLayout title={module.title}>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="mdi:check-circle" className="text-5xl text-black" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Ujian Tersubmit!</h1>
              <p className="text-gray-600 mb-8">
                Jawaban Anda telah berhasil dikumpulkan.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-gray-700">
                  Waktu pengerjaan: <strong>{formatTime((lessonData.lesson.duration_minutes * 60) - timeRemaining)}</strong>
                </p>
                <p className="text-gray-600 mt-2 text-sm">
                  Hasil ujian akan tersedia setelah dinilai oleh pengajar.
                </p>
              </div>

              <button
                onClick={handleExit}
                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Kembali ke Modul
              </button>
            </div>
          </div>
        </div>
      </DetailLayout>
    );
  }

  // During exam
  return (
    <DetailLayout title={module.title}>
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Timer Header */}
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">{lesson.title}</h2>
                <p className="text-sm text-gray-500">{module.title}</p>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Timer Display */}
                <div className={`flex items-center gap-2 ${getTimerColor()} font-mono text-2xl font-bold`}>
                  <Icon icon="mdi:timer-outline" className="text-3xl" />
                  {formatTime(timeRemaining)}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExitWarning(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Keluar
                  </button>
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
                  >
                    Submit Ujian
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                  <div className="flex items-start mb-4">
                    <span className="font-semibold mr-2">Soal {index + 1}:</span>
                    <span className="flex-1">{question.question}</span>
                    <span className="text-sm text-gray-500 ml-2">({question.points} poin)</span>
                  </div>
                  
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2 ml-4">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center">
                          <input
                            type="radio"
                            id={`question-${question.id}-option-${optionIndex}`}
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                          />
                          <label 
                            htmlFor={`question-${question.id}-option-${optionIndex}`} 
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'short-answer' && (
                    <div className="ml-4">
                      <textarea
                        id={`question-${question.id}`}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        placeholder="Tulis jawaban Anda di sini..."
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      />
                    </div>
                  )}
                  
                  {question.type === 'coding' && (
                    <div className="ml-4">
                      <textarea
                        id={`question-${question.id}`}
                        rows={8}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm font-mono"
                        placeholder="Tulis kode Anda di sini..."
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Submit Ujian
              </button>
            </div>
          </div>
        </div>

        {/* Warning Modals */}
        {showExitWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <Icon icon="mdi:alert" className="text-3xl text-gray-700" />
                <h3 className="text-xl font-bold">Peringatan!</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin keluar? Jawaban Anda belum tersubmit dan akan hilang.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowExitWarning(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleExit}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <Icon icon="mdi:check-circle" className="text-3xl text-black" />
                <h3 className="text-xl font-bold">Konfirmasi Submit</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin mengumpulkan jawaban? Anda tidak dapat mengubah jawaban setelah submit.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Ya, Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DetailLayout>
  );
}