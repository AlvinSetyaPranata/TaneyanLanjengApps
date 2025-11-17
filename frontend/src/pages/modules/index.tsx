import { Icon } from "@iconify/react"
import { useState, useEffect } from "react"
import Breadcrumps from "../../components/atoms/Breadcrumps"
import { Link } from "react-router-dom"
import RootLayout from "../../layouts/RootLayout"
import { fetchModulesOverview } from "../../utils/api"
import { getUser } from "../../utils/auth"
import type { Module } from "../../types/modules"

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export default function Modules() {
  const [activeBtn, setActiveBtn] = useState(1)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roles, setRoles] = useState<{[key: string]: number}>({})
  const [rolesLoaded, setRolesLoaded] = useState(false)
  const user = getUser()
  
  // Fetch roles on component mount
  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await fetch(`${API_BASE_URL}/roles/`);
        if (response.ok) {
          const rolesData = await response.json();
          const roleMap: {[key: string]: number} = {};
          rolesData.forEach((role: any) => {
            roleMap[role.name] = role.id;
          });
          setRoles(roleMap);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setRolesLoaded(true);
      }
    }
    
    fetchRoles();
  }, []);
  
  // Role detection based on actual role IDs from backend
  const isTeacher = rolesLoaded && roles.Teacher && user?.role === roles.Teacher;
  const isStudent = rolesLoaded && roles.Student && user?.role === roles.Student;

  const urls = [
    {
      title: "Modul Kelas",
      url: "/modules"
    },
  ]

  // Fetch modules on component mount and when roles or user changes
  useEffect(() => {
    // Don't fetch modules until roles are loaded
    if (!rolesLoaded) return;
    
    async function loadModules() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchModulesOverview()
        
        // For teachers, filter to show only their modules
        // For students, show all modules (they have progress tracking)
        if (isTeacher) {
          const teacherModules = data.modules.filter(
            (module: Module) => module.author === user?.id
          )
          setModules(teacherModules)
        } else {
          setModules(data.modules)
        }
      } catch (err) {
        console.error('Error fetching modules:', err)
        setError('Gagal memuat data modul. Silakan coba lagi.')
      } finally {
        setIsLoading(false)
      }
    }

    loadModules()
  }, [isTeacher, isStudent, user?.id, rolesLoaded])

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Check if module is completed
  const isModuleCompleted = (progress: number | undefined) => (progress || 0) >= 100

  // Delete module (teacher only)
  const handleDelete = async (moduleId: number, moduleName: string) => {
    if (!confirm(`Are you sure you want to delete "${moduleName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setModules(modules.filter(m => m.id !== moduleId))
        alert('Module deleted successfully')
      } else {
        alert('Failed to delete module')
      }
    } catch (err) {
      console.error('Error deleting module:', err)
      alert('Error deleting module')
    }
  }

  // Filter modules based on active tab and user role
  const filteredModules = modules.filter(module => {
    if (isTeacher) {
      // Teacher tabs: 1=All, 2=Published, 3=Draft
      if (activeBtn === 1) return true // All modules
      if (activeBtn === 2) return module.is_published // Published
      if (activeBtn === 3) return !module.is_published // Draft
      return true
    } else {
      // Student tabs: 1=Unfinished, 2=Finished
      const moduleProgress = module.progress || 0
      if (activeBtn === 1) return moduleProgress < 100 // Unfinished
      if (activeBtn === 2) return moduleProgress >= 100 // Finished
      return true
    }
  })

  // Loading state while roles are being fetched
  if (!rolesLoaded) {
    return (
      <RootLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icon icon="line-md:loading-loop" className="text-6xl text-black mx-auto mb-4" />
            <p className="text-gray-600">Memuat peran...</p>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <Breadcrumps urls={urls} />

      {/* Teacher Header */}
      {isTeacher && (
        <div className="flex justify-between items-center mt-8 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Daftar Modul</h1>
            <p className="text-gray-600 mt-2">Kelola modul dan materi pembelajaran Anda</p>
          </div>
          <Link 
            to="/teacher/modules/create"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            <Icon icon="tabler:plus" className="text-xl" />
            Buat Modul Baru
          </Link>
        </div>
      )}

      {/* Tabs - Different for Teacher vs Student */}
      <div className="flex mt-8">
        {isTeacher ? (
          // Teacher Tabs
          <>
            <button 
              onClick={() => setActiveBtn(1)} 
              className={`${activeBtn === 1 ? "bg-white" : "bg-transparent"} hover:cursor-pointer px-6 py-2 rounded-md font-medium transition-colors`}
            >
              Semua Modul ({modules.length})
            </button>
            <button 
              onClick={() => setActiveBtn(2)} 
              className={`${activeBtn === 2 ? "bg-white" : "bg-transparent"} hover:cursor-pointer px-6 py-2 rounded-md font-medium transition-colors`}
            >
              Dipublikasi ({modules.filter(m => m.is_published).length})
            </button>
            <button 
              onClick={() => setActiveBtn(3)} 
              className={`${activeBtn === 3 ? "bg-white" : "bg-transparent"} hover:cursor-pointer px-6 py-2 rounded-md font-medium transition-colors`}
            >
              Draft ({modules.filter(m => !m.is_published).length})
            </button>
          </>
        ) : (
          // Student Tabs
          <>
            <button 
              onClick={() => setActiveBtn(1)} 
              className={`${activeBtn === 1 ? "bg-white" : "bg-transparent"} hover:cursor-pointer px-6 py-2 rounded-md`}
            >
              Belum Selesai
            </button>
            <button 
              onClick={() => setActiveBtn(2)} 
              className={`${activeBtn === 2 ? "bg-white" : "bg-transparent"} hover:cursor-pointer px-6 py-2 rounded-md`}
            >
              Sudah Selesai
            </button>
          </>
        )}
      </div>


      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-md mt-4 p-12 text-center">
          <Icon icon="svg-spinners:ring-resize" width={48} height={48} className="mx-auto text-gray-400" />
          <p className="text-gray-500 mt-4">Memuat modul...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-white rounded-md mt-4 p-12 text-center">
          <Icon icon="mdi:alert-circle-outline" width={48} height={48} className="mx-auto text-red-500" />
          <p className="text-red-500 mt-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredModules.length === 0 && (
        <div className="bg-white rounded-md mt-4 p-12 text-center">
          <Icon icon={isTeacher ? "tabler:book-off" : "mdi:book-open-outline"} width={48} height={48} className="mx-auto text-gray-400" />
          {isTeacher ? (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mt-4">Tidak ada modul</h3>
              <p className="text-gray-500 mt-2">
                {activeBtn === 1 
                  ? 'Buat modul pertama Anda untuk memulai' 
                  : `Belum ada modul ${activeBtn === 2 ? 'yang dipublikasi' : 'draft'}`}
              </p>
              {activeBtn === 1 && (
                <Link 
                  to="/teacher/modules/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium mt-6"
                >
                  <Icon icon="tabler:plus" className="text-xl" />
                  Buat Modul
                </Link>
              )}
            </>
          ) : (
            <p className="text-gray-500 mt-4">
              {activeBtn === 1 ? 'Belum ada modul yang belum selesai.' : 'Belum ada modul yang sudah selesai.'}
            </p>
          )}
        </div>
      )}

      {/* Modules List */}
      {!isLoading && !error && filteredModules.length > 0 && (
        <div className="bg-white rounded-md mt-4 p-1">
          {isStudent && (
            <div className="p-8">
              <Icon icon="streamline-plump:graduation-cap-solid" width={24} height={24} />
              <h1 className="mt-2 font-semibold text-gray-700 text-2xl">
                {activeBtn === 1 ? 'Modul Belum Selesai' : 'Modul Sudah Selesai'}
              </h1>
              <div className="flex items-center gap-2 mt-4">
                <Icon icon="mdi:book-multiple" width={20} height={20} className="text-gray-500" />
                <p className="text-gray-500">Total {filteredModules.length} modul</p>
              </div>
            </div>
          )}

          {/* Modules List */}
          <div className="space-y-0">
            {filteredModules.map((module, index) => {
              const completed = isModuleCompleted(module.progress)
              const lessonCount = module.lessons?.length || 0
              
              return (
                <div 
                  key={module.id} 
                  className={`group p-8 hover:bg-gray-50 transition-colors ${
                    isStudent ? 'border-t border-gray-200' : (index !== 0 ? 'border-t border-gray-200' : '')
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {/* Status Circle */}
                        <div className={`rounded-full size-[18px] transition-all ${
                          isStudent 
                            ? (completed 
                                ? 'bg-green-500 border-2 border-green-500' 
                                : 'border border-gray-400 group-hover:border-black')
                            : 'border border-gray-400 group-hover:border-black'
                        }`}>
                          {isStudent && completed && (
                            <Icon 
                              icon="mdi:check" 
                              width={14} 
                              height={14} 
                              className="text-white"
                            />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg text-gray-800">{module.title}</h3>
                            {/* Student: Show completion badge */}
                            {isStudent && completed && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                <Icon icon="mdi:check-circle" width={14} height={14} />
                                Selesai
                              </span>
                            )}
                            {/* Teacher: Show publish status */}
                            {isTeacher && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                module.is_published 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                {module.is_published ? 'Dipublikasi' : 'Draft'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:book-outline" width={16} height={16} />
                              <span>{lessonCount} materi</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:calendar-outline" width={16} height={16} />
                              <span>Deadline: {formatDate(module.deadline)}</span>
                            </div>
                            {/* Student: Show progress for unfinished modules */}
                            {isStudent && !completed && (
                              <div className="flex items-center gap-1">
                                <Icon icon="mdi:progress-clock" width={16} height={16} />
                                <span>{module.progress}% selesai</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {isTeacher ? (
                        // Teacher buttons: Detail, Edit, Delete
                        <>
                          <Link 
                            to={`/teacher/modules/${module.id}`}
                            className="group-hover:opacity-100 opacity-0 hover:cursor-pointer rounded-md bg-black text-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-800"
                          >
                            Detail Kelas
                          </Link>
                          <Link 
                            to={`/teacher/modules/${module.id}/edit`}
                            className="group-hover:opacity-100 opacity-0 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all text-sm"
                          >
                            <Icon icon="tabler:pencil" width={18} height={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(module.id, module.title)}
                            className="group-hover:opacity-100 opacity-0 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-all text-sm"
                          >
                            <Icon icon="tabler:trash" width={18} height={18} />
                          </button>
                        </>
                      ) : (
                        // Student button: View detail only
                        <Link 
                          to={`/student/modules/${module.id}/corridor`} 
                          className="group-hover:opacity-100 opacity-0 hover:cursor-pointer rounded-md bg-black text-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-800"
                        >
                          Lihat Detail
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </RootLayout>
  )
}
