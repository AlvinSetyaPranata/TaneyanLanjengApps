import { Icon } from "@iconify/react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DetailLayout from "../../layouts/DetailLayout"
import { getUser } from "../../utils/auth"

interface Module {
  id: number
  title: string
  description: string
  deadline: string
  author: number
  author_name: string
  cover_image: string | null
  is_published: boolean
  lessons_count: number
  date_created: string
  date_updated: string
}

export default function TeacherModules() {
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all')

  const user = getUser()

  // Fetch teacher's modules
  useEffect(() => {
    async function loadModules() {
      try {
        setIsLoading(true)
        setError(null)
        const token = localStorage.getItem('access_token')
        
        // Use modules overview endpoint which includes lessons_count
        const response = await fetch(`${API_BASE_URL}(`${API_BASE_URL}/modules/overview`), {`)
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Filter only modules created by this teacher
          const allModules = data.modules || []
          const teacherModules = allModules.map((m: any) => ({
            ...m,
            lessons_count: m.lessons ? m.lessons.length : 0
          })).filter((m: Module) => m.author === user?.id)
          setModules(teacherModules)
        } else {
          setError('Failed to load modules')
        }
      } catch (err) {
        console.error('Error fetching modules:', err)
        setError('Error loading modules. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadModules()
  }, [user?.id])

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Delete module
  const handleDelete = async (moduleId: number, moduleName: string) => {
    if (!confirm(`Are you sure you want to delete "${moduleName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:8000/api/modules/${moduleId}/`, {
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

  // Filter modules based on active tab
  const filteredModules = modules.filter(module => {
    if (activeTab === 'published') return module.is_published
    if (activeTab === 'draft') return !module.is_published
    return true
  })

  return (
    <DetailLayout title="Kelola Modul">
      <div className="px-20 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'all' 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Semua Modul ({modules.length})
          </button>
          <button 
            onClick={() => setActiveTab('published')} 
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'published' 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Dipublikasi ({modules.filter(m => m.is_published).length})
          </button>
          <button 
            onClick={() => setActiveTab('draft')} 
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'draft' 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Draft ({modules.filter(m => !m.is_published).length})
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg p-12 text-center">
            <Icon icon="svg-spinners:ring-resize" className="text-6xl text-gray-400 mx-auto" />
            <p className="text-gray-500 mt-4">Memuat modul...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-white rounded-lg p-12 text-center">
            <Icon icon="mdi:alert-circle-outline" className="text-6xl text-red-500 mx-auto" />
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
          <div className="bg-white rounded-lg p-12 text-center">
            <Icon icon="tabler:book-off" className="text-6xl text-gray-400 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-700 mt-4">Tidak ada modul</h3>
            <p className="text-gray-500 mt-2">
              {activeTab === 'all' 
                ? 'Buat modul pertama Anda untuk memulai' 
                : `Belum ada modul ${activeTab === 'published' ? 'yang dipublikasi' : 'draft'}`}
            </p>
            {activeTab === 'all' && (
              <Link 
                to="/teacher/modules/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium mt-6"
              >
                <Icon icon="tabler:plus" className="text-xl" />
                Buat Modul
              </Link>
            )}
          </div>
        )}

        {/* Modules List */}
        {!isLoading && !error && filteredModules.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            {filteredModules.map((module, index) => (
              <div 
                key={module.id} 
                className={`group p-8 hover:bg-gray-50 transition-colors ${index !== 0 ? 'border-t border-gray-200' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-full size-[18px] border border-gray-400 group-hover:border-black transition-all" />
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-gray-800">{module.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            module.is_published 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {module.is_published ? 'Dipublikasi' : 'Draft'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Icon icon="mdi:book-outline" width={16} height={16} />
                            <span>{module.lessons_count} materi</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon icon="mdi:calendar-outline" width={16} height={16} />
                            <span>Deadline: {formatDate(module.deadline)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DetailLayout>
  )
}
