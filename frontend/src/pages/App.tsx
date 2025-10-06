import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Modules from './modules'
import ModuleDetail from './modules/detail'
import Lesson from './modules/lesson'

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home /> } />
            <Route path="/modules" element={<Modules /> } />
            <Route path="/modules/:module_id/corridor" element={<ModuleDetail /> } />
            <Route path="/modules/:module_id/lesson/:lesson_id" element={<Lesson /> } />
        </Routes>
    </BrowserRouter>
  )
}

export default App
