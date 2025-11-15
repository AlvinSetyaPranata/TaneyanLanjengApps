import { Icon } from "@iconify/react";
import DetailLayout from "../../layouts/DetailLayout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamHistory } from "../../services/examService";
import { parseExamContent, type ExamQuestion, checkAnswers } from '../../utils/examParser';

export default function ReviewExam() {
  const { module_id, history_id } = useParams<{ module_id: string; history_id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examHistory, setExamHistory] = useState<any>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answerResults, setAnswerResults] = useState<{[key: number]: {correct: boolean, correctAnswer: string | undefined}}>({});

  // Fetch exam history
  useEffect(() => {
    const fetchExamHistory = async () => {
      if (!module_id || !history_id) {
        setError('Invalid module or exam history ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const historyData = await getExamHistory();
        
        if (historyData.success) {
          // Find the specific exam history
          const exam = historyData.history.find((e: any) => e.id === parseInt(history_id));
          if (!exam) {
            setError('Exam history not found');
            setLoading(false);
            return;
          }
          
          setExamHistory(exam);
          
          // Parse exam content (in a real implementation, you'd fetch the actual lesson content)
          // For now, we'll create mock questions based on the history
          const mockQuestions: ExamQuestion[] = [];
          Object.keys(exam.answers).forEach((questionIdStr, index) => {
            const questionId = parseInt(questionIdStr);
            mockQuestions.push({
              id: questionId,
              type: 'multiple-choice',
              question: `Soal ${index + 1}`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              points: 1,
              correctAnswer: exam.correct_answers[questionId] || 'Option A'
            });
          });
          
          setQuestions(mockQuestions);
          
          // Check answers using the utility function
          const results = checkAnswers(mockQuestions, exam.answers);
          setAnswerResults(results.results);
        } else {
          setError('Failed to load exam history');
        }
      } catch (err) {
        console.error('Error fetching exam history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exam history');
      } finally {
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, [module_id, history_id]);

  if (loading) {
    return (
      <DetailLayout title="Loading...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon icon="line-md:loading-loop" className="text-6xl text-black mx-auto mb-4" />
            <p className="text-gray-600">Loading exam review...</p>
          </div>
        </div>
      </DetailLayout>
    );
  }

  if (error || !examHistory) {
    return (
      <DetailLayout title="Error">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon icon="tabler:alert-circle" className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error || 'Exam history not found'}</p>
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

  // Check if student's answer is correct
  const isAnswerCorrect = (questionId: number) => {
    return answerResults[questionId]?.correct || false;
  };

  return (
    <DetailLayout title={`Review: ${examHistory.lesson_title}`} backUrl={`/student/modules/${module_id}/corridor`}>
      <div className="px-12 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Review Ujian</h1>
          <button
            onClick={() => navigate(`/student/modules/${module_id}/corridor`)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Kembali ke Modul
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{examHistory.lesson_title}</h2>
            <div className="text-lg font-semibold">
              Score: {examHistory.score} / {examHistory.max_score} ({examHistory.percentage}%)
            </div>
          </div>
          <p className="text-gray-600">
            Dikerjakan pada: {new Date(examHistory.date_finished).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        
        <div className="space-y-6">
          {questions.map((question, index) => {
            const studentAnswer = examHistory.answers[question.id];
            const correctAnswer = question.correctAnswer;
            const isCorrect = isAnswerCorrect(question.id);
            
            return (
              <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start mb-4">
                  <span className="font-semibold mr-2">Soal {index + 1}:</span>
                  <span className="flex-1">{question.question}</span>
                  <span className="text-sm text-gray-500 ml-2">({question.points} poin)</span>
                </div>
                
                {question.type === 'multiple-choice' && question.options && (
                  <div className="space-y-2 ml-4">
                    {question.options.map((option, optionIndex) => {
                      const isStudentAnswer = option === studentAnswer;
                      const isCorrectAnswer = option === correctAnswer;
                      
                      // Determine styling based on answer correctness
                      let containerClass = "flex items-center p-3 rounded-lg border-2 ";
                      let textClass = "";
                      let icon = null;
                      
                      if (isStudentAnswer && isCorrectAnswer) {
                        // Student answered correctly - green theme
                        containerClass += "bg-green-100 border-green-500";
                        textClass = "text-green-800";
                        icon = <Icon icon="mdi:check-circle" className="text-green-600 text-xl mr-2" />;
                      } else if (isStudentAnswer && !isCorrectAnswer) {
                        // Student answered incorrectly - red theme
                        containerClass += "bg-red-100 border-red-500";
                        textClass = "text-red-800";
                        icon = <Icon icon="mdi:close-circle" className="text-red-600 text-xl mr-2" />;
                      } else if (!isStudentAnswer && isCorrectAnswer) {
                        // Correct answer (not chosen by student) - green theme
                        containerClass += "bg-green-100 border-green-500";
                        textClass = "text-green-800";
                        icon = <Icon icon="mdi:check-circle" className="text-green-600 text-xl mr-2" />;
                      } else {
                        // Other options - neutral theme
                        containerClass += "bg-gray-50 border-gray-300";
                        textClass = "text-gray-700";
                      }
                      
                      return (
                        <div key={optionIndex} className={containerClass}>
                          <div className="flex items-center w-full">
                            <div className="flex items-center h-5">
                              {icon}
                            </div>
                            <span className={`ml-2 ${textClass}`}>
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </span>
                            {isStudentAnswer && (
                              <span className="ml-auto text-sm font-medium text-gray-500">
                                Jawaban Anda
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <Icon icon="mdi:information" className="inline mr-1" />
                    {isCorrect 
                      ? "Jawaban Anda benar!" 
                      : `Jawaban yang benar adalah: ${correctAnswer || 'Tidak tersedia'}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(`/student/modules/${module_id}/corridor`)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Kembali ke Modul
          </button>
        </div>
      </div>
    </DetailLayout>
  );
}