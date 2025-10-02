import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import Home from './Home'
import Modules from './modules'
import ModuleDetail from './modules/detail'

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<Home /> } />
            <Route path="/modules" element={<Modules /> } />
            <Route path="/modules/:id" element={<ModuleDetail /> } />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
