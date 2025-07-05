import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import { login, logout } from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-blue-400 via-fuchsia-300 to-pink-400 blur-2xl opacity-80"></div>
      {/* Glassmorphism Card */}
      <div className="w-full max-w-4xl mx-auto flex flex-col min-h-screen shadow-2xl rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/40 ring-1 ring-pink-200/30">
        <Header />
        <main className="flex-1 px-4 py-10 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-fuchsia-600 to-pink-600 mb-8 drop-shadow-2xl text-center tracking-tight">
            Welcome to <span className="underline decoration-pink-400">MegaBlog</span>
          </h1>
          <div className="w-full">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      {/* Optional: Add animated glowing circles for extra effect */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full opacity-30 blur-3xl animate-pulse -z-20"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300 rounded-full opacity-30 blur-3xl animate-pulse -z-20"></div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-fuchsia-300 to-pink-400">
      <span className="text-3xl font-bold text-gray-800 animate-pulse drop-shadow-lg">Loading...</span>
    </div>
  )
}

export default App