import { motion } from 'framer-motion'
import { Bell, Search } from 'lucide-react'
import { useApp } from '../../App'

function getGreeting() {
  const hour = 9 // Simulating morning for demo; real: new Date().getHours()
  if (hour < 12) return 'Guten Morgen'
  if (hour < 17) return 'Guten Nachmittag'
  return 'Guten Abend'
}

export default function TopBar() {
  const { lifeScore } = useApp()
  const today = new Date('2026-05-12')
  const dateStr = today.toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const scoreColor =
    lifeScore.total >= 80 ? '#34D399' :
    lifeScore.total >= 60 ? '#F5A623' : '#F87171'

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-center justify-between px-8 py-4 shrink-0"
      style={{
        background: 'rgba(8,12,20,0.9)',
        borderBottom: '1px solid #1E2D45',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Greeting */}
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-white"
        >
          {getGreeting()}, <span style={{ color: '#00C2FF' }}>Enzo</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[#64748B] mt-0.5"
        >
          {dateStr}
        </motion.p>
      </div>

      {/* Right: search + score + bell */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors"
          style={{ background: '#0F1624', border: '1px solid #1E2D45' }}
          whileHover={{ borderColor: '#2A3F5A' }}
        >
          <Search size={14} className="text-[#64748B]" />
          <span className="text-[#64748B] text-sm">Suchen…</span>
          <span className="text-[#1E2D45] text-xs font-mono ml-2">⌘K</span>
        </motion.div>

        {/* Life Score Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', bounce: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
          style={{
            background: `${scoreColor}15`,
            border: `1px solid ${scoreColor}40`,
          }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: scoreColor }} />
          <span className="text-xs text-[#94A3B8] font-medium">Life Score</span>
          <span className="font-mono font-bold text-sm" style={{ color: scoreColor }}>
            {lifeScore.total}
          </span>
        </motion.div>

        {/* Notifications */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: '#0F1624', border: '1px solid #1E2D45' }}
        >
          <Bell size={16} className="text-[#64748B]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
            style={{ background: '#00C2FF' }}>3</span>
        </motion.button>
      </div>
    </motion.header>
  )
}
