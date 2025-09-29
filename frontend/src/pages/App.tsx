import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import Home from './Home'
import Modules from './Modules'

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<Home /> } />
            <Route path="/modules" element={<Modules /> } />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
