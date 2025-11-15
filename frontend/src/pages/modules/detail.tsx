import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Breadcrumps from "../../components/atoms/Breadcrumps";
import { Icon } from "@iconify/react";
import DetailLayout from "../../layouts/DetailLayout";
import { getModuleDetail } from "../../services/moduleService";
import { getExamHistory } from "../../services/examService";
import type { Module, Lesson } from "../../types/modules";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ModuleDetail() {
  const { module_id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examHistory, setExamHistory] = useState<any[]>([]);

  useEffect(() => {
    async function loadModuleDetail() {
      if (!module_id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await getModuleDetail(parseInt(module_id));
        setModule(data.module);
      } catch (err) {
        console.error('Error fetching module:', err);
        setError('Gagal memuat detail modul');
      } finally {
        setIsLoading(false);
      }
    }

    loadModuleDetail();
  }, [module_id]);

  // Load exam history
  useEffect(() => {
    async function loadExamHistory() {
      try {
        const historyData = await getExamHistory();
        if (historyData.success) {
          // Filter history for this module
          const moduleHistory = historyData.history.filter(
            (exam: any) => exam.module_id === parseInt(module_id || '0')
          );
          setExamHistory(moduleHistory);
        }
      } catch (err) {
        console.error('Error fetching exam history:', err);
        // Don't show error to user, just leave history empty
      }
    }

    if (module_id) {
      loadExamHistory();
    }
  }, [module_id]);

  const urls = [
    {
      title: "Modul Kelas",
      url: "/student/modules",
    },
    {
      title: module?.title || "Loading...",
      url: `/student/modules/${module_id}/corridor`,
    },
  ];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Find first incomplete lesson
  const getNextLesson = () => {
    if (!module?.lessons || module.lessons.length === 0) return null;
    // For now, return first lesson (you can implement logic to track completed lessons)
    return module.lessons[0];
  };

  const nextLesson = getNextLesson();
  const progress = module?.progress || 0;
  const totalLessons = module?.lessons?.length || 0;
  const completedLessons = Math.floor((progress / 100) * totalLessons);

  if (isLoading) {
    return (
      <DetailLayout title="Loading...">
        <div className="flex items-center justify-center min-h-screen">
          <Icon icon="line-md:loading-loop" className="text-6xl text-blue-600" />
        </div>
      </DetailLayout>
    );
  }

  if (error || !module) {
    return (
      <DetailLayout title="Error">
        <div className="px-12 py-8">
          <div className="text-center py-12">
            <Icon icon="tabler:alert-circle" className="text-6xl text-red-600 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error || 'Modul tidak ditemukan'}</p>
            <button
              onClick={() => navigate('/student/modules')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Kembali ke Daftar Modul
            </button>
          </div>
        </div>
      </DetailLayout>
    );
  }

  return (
    <DetailLayout title={module.title} backUrl="/student/modules">
      <div className="px-12 py-8">
        <Breadcrumps urls={urls} />
        <div className="flex justify-between items-center">
          <h1 className="mt-8 text-3xl font-semibold">{module.title}</h1>
          {nextLesson && (
            <Link 
              className="rounded-md bg-black text-white px-3 py-2 text-sm hover:bg-gray-800 transition-colors" 
              to={`/student/modules/${module_id}/lesson/${nextLesson.id}`}
            >
              Lanjut Belajar
            </Link>
          )}
        </div>

        {/* Module Description */}
        {module.description && (
          <p className="mt-4 text-gray-600">{module.description}</p>
        )}

        <div className="flex w-full justify-between items-start mt-12 gap-12">
          {/* Progress Section */}
          <div className="border-gray-400 border-[0.5px] w-full rounded-md p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Progress Belajar</h2>
              <p className="text-lg font-bold">{progress}%</p>
            </div>
            <div className="bg-gray-300 rounded-full w-full h-[8px]">
              <div 
                className="h-full bg-black rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:book-check" className="text-xl text-gray-800" />
                <h3 className="font-medium text-sm">Materi Selesai: </h3>
                <p className="text-sm">{completedLessons} dari {totalLessons}</p>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="majesticons:clock" className="text-xl text-black" />
                <h3 className="font-medium text-sm">Deadline Belajar: </h3>
                <p className="text-sm">{formatDate(module.deadline)}</p>
              </div>
            </div>
          </div>

          {/* Learning Tips */}
          <div className="w-full rounded-md flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:lightbulb-on" className="text-2xl text-gray-700" />
              <h2 className="font-semibold">Saran Belajar</h2>
            </div>
            <p className="font-light text-gray-700">
              Pelajari materi secara berurutan untuk pemahaman yang lebih baik. 
              Jangan ragu untuk mengulang materi yang sulit. 
              Manfaatkan waktu dengan baik sebelum deadline.
            </p>
          </div>
        </div>

        {/* Exam History Section */}
        {examHistory.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Icon icon="mdi:clipboard-text-clock" className="text-black" />
              Riwayat Ujian
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {examHistory.map((exam) => (
                <div key={exam.id} className="group flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gray-200 text-gray-800">
                      <Icon icon="mdi:clipboard-text" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {exam.lesson_title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Icon icon="mdi:calendar" width={16} />
                          {formatDate(exam.date_finished)}
                        </span>
                        {exam.score !== null && exam.max_score !== null && (
                          <span className="flex items-center gap-1">
                            <Icon icon="mdi:star" width={16} />
                            {exam.score} / {exam.max_score} ({exam.percentage}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/student/modules/${module_id}/review-exam/${exam.id}`}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                    >
                      Review
                    </Link>
                    <Icon 
                      icon="tabler:chevron-right" 
                      className="text-gray-400 group-hover:text-black transition-colors text-xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lessons List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Icon icon="mdi:book-open-page-variant" className="text-black" />
            Daftar Materi
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {module.lessons?.map((lesson, index) => {
              const isExam = lesson.lesson_type === 'exam';
              const lessonUrl = isExam 
                ? `/student/modules/${module_id}/exam/${lesson.id}`
                : `/student/modules/${module_id}/lesson/${lesson.id}`;
              
              return (
                <Link
                  key={lesson.id}
                  to={lessonUrl}
                  className="group flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      isExam ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {isExam ? <Icon icon="mdi:clipboard-text" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold group-hover:text-gray-800 transition-colors ${
                        isExam ? 'text-gray-900' : 'text-gray-900'
                      }`}>
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Icon icon="mdi:clock-outline" width={16} />
                          {lesson.duration_minutes} menit
                        </span>
                        {isExam && (
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-semibold">
                            UJIAN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Icon 
                    icon="tabler:chevron-right" 
                    className="text-gray-400 group-hover:text-black transition-colors text-xl"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </DetailLayout>
  );
}