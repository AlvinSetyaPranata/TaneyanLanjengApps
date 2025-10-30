import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Modules from './modules' // Unified modules page for both roles
import ModuleDetail from './modules/detail'
import Lesson from './modules/lesson'
import ExamPage from './modules/exam'
import StudentExamPage from './modules/studentExam'
import Login from './Login'
import Register from './Register'
import Settings from './Settings'
import LessonEditor from './teacher/LessonEditor'
import TeacherDashboard from './teacher/Dashboard'
import TeacherModuleDetail from './teacher/ModuleDetail'
import ModuleEditor from './teacher/ModuleEditor'
import AdminDashboard from './admin/Dashboard'
import ProtectedRoute from '../components/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login /> } />
            <Route path="/register" element={<Register /> } />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            
            {/* Unified Modules Route - Works for both Teachers and Students */}
            <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
            
            {/* Student Module Routes */}
            <Route path="/student/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
            <Route path="/student/modules/:module_id/corridor" element={<ProtectedRoute><ModuleDetail /></ProtectedRoute>} />
            <Route path="/student/modules/:module_id/lesson/:lesson_id" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
            <Route path="/student/modules/:module_id/exam/:lesson_id" element={<ProtectedRoute><StudentExamPage /></ProtectedRoute>} />
            
            {/* Teacher Module Management Routes */}
            <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
            <Route path="/teacher/modules/create" element={<ProtectedRoute><ModuleEditor /></ProtectedRoute>} />
            <Route path="/teacher/modules/:module_id" element={<ProtectedRoute><TeacherModuleDetail /></ProtectedRoute>} />
            <Route path="/teacher/modules/:module_id/edit" element={<ProtectedRoute><ModuleEditor /></ProtectedRoute>} />
            <Route path="/teacher/lessons/create" element={<ProtectedRoute><LessonEditor /></ProtectedRoute>} />
            <Route path="/teacher/lessons/:lesson_id/edit" element={<ProtectedRoute><LessonEditor /></ProtectedRoute>} />
            <Route path="/teacher/modules/:module_id/lessons/create" element={<ProtectedRoute><LessonEditor /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            
            {/* Settings */}
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
