import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import RootLayout from '../../layouts/RootLayout'
import DashboardCard from '../../components/atoms/DashboardCard'
import Button from '../../components/atoms/Button'

interface TeacherStats {
  total_modules: number
  total_lessons: number
  total_students_enrolled: number
  last_module: {
    id: number
    title: string
    description: string
    cover_image: string
    date_created: string
    lessons_count: number
    is_published: boolean
  } | null
  monthly_activity: Array<{
    month: string
    modules_created: number
    lessons_created: number
  }>
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<TeacherStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch('http://localhost:8000/api/teacher/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Error fetching teacher stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <RootLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon icon="line-md:loading-loop" className="text-6xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat dasbor...</p>
          </div>
        </div>
      </RootLayout>
    )
  }

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dasbor Pengajar</h1>
            <p className="text-gray-600 mt-2">Kelola modul Anda dan lacak aktivitas mengajar</p>
          </div>
          <div className="flex gap-3">
            <Link to="/teacher/modules/create">
              <Button variant="secondary">
                <Icon icon="tabler:plus" className="text-xl" />
                Modul Baru
              </Button>
            </Link>
            <Link to="/teacher/lessons/create">
              <Button variant="primary">
                <Icon icon="tabler:pencil-plus" className="text-xl" />
                Materi Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Modul"
            content={stats?.total_modules.toString() || '0'}
            iconName="tabler:books"
          />
          <DashboardCard
            title="Total Materi"
            content={stats?.total_lessons.toString() || '0'}
            iconName="tabler:file-text"
          />
          <DashboardCard
            title="Siswa Terdaftar"
            content={stats?.total_students_enrolled.toString() || '0'}
            iconName="tabler:users"
          />
        </div>

        {/* Last Module Created */}
        {stats?.last_module && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Modul yang Baru Dibuat</h2>
              <Link 
                to={`/teacher/modules/${stats.last_module.id}/edit`}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Edit</span>
                <Icon icon="tabler:pencil" />
              </Link>
            </div>
            <div className="flex gap-6">
              {stats.last_module.cover_image && (
                <img 
                  src={stats.last_module.cover_image} 
                  alt={stats.last_module.title}
                  className="w-48 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{stats.last_module.title}</h3>
                <p className="text-gray-600 mb-4">{stats.last_module.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Icon icon="tabler:file-text" />
                    {stats.last_module.lessons_count} materi
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="tabler:calendar" />
                    {new Date(stats.last_module.date_created).toLocaleDateString()}
                  </span>
                  <span className={`flex items-center gap-1 ${stats.last_module.is_published ? 'text-green-600' : 'text-orange-600'}`}>
                    <Icon icon={stats.last_module.is_published ? "tabler:eye" : "tabler:eye-off"} />
                    {stats.last_module.is_published ? 'Dipublikasi' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Activity */}
        {stats?.monthly_activity && stats.monthly_activity.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Aktivitas Bulanan (6 Bulan Terakhir)</h2>
            <div className="space-y-4">
              {stats.monthly_activity.map((activity) => (
                <div key={activity.month} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-gray-700">
                    {new Date(activity.month + '-01').toLocaleDateString('id-ID', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Modul</span>
                      <span className="text-lg font-bold text-blue-600">{activity.modules_created}</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Materi</span>
                      <span className="text-lg font-bold text-green-600">{activity.lessons_created}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Activity Message */}
        {(!stats?.monthly_activity || stats.monthly_activity.length === 0) && (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <Icon icon="tabler:book-off" className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Aktivitas</h3>
            <p className="text-gray-500 mb-6">Mulai buat modul dan materi untuk melihat aktivitas Anda di sini</p>
            <Link to="/teacher/lessons/create">
              <Button variant="primary">
                <Icon icon="tabler:pencil-plus" className="text-xl" />
                Buat Materi Pertama Anda
              </Button>
            </Link>
          </div>
        )}
      </div>
    </RootLayout>
  )
}
