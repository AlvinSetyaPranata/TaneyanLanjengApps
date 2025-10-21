import { Icon } from "@iconify/react"
import { useState, useEffect } from "react"
import Breadcrumps from "../../components/atoms/Breadcrumps"
import { Link } from "react-router-dom"
import RootLayout from "../../layouts/RootLayout"
import { fetchModulesOverview } from "../../utils/api"
import type { Module } from "../../types/modules"


export default function Modules() {
  const [activeBtn, setActiveBtn] = useState(1)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const urls = [
    {
      title: "Modul Kelas",
      url: "/modules"
    },
  ]

  // Fetch modules on component mount
  useEffect(() => {
    async function loadModules() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchModulesOverview()
        setModules(data.modules)
      } catch (err) {
        console.error('Error fetching modules:', err)
        setError('/api/modules/overview/api/modules/overview memuat data modul. Silakan coba lagi.')
      } finally {
        setIsLoading(false)
      }
    }

    loadModules()
  }, [])

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
  const isModuleCompleted = (progress: number) => progress >= 100

  // Filter modules based on active tab
  const filteredModules = modules.filter(module => {
    if (activeBtn === 1) {
      // Show modules in progress (not completed)
      return module.progress < 100
    } else {
      // Show completed modules
      return module.progress >= 100
    }
  })

  return (
    <RootLayout>
      {/* <h1 className="text-gray-400">Modul Kelas</h1> */}
      <Breadcrumps urls={urls} />

      <div className="flex mt-8">
        <button onClick={() => setActiveBtn(1)} className={`${activeBtn == 1 ? "bg-white" : "bg-transparent"} hover:cursor-pointer px-6 py-2 rounded-md`}>Modul yang dipelajari</button>
        <button onClick={() => setActiveBtn(2)} className={`${activeBtn == 2 ? "bg-white" : "bg-transparent"} hover:cursor-pointer px-6 py-2 rounded-md`}>Modul yang terselesaikan</button>
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

      {/* Modules List */}
      {!isLoading && !error && filteredModules.length === 0 && (
        <div className="bg-white rounded-md mt-4 p-12 text-center">
          <Icon icon="mdi:book-open-outline" width={48} height={48} className="mx-auto text-gray-400" />
          <p className="text-gray-500 mt-4">
            {activeBtn === 1 ? 'Belum ada modul yang sedang dipelajari.' : 'Belum ada modul yang terselesaikan.'}
          </p>
        </div>
      )}

      {!isLoading && !error && filteredModules.length > 0 && (
        <div className="bg-white rounded-md mt-4 p-1">
          <div className="p-8">
            <Icon icon="streamline-plump:graduation-cap-solid" width={24} height={24} />
            <h1 className="mt-2 font-semibold text-gray-700 text-2xl">
              {activeBtn === 1 ? 'Modul yang Dipelajari' : 'Modul yang Terselesaikan'}
            </h1>
            <div className="flex items-center gap-2 mt-4">
              <Icon icon="mdi:book-multiple" width={20} height={20} className="text-gray-500" />
              <p className="text-gray-500">Total {filteredModules.length} modul</p>
            </div>
          </div>

          {/* Modules List */}
          <div className="space-y-0">
            {filteredModules.map((module) => {
              const completed = isModuleCompleted(module.progress)
              
              return (
                <div 
                  key={module.id} 
                  className="group border-t border-gray-200 p-8 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {/* Status Circle - Green if completed, Gray if not */}
                        <div className={`rounded-full size-[18px] transition-all ${
                          completed 
                            ? 'bg-green-500 border-2 border-green-500' 
                            : 'border border-gray-400 group-hover:border-black'
                        }`}>
                          {completed && (
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
                            {completed && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                <Icon icon="mdi:check-circle" width={14} height={14} />
                                Selesai
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:book-outline" width={16} height={16} />
                              <span>{module.lessons.length} materi</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:calendar-outline" width={16} height={16} />
                              <span>Deadline: {formatDate(module.deadline)}</span>
                            </div>
                            {!completed && (
                              <div className="flex items-center gap-1">
                                <Icon icon="mdi:progress-clock" width={16} height={16} />
                                <span>{module.progress}% selesai</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link 
                      to={`/modules/${module.id}/corridor`} 
                      className="group-hover:opacity-100 opacity-0 hover:cursor-pointer rounded-md bg-black text-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-800"
                    >
                      Detail Kelas
                    </Link>
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
