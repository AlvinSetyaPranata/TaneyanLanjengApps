import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import Home from './Home'

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<Home /> } />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
