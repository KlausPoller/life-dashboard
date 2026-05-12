import { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { initData } from './data/mockData'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import DailyCheckIn from './components/ui/DailyCheckIn'
import Dashboard from './pages/Dashboard'
import Gesundheit from './pages/Gesundheit'
import Finanzen from './pages/Finanzen'
import Habits from './pages/Habits'
import Kalender from './pages/Kalender'

export const AppContext = createContext(null)

export function useApp() {
  return useContext(AppContext)
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/gesundheit" element={<Gesundheit />} />
        <Route path="/finanzen" element={<Finanzen />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/kalender" element={<Kalender />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppInner() {
  const { showCheckIn, setShowCheckIn } = useApp()
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080C14' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <AnimatedRoutes />
        </main>
      </div>
      <AnimatePresence>
        {showCheckIn && <DailyCheckIn onClose={() => setShowCheckIn(false)} />}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  const [data] = useState(() => initData())
  const [habits, setHabits] = useState(() => data.habits.list)
  const [showCheckIn, setShowCheckIn] = useState(() => {
    const today = new Date().toDateString()
    return localStorage.getItem('lifeos_checkin') !== today
  })

  const completeCheckIn = () => {
    localStorage.setItem('lifeos_checkin', new Date().toDateString())
    setShowCheckIn(false)
  }

  const toggleHabit = (habitId) => {
    setHabits(prev => prev.map(h =>
      h.id === habitId
        ? { ...h, completedToday: !h.completedToday }
        : h
    ))
  }

  const lifeScore = data.lifeScore

  return (
    <AppContext.Provider value={{ data, habits, toggleHabit, lifeScore, showCheckIn, setShowCheckIn, completeCheckIn }}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AppContext.Provider>
  )
}
