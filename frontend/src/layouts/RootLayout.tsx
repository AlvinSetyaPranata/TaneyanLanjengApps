import Sidebar from '../components/molecules/Sidebar'
import { Icon } from '@iconify/react'
import { useState, useEffect, useRef, type PropsWithChildren } from 'react'


export default function RootLayout(props: PropsWithChildren) {

  const [isSidebarOpened, setIsSidebarOpened] = useState(true)
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false)
      }
    }

    if (isAccountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAccountDropdownOpen])

  return (
    <div className='flex items-start'>
        {/* this will be a components that appears on main layout */}
        <Sidebar isExpanded={isSidebarOpened} />
        <div className='flex-1'>
          <header className='w-full flex justify-between items-center py-4 px-6'>
            <button onClick={() => setIsSidebarOpened((state) => !state)} className='p-2 rounded-md border border-gray-300 hover:cursor-pointer'>
              <Icon icon="ci:hamburger-lg" width={24} height={24} className='text-gray-500' />
            </button>

            {/* Right side: Notification and Account */}
            <div className='flex items-center gap-x-4'>
              {/* Notification Button */}
              <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <Icon icon="ph:bell" width={24} height={24} className='text-gray-700' />
              </button>

              {/* Account Dropdown */}
              <div className='relative' ref={dropdownRef}>
                <button 
                  onClick={() => setIsAccountDropdownOpen((state) => !state)}
                  className='flex items-center gap-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors'
                >
                  <img 
                    src="https://ui-avatars.com/api/?name=User+Account&background=random" 
                    alt="Profile" 
                    className='w-10 h-10 rounded-full object-cover'
                  />
                  <Icon 
                    icon="mingcute:down-fill" 
                    width={20} 
                    height={20} 
                    className={`text-gray-700 transition-transform ${
                      isAccountDropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isAccountDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50'>
                    {/* Menu Items */}
                    <div className='py-2'>
                      <a href='/settings' className='flex items-center gap-x-3 px-4 py-3 hover:bg-gray-50 transition-colors'>
                        <Icon icon="mdi:cog-outline" width={24} height={24} className='text-gray-700' />
                        <span className='text-gray-800 font-medium'>Pengaturan</span>
                      </a>
                    </div>

                    {/* Logout */}
                    <div className='border-t border-gray-200'>
                      <button className='flex items-center gap-x-3 px-4 py-3 w-full hover:bg-red-50 transition-colors'>
                        <Icon icon="mdi:logout" width={24} height={24} className='text-red-500' />
                        <span className='text-red-500 font-medium'>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className='bg-gray-50 min-h-screen px-12 py-8'>
            {props.children}
          </main>
        </div>
    </div>
  )
}
