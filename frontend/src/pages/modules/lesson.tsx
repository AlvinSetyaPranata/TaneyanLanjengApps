import { Icon } from "@iconify/react";
import DetailLayout from "../../layouts/DetailLayout";
import { useState } from "react";
import Dropdown from "../../components/atoms/Dropdown";



export default function Lesson() {

  const [sidebarStatus, setSidebarStatus] = useState(true)
  const dropdownItem = [
    {
      title: "Pengenalan tentang aswaja",
      url: "/"
    }
  ]

  return (
    <DetailLayout title="Pendidikan Aswaja">
        <div className="flex min-h-screen">
          {/* content */}
          <div className="flex-1 px-20 py-8">
             <h1 className="text-5xl font-bold">Glossarium </h1>
          </div>
          {/* content */}

          {/* sidebar */}
          <div className="w-[300px] border-l border-gray-200 py-8">
            <div className="w-full px-4">
              <button onClick={() => setSidebarStatus(state => !state)} className="bg-black rounded-full p-2 hover:cursor-pointer">
                <Icon icon={`line-md:chevron-${sidebarStatus ? 'right' : 'left'}`} className="text-white text-xl" />
              </button>
            </div>
            <div className="w-full border-b border-t border-gray-300 bg-gray-50 mt-8 py-6 px-4">
              {/* line progres */}
              <div className="w-full rounded-full h-[5px] bg-gray-300">
                <div className="h-full w-[25%] bg-green-500 rounded-full"></div>
              </div>
              <p className="mt-2">12% Selesai</p>
              {/* line progres */}
            </div>

            <div className="flex flex-col gap-y-4 p-4">
              <Dropdown items={dropdownItem} title="Hello" />
            </div>
          </div>
          {/* sidebar */}
        </div>
       
    </DetailLayout>
  )
}
