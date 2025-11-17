import React, { useState } from 'react'
import Button from './atoms/Button'

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onImageSelected: (url: string | null) => void
}

export default function ImageUploadModal({ isOpen, onClose, onImageSelected }: ImageUploadModalProps) {
  const [uploadMethod, setUploadMethod] = useState<'local' | 'url'>('local')
  const [imageUrl, setImageUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        onImageSelected(data.url)
        onClose()
      } else {
        setError(data.error || 'Gagal mengunggah gambar')
      }
    } catch (err) {
      setError('Gagal mengunggah gambar')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (!imageUrl || imageUrl.trim() === '') {
      setError('Silakan masukkan URL gambar')
      return
    }

    try {
      new URL(imageUrl)
      onImageSelected(imageUrl)
      onClose()
    } catch (err) {
      setError('Silakan masukkan URL yang valid')
      return
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sisipkan Gambar</h3>
          
          <div className="mb-4">
            <div className="flex border-b">
              <button
                className={`py-2 px-4 font-medium ${uploadMethod === 'local' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                onClick={() => setUploadMethod('local')}
              >
                Unggah dari Komputer
              </button>
              <button
                className={`py-2 px-4 font-medium ${uploadMethod === 'url' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                onClick={() => setUploadMethod('url')}
              >
                Gunakan URL Gambar
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {uploadMethod === 'local' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih file gambar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-100 file:text-gray-700
                  hover:file:bg-gray-200"
              />
              {isUploading && (
                <p className="text-sm text-gray-500 mt-2">Mengunggah...</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Format yang didukung: JPG, PNG, GIF, WebP (Maks 5MB)
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Gambar
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Masukkan URL langsung ke gambar Anda
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={onClose}>
              Batal
            </Button>
            {uploadMethod === 'url' && (
              <Button variant="primary" onClick={handleUrlSubmit}>
                Sisipkan Gambar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}