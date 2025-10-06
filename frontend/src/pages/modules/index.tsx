import { Icon } from "@iconify/react"
import { useState } from "react"
import Breadcrumps from "../../components/atoms/Breadcrumps"
import { Link } from "react-router-dom"
import RootLayout from "../../layouts/RootLayout"


export default function Modules() {

  const [activeBtn, setActiveBtn] = useState(1)

  const urls = [
    {
      title: "Modul Kelas",
      url: "/modules"
    },
  ]

  return (
    <RootLayout>
      {/* <h1 className="text-gray-400">Modul Kelas</h1> */}
      <Breadcrumps urls={urls} />

      <div className="flex mt-8">
        <button onClick={() => setActiveBtn(1)} className={`${activeBtn == 1 ? "bg-white" : "bg-transparent"} hover:cursor-pointer px-6 py-2 rounded-md`}>Modul yang dipelajari</button>
        <button onClick={() => setActiveBtn(2)} className={`${activeBtn == 2 ? "bg-white" : "bg-transparent"} hover:cursor-pointer px-6 py-2 rounded-md`}>Modul yang terselesaikan</button>
      </div>


      <div className="bg-white rounded-md mt-4 p-1">
        <div className="p-8">

          <Icon icon="streamline-plump:graduation-cap-solid" width={24} height={24} />
          <h1 className="mt-2 font-semibold text-gray-700 text-2xl">Semester 1</h1>
          <div className="flex items-center gap-2 mt-4">
            <Icon icon="tabler:clock" width={20} height={20} className="text-gray-500" />
            <p className="text-gray-500">Jangka waktu dari: 19 Januari 2025 - 20 April 2025</p>
          </div>
        </div>


        {/* content */}

        <div className="group border-t border-gray-200 p-8 mt-2 hover:bg-gray-100 flex items-center">
          {/* checkbox */}
          <div className="rounded-full size-[18px] border border-gray-400"></div>
          {/* btn content */}
          <div className="flex items-center justify-between w-full">
            <h3 className="ml-4">Pendidikan Aswaja</h3>
            <Link to="/modules/112/corridor" className="group-hover:opacity-100 hover:cursor-pointer opacity-0 rounded-sm bg-black text-white px-3 py-2 text-sm">Detail Kelas</Link>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}
