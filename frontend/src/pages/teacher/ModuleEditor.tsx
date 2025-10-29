import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import RootLayout from '../../layouts/RootLayout'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'
import { getUser } from '../../utils/auth'

interface ModuleFormData {
  title: string
  description: string
  deadline: string
  cover_image: string
  is_published: boolean
}

export default function ModuleEditor() {
  const navigate = useNavigate()
  const { module_id } = useParams()
  const user = getUser()
  
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<ModuleFormData>({
    title: '',
    description: '',
    deadline: '',
    cover_image: '',
    is_published: false
  })

  // Fetch module data if editing
  useEffect(() => {
    if (module_id) {
      const fetchModule = async () => {
        try {
          const token = localStorage.getItem('access_token')
          const response = await fetch(`http://localhost:8000/api/modules/${module_id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (response.ok) {
            const data = await response.json()
            // Convert deadline to datetime-local format
            const deadlineDate = new Date(data.deadline)
            const formattedDeadline = deadlineDate.toISOString().slice(0, 16)
            
            setFormData({
              title: data.title,
              description: data.description || '',
              deadline: formattedDeadline,
              cover_image: data.cover_image || '',
              is_published: data.is_published
            })
          }
        } catch (error) {
          console.error('Error fetching module:', error)
        }
      }
      fetchModule()
    }
  }, [module_id])

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a module title')
      return
    }
    if (!formData.deadline) {
      alert('Please select a deadline')
      return
    }

    setIsSaving(true)
    try {
      const token = localStorage.getItem('access_token')
      
      // Prepare payload
      const payload = {
        title: formData.title,
        description: formData.description,
        deadline: new Date(formData.deadline).toISOString(),
        cover_image: formData.cover_image || null,
        is_published: formData.is_published,
        ...(module_id ? {} : { author: user?.id })
      }
      
      const url = module_id 
        ? `http://localhost:8000/api/modules/${module_id}/`
        : 'http://localhost:8000/api/modules/'
      
      const method = module_id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        alert('Module saved successfully!')
        navigate(`/teacher/modules/${data.id}`)
      } else {
        const error = await response.json()
        
        // Check if error is about exam requirement
        if (error.exam_required) {
          const moduleId = module_id || error.id
          if (confirm(`${error.error}\n\nApakah Anda ingin membuat ujian sekarang?`)) {
            navigate(`/teacher/modules/${moduleId}/lessons/create`)
          }
        } else {
          alert(`Error saving module: ${error.error || JSON.stringify(error)}`)
        }
      }
    } catch (error) {
      console.error('Error saving module:', error)
      alert('Failed to save module')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/teacher/modules')
    }
  }

  return (
    <RootLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            {module_id ? 'Edit Modul' : 'Buat Modul Baru'}
          </h2>
          <p className="text-gray-600 mt-2">
            {module_id ? 'Perbarui informasi dan pengaturan modul' : 'Buat modul pembelajaran baru untuk siswa Anda'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Judul Modul *
              </label>
              <Input
                type="text"
                placeholder="Masukkan judul modul"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Pilih judul yang jelas dan deskriptif untuk modul Anda
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Deskripsi
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                rows={4}
                placeholder="Masukkan deskripsi modul"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
              <p className="text-sm text-gray-500 mt-1">
                Berikan gambaran singkat tentang apa yang akan dipelajari siswa
              </p>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Batas Waktu *
              </label>
              <Input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Tetapkan batas waktu untuk menyelesaikan modul ini
              </p>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                URL Gambar Sampul
              </label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.cover_image}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
              />
              <p className="text-sm text-gray-500 mt-1">
                Opsional: Tambahkan URL gambar sampul untuk modul Anda
              </p>
              
              {/* Image Preview */}
              {formData.cover_image && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Pratinjau:</p>
                  <img 
                    src={formData.cover_image} 
                    alt="Cover preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.src = ''
                      e.currentTarget.classList.add('hidden')
                    }}
                  />
                </div>
              )}
            </div>

            {/* Published Status */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <label htmlFor="is_published" className="text-sm font-semibold cursor-pointer">
                  Publikasikan modul segera
                </label>
                <p className="text-sm text-gray-500">
                  {formData.is_published 
                    ? 'Modul akan terlihat oleh siswa' 
                    : 'Modul akan disimpan sebagai draft'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button 
            variant="secondary"
            onClick={handleCancel}
          >
            <Icon icon="tabler:x" className="text-xl" />
            Batal
          </Button>

          <div className="flex gap-4">
            <Button 
              variant="secondary"
              onClick={() => {
                setFormData(prev => ({ ...prev, is_published: false }))
                setTimeout(handleSave, 100)
              }}
              disabled={isSaving}
            >
              <Icon icon="tabler:device-floppy" className="text-xl" />
              Simpan sebagai Draft
            </Button>
            <Button 
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || !formData.title || !formData.deadline}
            >
              <Icon icon="tabler:check" className="text-xl" />
              {isSaving ? 'Menyimpan...' : (module_id ? 'Perbarui Modul' : 'Buat Modul')}
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Icon icon="tabler:info-circle" className="text-xl" />
            Tips Membuat Modul
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <Icon icon="tabler:check" className="text-lg mt-0.5 flex-shrink-0" />
              <span>Pilih judul yang jelas dan deskriptif yang mencerminkan tujuan pembelajaran</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon icon="tabler:check" className="text-lg mt-0.5 flex-shrink-0" />
              <span>Tulis deskripsi singkat yang menyoroti topik utama dan hasil pembelajaran</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon icon="tabler:check" className="text-lg mt-0.5 flex-shrink-0" />
              <span>Tetapkan batas waktu yang realistis dengan mempertimbangkan kompleksitas modul</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon icon="tabler:check" className="text-lg mt-0.5 flex-shrink-0" />
              <span>Gunakan gambar sampul berkualitas tinggi untuk membuat modul lebih menarik</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon icon="tabler:check" className="text-lg mt-0.5 flex-shrink-0" />
              <span>Simpan sebagai draft untuk meninjau sebelum dipublikasikan ke siswa</span>
            </li>
          </ul>
        </div>
      </div>
    </RootLayout>
  )
}
