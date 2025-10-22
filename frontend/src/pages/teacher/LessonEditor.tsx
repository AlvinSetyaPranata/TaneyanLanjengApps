import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Icon } from '@iconify/react'
import RootLayout from '../../layouts/RootLayout'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'
import Select from '../../components/atoms/Select'


interface LessonFormData {
  title: string
  content: string
  lesson_type: 'lesson' | 'exam'
  order: number
  duration_minutes: number
  is_published: boolean
  module_id: number
}

interface ModuleWithExamInfo {
  id: number
  title: string
  has_exam: boolean
  exam_count: number
}

export default function LessonEditor() {
  const navigate = useNavigate()
  const { module_id, lesson_id } = useParams()
  
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [modules, setModules] = useState<ModuleWithExamInfo[]>([])
  const [currentModule, setCurrentModule] = useState<ModuleWithExamInfo | null>(null)
  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    content: '# Write your lesson content here\n\nStart typing...',
    lesson_type: 'lesson',
    order: 1,
    duration_minutes: 30,
    is_published: false,
    module_id: module_id ? parseInt(module_id) : 0
  })

  // Fetch modules for dropdown
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch('http://localhost:8000/api/modules/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setModules(data)
          
          // If creating a new lesson for a specific module, check if it needs an exam
          if (module_id && !lesson_id) {
            const selectedModule = data.find((m: ModuleWithExamInfo) => m.id === parseInt(module_id))
            setCurrentModule(selectedModule || null)
            
            // If module has no exam, default to exam type
            if (selectedModule && !selectedModule.has_exam) {
              setFormData(prev => ({
                ...prev,
                lesson_type: 'exam',
                title: 'Ujian Akhir',
                duration_minutes: 60
              }))
            }
          }
        }
      } catch (error) {
        console.error('Error fetching modules:', error)
      }
    }
    fetchModules()
  }, [module_id, lesson_id])

  // Fetch lesson data if editing
  useEffect(() => {
    if (lesson_id) {
      const fetchLesson = async () => {
        try {
          const token = localStorage.getItem('access_token')
          const response = await fetch(`http://localhost:8000/api/lessons/${lesson_id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (response.ok) {
            const data = await response.json()
            setFormData({
              title: data.title,
              content: data.content,
              lesson_type: data.lesson_type,
              order: data.order,
              duration_minutes: data.duration_minutes,
              is_published: data.is_published,
              module_id: data.module_id
            })
          }
        } catch (error) {
          console.error('Error fetching lesson:', error)
        }
      }
      fetchLesson()
    }
  }, [lesson_id])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('access_token')
      const url = lesson_id 
        ? `http://localhost:8000/api/lessons/${lesson_id}/`
        : 'http://localhost:8000/api/lessons/'
      
      const method = lesson_id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Lesson saved successfully!')
        navigate(`/teacher/modules/${formData.module_id}`)
      } else {
        const error = await response.json()
        alert(`Error saving lesson: ${JSON.stringify(error)}`)
      }
    } catch (error) {
      console.error('Error saving lesson:', error)
      alert('Failed to save lesson')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate(-1)
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      const imageMarkdown = `\n![Image description](${url})\n`
      setFormData(prev => ({
        ...prev,
        content: prev.content + imageMarkdown
      }))
    }
  }

  const insertTable = () => {
    const tableMarkdown = `\n| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |\n`
    setFormData(prev => ({
      ...prev,
      content: prev.content + tableMarkdown
    }))
  }

  const insertCodeBlock = () => {
    const codeMarkdown = `\n\`\`\`javascript
// Your code here
console.log('Hello, World!')
\`\`\`\n`
    setFormData(prev => ({
      ...prev,
      content: prev.content + codeMarkdown
    }))
  }

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Exam Required Warning */}
        {currentModule && !currentModule.has_exam && formData.lesson_type !== 'exam' && (
          <div className="mb-6 bg-gray-100 border-l-4 border-gray-600 p-5 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:alert" className="text-2xl text-gray-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Modul ini belum memiliki ujian akhir
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  Sebelum membuat materi biasa, pastikan Anda membuat <strong>ujian akhir</strong> terlebih dahulu. 
                  Modul tidak dapat dipublikasikan tanpa minimal 1 ujian.
                </p>
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      lesson_type: 'exam',
                      title: 'Ujian Akhir',
                      duration_minutes: 60
                    }))
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Icon icon="mdi:clipboard-check" />
                  Ubah ke Tipe Ujian
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            {lesson_id ? 'Edit Lesson' : 'Create New Lesson'}
          </h2>
          <p className="text-gray-600 mt-2">
            {formData.lesson_type === 'exam' ? 'Create an exam for students' : 'Create engaging lesson content with markdown'}
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Lesson Title *</label>
              <Input
                type="text"
                placeholder="Enter lesson title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Module Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">Module *</label>
              <Select
                value={formData.module_id.toString()}
                onChange={(e) => {
                  const moduleId = parseInt(e.target.value)
                  setFormData(prev => ({ ...prev, module_id: moduleId }))
                  
                  // Update current module and suggest exam if needed
                  const selected = modules.find(m => m.id === moduleId)
                  setCurrentModule(selected || null)
                  
                  if (selected && !selected.has_exam && !lesson_id) {
                    if (confirm('Modul ini belum memiliki ujian akhir. Apakah Anda ingin membuat ujian sekarang?')) {
                      setFormData(prev => ({
                        ...prev,
                        lesson_type: 'exam',
                        title: 'Ujian Akhir',
                        duration_minutes: 60
                      }))
                    }
                  }
                }}
                options={[
                  { value: 0, label: 'Select a module' },
                  ...modules.map(module => ({ value: module.id, label: module.title }))
                ]}
                required
              />
            </div>

            {/* Lesson Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">Type *</label>
              <Select
                value={formData.lesson_type}
                onChange={(e) => setFormData(prev => ({ ...prev, lesson_type: e.target.value as 'lesson' | 'exam' }))}
                options={[
                  { value: 'lesson', label: 'Lesson' },
                  { value: 'exam', label: 'Final Exam' }
                ]}
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-semibold mb-2">Order *</label>
              <Input
                type="number"
                min="1"
                value={formData.order.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold mb-2">Duration (minutes) *</label>
              <Input
                type="number"
                min="1"
                value={formData.duration_minutes.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                required
              />
            </div>

            {/* Published Status */}
            <div className="flex items-center gap-x-3">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_published" className="text-sm font-semibold">
                Publish immediately
              </label>
            </div>
          </div>
        </div>

        {/* Editor Toolbar */}
        <div className="bg-white rounded-t-lg shadow-md p-4 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={insertImage}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                title="Insert Image"
              >
                <Icon icon="tabler:photo" className="text-xl" />
                <span className="text-sm font-medium">Image</span>
              </button>
              <button
                onClick={insertTable}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                title="Insert Table"
              >
                <Icon icon="tabler:table" className="text-xl" />
                <span className="text-sm font-medium">Table</span>
              </button>
              <button
                onClick={insertCodeBlock}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                title="Sisipkan Kode"
              >
                <Icon icon="tabler:code" className="text-xl" />
                <span className="text-sm font-medium">Kode</span>
              </button>
            </div>

            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isPreview 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Icon icon={isPreview ? "tabler:pencil" : "tabler:eye"} className="text-xl" />
              <span className="text-sm font-semibold">
                {isPreview ? 'Mode Edit' : 'Mode Pratinjau'}
              </span>
            </button>
          </div>
        </div>

        {/* Editor/Preview Section */}
        <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
          {isPreview ? (
            // Preview Mode
            <div className="p-8 min-h-[500px] markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {formData.content}
              </ReactMarkdown>
            </div>
          ) : (
            // Edit Mode
            <div data-color-mode="light">
              <MDEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                height={500}
                preview="edit"
                hideToolbar={false}
                enableScroll={true}
                visibleDragbar={true}
              />
            </div>
          )}
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
              onClick={() => setFormData(prev => ({ ...prev, is_published: false }))}
              disabled={isSaving}
            >
              <Icon icon="tabler:device-floppy" className="text-xl" />
              Simpan sebagai Draft
            </Button>
            <Button 
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || !formData.title || !formData.module_id}
            >
              <Icon icon="tabler:check" className="text-xl" />
              {isSaving ? 'Menyimpan...' : (lesson_id ? 'Perbarui Materi' : 'Buat Materi')}
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-50 border border-gray-300 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon icon="tabler:info-circle" className="text-xl" />
            Tips Markdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
            <div>
              <p><strong># Heading 1</strong> - Judul utama</p>
              <p><strong>## Heading 2</strong> - Judul bagian</p>
              <p><strong>**teks tebal**</strong> - Teks tebal</p>
              <p><strong>*teks miring*</strong> - Teks miring</p>
            </div>
            <div>
              <p><strong>[link](url)</strong> - Hyperlink</p>
              <p><strong>![alt](url)</strong> - Gambar</p>
              <p><strong>- item</strong> - Daftar bullet</p>
              <p><strong>1. item</strong> - Daftar bernomor</p>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}
