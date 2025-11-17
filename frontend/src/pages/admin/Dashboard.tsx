import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import RootLayout from '../../layouts/RootLayout'
import Button from '../../components/atoms/Button'
import { authFetch } from '../../utils/auth'

interface User {
  id: number
  username: string
  email: string
  full_name: string
  institution: string
  semester: number
  role: {
    id: number
    name: string
  }
  date_registered: string
}

interface Module {
  id: number
  title: string
  description: string
  author: {
    id: number
    username: string
    full_name: string
  }
  is_published: boolean
  date_created: string
}

interface Headline {
  id: number
  title: string
  url: string
}

interface AdminStats {
  total_users: number
  total_teachers: number
  total_students: number
  total_modules: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [headlines, setHeadlines] = useState<Headline[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showUserModal, setShowUserModal] = useState(false)
  const [showHeadlineModal, setShowHeadlineModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingHeadline, setEditingHeadline] = useState<Headline | null>(null)

  // Form states
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    full_name: '',
    institution: '',
    semester: 0,
    role: 2, // Default to student
    password: ''
  })
  
  const [headlineForm, setHeadlineForm] = useState({
    title: '',
    url: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    user_id: 0,
    new_password: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch admin stats
      const statsResponse = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/stats`)
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      // Fetch users
      const usersResponse = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users`)
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users)
      }

      // Fetch modules
      const modulesResponse = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/modules`)
      if (modulesResponse.ok) {
        const modulesData = await modulesResponse.json()
        setModules(modulesData.modules)
      }

      // Fetch headlines
      const headlinesResponse = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/headlines`)
      if (headlinesResponse.ok) {
        const headlinesData = await headlinesResponse.json()
        setHeadlines(headlinesData.headlines)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userForm)
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        setShowUserModal(false)
        resetUserForm()
        fetchDashboardData()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user')
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingUser) return
    
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${editingUser.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userForm)
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        setShowUserModal(false)
        setEditingUser(null)
        resetUserForm()
        fetchDashboardData()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${userId}/delete`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        fetchDashboardData()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${passwordForm.user_id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_password: passwordForm.new_password })
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        setPasswordForm({ user_id: 0, new_password: '' })
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Error changing password')
    }
  }

  const handleDeleteModule = async (moduleId: number) => {
    if (!window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) return
    
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/modules/${moduleId}/delete`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        fetchDashboardData()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete module')
      }
    } catch (error) {
      console.error('Error deleting module:', error)
      alert('Error deleting module')
    }
  }

  const handleCreateHeadline = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/headlines/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(headlineForm)
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        setShowHeadlineModal(false)
        resetHeadlineForm()
        fetchDashboardData()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to create headline')
      }
    } catch (error) {
      console.error('Error creating headline:', error)
      alert('Error creating headline')
    }
  }

  const handleUpdateHeadline = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingHeadline) return
    
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/headlines/${editingHeadline.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(headlineForm)
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        setShowHeadlineModal(false)
        setEditingHeadline(null)
        resetHeadlineForm()
        fetchDashboardData()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to update headline')
      }
    } catch (error) {
      console.error('Error updating headline:', error)
      alert('Error updating headline')
    }
  }

  const handleDeleteHeadline = async (headlineId: number) => {
    if (!window.confirm('Are you sure you want to delete this headline?')) return
    
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/headlines/${headlineId}/delete`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        fetchDashboardData()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete headline')
      }
    } catch (error) {
      console.error('Error deleting headline:', error)
      alert('Error deleting headline')
    }
  }

  const resetUserForm = () => {
    setUserForm({
      username: '',
      email: '',
      full_name: '',
      institution: '',
      semester: 0,
      role: 2,
      password: ''
    })
  }

  const resetHeadlineForm = () => {
    setHeadlineForm({
      title: '',
      url: ''
    })
  }

  const openEditUserModal = (user: User) => {
    setEditingUser(user)
    setUserForm({
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      institution: user.institution,
      semester: user.semester,
      role: user.role.id,
      password: ''
    })
    setShowUserModal(true)
  }

  const openEditHeadlineModal = (headline: Headline) => {
    setEditingHeadline(headline)
    setHeadlineForm({
      title: headline.title,
      url: headline.url
    })
    setShowHeadlineModal(true)
  }

  if (loading) {
    return (
      <RootLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon icon="line-md:loading-loop" className="text-6xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat dasbor admin...</p>
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
            <h1 className="text-3xl font-bold">Dasbor Admin</h1>
            <p className="text-gray-600 mt-2">Kelola pengguna, modul, dan berita</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dasbor
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pengguna
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'modules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Modul
            </button>
            <button
              onClick={() => setActiveTab('headlines')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'headlines'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Berita
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Icon icon="mdi:account-group" className="text-blue-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
                    <p className="text-2xl font-semibold">{stats?.total_users || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <Icon icon="mdi:teacher" className="text-green-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pengajar</p>
                    <p className="text-2xl font-semibold">{stats?.total_teachers || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <Icon icon="mdi:account-school" className="text-purple-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Siswa</p>
                    <p className="text-2xl font-semibold">{stats?.total_students || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Icon icon="mdi:book-open-page-variant" className="text-yellow-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Modul</p>
                    <p className="text-2xl font-semibold">{stats?.total_modules || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Aktivitas Terbaru</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon icon="mdi:account-plus" className="text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Manajemen Pengguna</p>
                    <p className="text-sm text-gray-500">Kelola siswa dan pengajar</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Icon icon="mdi:book-plus" className="text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Manajemen Modul</p>
                    <p className="text-sm text-gray-500">Buat dan kelola modul pembelajaran</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Icon icon="mdi:newspaper" className="text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Manajemen Berita</p>
                    <p className="text-sm text-gray-500">Perbarui berita dan pengumuman</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
              <Button 
                variant="primary" 
                onClick={() => {
                  setEditingUser(null)
                  resetUserForm()
                  setShowUserModal(true)
                }}
              >
                <Icon icon="tabler:plus" className="text-xl" />
                Tambah Pengguna
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peran
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institusi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Terdaftar
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role.name === 'Teacher' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role.name === 'Teacher' ? 'Pengajar' : 'Siswa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.institution}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.date_registered).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditUserModal(user)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manajemen Modul</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modul
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penulis
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dibuat
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {modules.map((module) => (
                    <tr key={module.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{module.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{module.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {module.author.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          module.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {module.is_published ? 'Dipublikasi' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(module.date_created).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteModule(module.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Headlines Tab */}
        {activeTab === 'headlines' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manajemen Berita</h2>
              <Button 
                variant="primary" 
                onClick={() => {
                  setEditingHeadline(null)
                  resetHeadlineForm()
                  setShowHeadlineModal(true)
                }}
              >
                <Icon icon="tabler:plus" className="text-xl" />
                Tambah Berita
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Berita
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {headlines.map((headline) => (
                    <tr key={headline.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{headline.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {headline.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditHeadlineModal(headline)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHeadline(headline.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                </h3>
              </div>
              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input
                      type="text"
                      value={userForm.full_name}
                      onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Pengguna</label>
                    <input
                      type="text"
                      value={userForm.username}
                      onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Institusi</label>
                    <input
                      type="text"
                      value={userForm.institution}
                      onChange={(e) => setUserForm({...userForm, institution: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Peran</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value={2}>Siswa</option>
                      <option value={3}>Pengajar</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Semester</label>
                    <input
                      type="number"
                      value={userForm.semester}
                      onChange={(e) => setUserForm({...userForm, semester: parseInt(e.target.value) || 0})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="1"
                      max="12"
                    />
                  </div>
                  
                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required={!editingUser}
                      />
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                      setShowUserModal(false)
                      setEditingUser(null)
                      resetUserForm()
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingUser ? 'Perbarui Pengguna' : 'Buat Pengguna'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Headline Modal */}
        {showHeadlineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingHeadline ? 'Edit Berita' : 'Tambah Berita Baru'}
                </h3>
              </div>
              <form onSubmit={editingHeadline ? handleUpdateHeadline : handleCreateHeadline}>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Judul</label>
                    <input
                      type="text"
                      value={headlineForm.title}
                      onChange={(e) => setHeadlineForm({...headlineForm, title: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL</label>
                    <input
                      type="text"
                      value={headlineForm.url}
                      onChange={(e) => setHeadlineForm({...headlineForm, url: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                      setShowHeadlineModal(false)
                      setEditingHeadline(null)
                      resetHeadlineForm()
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingHeadline ? 'Perbarui Berita' : 'Buat Berita'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {passwordForm.user_id > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Ubah Kata Sandi</h3>
              </div>
              <form onSubmit={handleChangePassword}>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kata Sandi Baru</label>
                    <input
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setPasswordForm({ user_id: 0, new_password: '' })}
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="primary">
                    Ubah Kata Sandi
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RootLayout>
  )
}