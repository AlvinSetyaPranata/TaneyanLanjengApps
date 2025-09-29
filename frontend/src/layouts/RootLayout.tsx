import { Outlet } from 'react-router-dom'
import Sidebar from '../components/molecules/Sidebar'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export default function RootLayout() {

  const [isSidebarOpened, setIsSidebarOpened] = useState(true)

  return (
    <div className='flex items-start'>
        {/* this will be a components that appears on main layout */}
        <Sidebar isExpanded={isSidebarOpened} />
        <div className='flex-1'>
          <header className='w-full flex py-4 px-6'>
            <button onClick={() => setIsSidebarOpened((state) => !state)} className='p-2 rounded-md border border-gray-300 hover:cursor-pointer'>
              <Icon icon="ci:hamburger-lg" width={24} height={24} className='text-gray-500' />
            </button>
          </header>
          <main className='bg-gray-100 min-h-screen px-12 py-8'>
            <Outlet />
          </main>
        </div>
    </div>
  )
}
