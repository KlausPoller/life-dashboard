import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Activity, Wallet, CheckSquare, Calendar, Zap
} from 'lucide-react'
import { useApp } from '../../App'

const nav = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, color: '#E2E8F0' },
  { path: '/gesundheit', label: 'Gesundheit', icon: Activity, color: '#00C2FF' },
  { path: '/finanzen', label: 'Finanzen', icon: Wallet, color: '#F5A623' },
  { path: '/habits', label: 'Ziele & Habits', icon: CheckSquare, color: '#A78BFA' },
  { path: '/kalender', label: 'Kalender', icon: Calendar, color: '#34D399' },
]

function WeeklyScoreRing({ score }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <svg width={56} height={56} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={28} cy={28} r={r} stroke="#1E2D45" strokeWidth={4} fill="none" />
        <motion.circle
          cx={28} cy={28} r={r}
          stroke="url(#sideGrad)"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
        />
        <defs>
          <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute font-mono text-xs font-bold text-white">{score}</span>
    </div>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const { lifeScore } = useApp()

  const today = new Date('2026-05-12')
  const dateStr = today.toLocaleDateString('de-DE', {
    weekday: 'short', day: 'numeric', month: 'short'
  })

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col shrink-0 h-full overflow-hidden"
      style={{
        width: 240,
        background: 'rgba(15,22,36,0.95)',
        borderRight: '1px solid #1E2D45',
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00C2FF, #A78BFA)' }}>
            <Zap size={16} color="#fff" fill="#fff" />
          </div>
          <span className="font-bold text-lg tracking-widest text-white" style={{ letterSpacing: '0.15em' }}>
            LIFE OS
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {nav.map(({ path, label, icon: Icon, color }, i) => {
          const isActive = location.pathname === path
          return (
            <motion.div
              key={path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <NavLink
                to={path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative"
                style={{
                  color: isActive ? '#fff' : '#64748B',
                  background: isActive ? 'rgba(30,45,69,0.8)' : 'transparent',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(30,45,69,0.8)', border: '1px solid rgba(30,45,69,0.9)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon
                  size={18}
                  className="relative z-10 transition-colors duration-200"
                  style={{ color: isActive ? color : '#64748B' }}
                />
                <span className="relative z-10">{label}</span>
                {isActive && (
                  <div className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                )}
              </NavLink>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom: date + score ring */}
      <div className="p-5 border-t border-[#1E2D45]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#64748B] mb-0.5">Heute</p>
            <p className="text-sm font-medium text-[#94A3B8]">{dateStr}</p>
            <p className="text-xs text-[#64748B] mt-2">Wöchentlicher Score</p>
          </div>
          <WeeklyScoreRing score={lifeScore.total} />
        </div>
      </div>
    </motion.aside>
  )
}
