import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Modules from './modules'
import ModuleDetail from './modules/detail'
import Lesson from './modules/lesson'
import Login from './Login'
import Register from './Register'
import ProtectedRoute from '../components/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login /> } />
            <Route path="/register" element={<Register /> } />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
            <Route path="/modules/:module_id/corridor" element={<ProtectedRoute><ModuleDetail /></ProtectedRoute>} />
            <Route path="/modules/:module_id/lesson/:lesson_id" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
