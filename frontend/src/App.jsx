import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import About from './pages/About'
import Donate from './pages/Donate'
import Activities from './pages/Activities'
import Volunteer from './pages/Volunteer'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import ActivityDetail from './pages/ActivityDetail'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import './styles/global.css'
import { AuthProvider } from './utils/AuthProvider'
import { useAuth } from './utils/AuthProvider'
import { useAuthApiInterceptor } from './utils/useApi'

function AppContent() {
  const { token } = useAuth()
  useAuthApiInterceptor(token)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/activities/:id" element={<ActivityDetail />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
