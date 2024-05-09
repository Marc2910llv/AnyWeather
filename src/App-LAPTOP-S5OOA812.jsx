import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from "react-hot-toast";

//import components
import Login from '../src/components/Login'
import RouterApp from './routes/RouterApp'
import ProtectedRoutes from './routes/ProtectedRoutes'
import './functions/notifications'

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Toaster/>
      <Routes>
        <Route
          path='/*'
          element={
            <ProtectedRoutes>
              <RouterApp />
            </ProtectedRoutes>
          }
        />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
