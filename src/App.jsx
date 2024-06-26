import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from "react-hot-toast";

//Import components
import Login from '../src/components/Login'
import RouterApp from './routes/RouterApp'
import ProtectedRoutes from './routes/ProtectedRoutes'

//Import the notifications and the style of the project
import './functions/notifications'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Toaster/>{/*Active the tosters*/}
      <Routes>
        <Route
          path='/*'
          element={
            <ProtectedRoutes>
              <RouterApp />
            </ProtectedRoutes>
          }/>
        <Route path='/login' element={<Login />}/>{/*Crea la ruta para el Login*/}
      </Routes>
    </BrowserRouter>
  )
}

export default App
