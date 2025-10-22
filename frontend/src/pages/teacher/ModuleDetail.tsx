import { Icon } from "@iconify/react"
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import DetailLayout from "../../layouts/DetailLayout"

interface Lesson {
  id: number
  title: string
  content: string
  lesson_type: 'lesson' | 'exam'
  order: number
  duration_minutes: number
  is_published: boolean
  module_id: number
  date_created: string
  date_updated: string
}

interface ModuleDetail {
  id: number
  title: string
  description: string
  deadline: string
  author_id: number
  author_name: string
  cover_image: string | null
  is_published: boolean
  has_exam: boolean
  exam_count: number
  date_created: string
  date_updated: string
  lessons: Lesson[]
}

export default function TeacherModuleDetail() {
  const { module_id } = useParams()
  
  const [module, setModule] = useState<ModuleDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch module details with lessons
  useEffect(() => {
    async function loadModule() {
      try {
        setIsLoading(true)
        setError(null)
        const token = localStorage.getItem('access_token')
        
        const response = await fetch(`http://localhost:8000/api/modules/${module_id}/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setModule(data.module)
        } else {
          setError('Failed to load module details')
        }
      } catch (err) {
        console.error('Error fetching module:', err)
        setError('Error loading module. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadModule()
  }, [module_id])

  // Delete lesson
  const handleDeleteLesson = async (lessonId: number, lessonTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${lessonTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:8000/api/lessons/${lessonId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Remove lesson from state
        setModule(prev => prev ? {
          ...prev,
          lessons: prev.lessons.filter(l => l.id !== lessonId)
        } : null)
        alert('Lesson deleted successfully')
      } else {
        alert('Failed to delete lesson')
      }
    } catch (err) {
      console.error('Error deleting lesson:', err)
      alert('Error deleting lesson')
    }
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <DetailLayout title="Loading...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Icon icon="svg-spinners:ring-resize" className="text-6xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat modul...</p>
          </div>
        </div>
      </DetailLayout>
    )
  }

  if (error || !module) {
    return (
      <DetailLayout title="Error">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <Icon icon="mdi:alert-circle-outline" className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Gagal Memuat Modul</h2>
          <p className="text-gray-600 mb-6">{error || 'Modul tidak ditemukan'}</p>
          <Link 
            to="/teacher/modules"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            <Icon icon="tabler:arrow-left" />
            Kembali ke Modul
          </Link>
        </div>
      </DetailLayout>
    )
  }

  return (
    <DetailLayout title={module.title}>
      <div className="px-20 py-8">
        {/* Exam Requirement Warning */}
        {!module.has_exam && (
          <div className="mb-6 bg-gray-50 border-l-4 border-black p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:alert-circle" className="text-3xl text-black flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  ⚠️ Ujian Akhir Wajib Dibuat
                </h3>
                <p className="text-gray-800 mb-4">
                  Setiap modul <strong>harus memiliki minimal 1 ujian akhir</strong> sebelum dapat dipublikasikan. 
                  Ujian ini penting untuk mengevaluasi pemahaman siswa terhadap materi.
                </p>
                <Link to={`/teacher/modules/${module.id}/lessons/create`}>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold">
                    <Icon icon="mdi:clipboard-check-outline" className="text-xl" />
                    Buat Ujian Sekarang
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Exam Status Info (when exam exists) */}
        {module.has_exam && (
          <div className="mb-6 bg-gray-50 border-l-4 border-gray-600 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 text-gray-800">
              <Icon icon="mdi:check-circle" className="text-xl" />
              <p className="font-medium">
                ✓ Modul ini memiliki {module.exam_count} ujian akhir
              </p>
            </div>
          </div>
        )}

        {/* Module Info Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              module.is_published 
                ? 'bg-black text-white' 
                : 'bg-gray-300 text-gray-700'
            }`}>
              {module.is_published ? 'Dipublikasi' : 'Draft'}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{module.description}</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Icon icon="tabler:file-text" width={18} height={18} />
              <span>{module.lessons.length} materi</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon icon="tabler:calendar" width={18} height={18} />
              <span>Deadline: {formatDate(module.deadline)}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Link to={`/teacher/modules/${module.id}/edit`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium">
                <Icon icon="tabler:pencil" />
                Edit Modul
              </button>
            </Link>
            <Link to={`/teacher/modules/${module.id}/lessons/create`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium">
                <Icon icon="tabler:plus" />
                Tambah Materi
              </button>
            </Link>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Daftar Materi</h2>
            <p className="text-gray-600 text-sm mt-1">
              Kelola materi pembelajaran dalam modul ini
            </p>
          </div>

          {module.lessons.length === 0 ? (
            <div className="p-12 text-center">
              <Icon icon="tabler:book-off" className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Belum ada materi</h3>
              <p className="text-gray-500 mt-2 mb-6">
                Mulai buat materi untuk siswa Anda
              </p>
              <Link to={`/teacher/modules/${module.id}/lessons/create`}>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium">
                  <Icon icon="tabler:plus" />
                  Buat Materi Pertama
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {module.lessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  to={`/teacher/lessons/${lesson.id}/edit`}
                  className="block group"
                >
                  <div className={`p-8 hover:bg-gray-50 transition-colors ${index !== 0 ? 'border-t border-gray-200' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 flex items-center gap-3">
                        <div className="rounded-full size-[18px] border border-gray-400 group-hover:border-black transition-all" />
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 font-semibold text-xs">
                              {lesson.order}
                            </span>
                            <h3 className="font-semibold text-lg text-gray-800">
                              {lesson.title}
                            </h3>
                            {lesson.lesson_type === 'exam' && (
                              <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 text-xs font-medium">
                                <Icon icon="tabler:clipboard-check" className="inline mr-1" width={14} />
                                Ujian
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lesson.is_published 
                                ? 'bg-black text-white' 
                                : 'bg-gray-300 text-gray-700'
                            }`}>
                              {lesson.is_published ? 'Dipublikasi' : 'Draft'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 ml-9">
                            <div className="flex items-center gap-1">
                              <Icon icon="tabler:clock" width={16} height={16} />
                              <span>{lesson.duration_minutes} menit</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon icon="tabler:calendar" width={16} height={16} />
                              <span>Diperbarui: {formatDate(lesson.date_updated)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="group-hover:opacity-100 opacity-0 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md transition-all text-sm font-medium">
                          <Icon icon="tabler:pencil" width={18} height={18} />
                          Edit
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDeleteLesson(lesson.id, lesson.title)
                          }}
                          className="group-hover:opacity-100 opacity-0 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all text-sm font-medium"
                        >
                          <Icon icon="tabler:trash" width={18} height={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DetailLayout>
  )
}
