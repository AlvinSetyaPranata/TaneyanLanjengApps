import { Icon } from "@iconify/react";
import DetailLayout from "../../layouts/DetailLayout";
import { useState, useEffect } from "react";
import Dropdown from "../../components/atoms/Dropdown";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';



export default function Lesson() {

  const [sidebarStatus, setSidebarStatus] = useState(true)
  const [markdownContent, setMarkdownContent] = useState('')

  // Load markdown file
  useEffect(() => {
    fetch('/content/glossarium.md')
      .then((response) => response.text())
      .then((text) => setMarkdownContent(text))
      .catch((error) => console.error('Error loading markdown:', error))
  }, [])
  
  const persiapanBelajarItems = [
    {
      title: "Persiapan Belajar",
      url: "/persiapan-belajar",
      isFinished: true
    }
  ]

  const pengantarAWSItems = [
    {
      title: "Pengantar ke Amazon Web Services",
      url: "/pengantar-aws",
      isFinished: true
    }
  ]

  const komputasiCloudItems = [
    {
      title: "Pengantar Komputasi di Cloud",
      url: "/pengantar-komputasi",
      isFinished: false,
      children: [
        {
          title: "Tipe Instance Amazon EC2",
          url: "/tipe-instance-ec2",
          isFinished: false
        },
        {
          title: "Harga Amazon EC2",
          url: "/harga-ec2",
          isFinished: false
        },
        {
          title: "Penyesuaian Kapasitas Amazon EC2",
          url: "/penyesuaian-kapasitas",
          isFinished: false
        }
      ]
    }
  ]

  return (
    <DetailLayout title="Pendidikan Aswaja">
        <div className="flex min-h-screen relative">
          {/* Floating toggle button when sidebar is collapsed */}
          {!sidebarStatus && (
            <button
              onClick={() => setSidebarStatus(true)}
              className="fixed right-6 top-24 bg-black rounded-full p-2 hover:bg-gray-800 transition-colors shadow-lg z-50"
            >
              <Icon icon="line-md:chevron-left" className="text-white text-xl" />
            </button>
          )}

          {/* content */}
          <div className={`flex-1 px-20 py-8 transition-all duration-300 ${
            sidebarStatus ? 'mr-0' : 'mr-0'
          }`}>
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-x-4 text-gray-600 text-sm mb-6">
                <span>📚 Modul 3</span>
                <span>•</span>
                <span>⏱️ 15 menit</span>
                <span>•</span>
                <span>📅 Diperbarui 12 Okt 2025</span>
              </div>
            </div>

            {/* Markdown Content */}
            <article className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
            </article>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
              <button className="flex items-center gap-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Icon icon="tabler:arrow-left" className="text-xl" />
                <span className="font-semibold">Sebelumnya</span>
              </button>
              <button className="flex items-center gap-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <span className="font-semibold">Selanjutnya</span>
                <Icon icon="tabler:arrow-right" className="text-xl" />
              </button>
            </div>
          </div>
          {/* content */}

          {/* sidebar */}
          <div className={`border-l border-gray-200 py-8 flex-shrink-0 transition-all duration-300 ${
            sidebarStatus ? 'w-[300px]' : 'w-0 border-l-0 overflow-hidden'
          }`}>
            <div className="w-[300px] px-4">
              <button 
                onClick={() => setSidebarStatus(state => !state)} 
                className="bg-black rounded-full p-2 hover:cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <Icon icon={`line-md:chevron-${sidebarStatus ? 'right' : 'left'}`} className="text-white text-xl" />
              </button>
            </div>
            <div className="w-[300px] border-b border-t border-gray-300 bg-gray-50 mt-8 py-6 px-4">
              {/* line progres */}
              <div className="w-full rounded-full h-[5px] bg-gray-300">
                <div className="h-full w-[25%] bg-green-500 rounded-full"></div>
              </div>
              <p className="mt-2">12% Selesai</p>
              {/* line progres */}
            </div>

            <div className="w-[300px] flex flex-col gap-y-4 p-4">
              <Dropdown items={persiapanBelajarItems} title="Persiapan Belajar" />
              <Dropdown items={pengantarAWSItems} title="Pengantar ke Amazon Web Services" />
              <Dropdown items={komputasiCloudItems} title="Komputasi di Cloud" progress="0/9" />
            </div>
          </div>
          {/* sidebar */}
        </div>
       
    </DetailLayout>
  )
}
