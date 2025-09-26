import { Outlet } from 'react-router-dom'
import Sidebar from '../components/molecules/Sidebar'

export default function RootLayout() {
  return (
    <div className='flex items-start'>
        {/* this will be a components that appears on main layout */}
        <Sidebar />
        <Outlet />
    </div>
  )
}
