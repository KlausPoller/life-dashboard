import { motion } from 'framer-motion'

export default function LifeScoreRing({ score, breakdown, size = 220 }) {
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const categories = [
    { label: 'Gesundheit', value: breakdown?.health ?? 0, color: '#00C2FF' },
    { label: 'Finanzen', value: breakdown?.finance ?? 0, color: '#F5A623' },
    { label: 'Habits', value: breakdown?.habits ?? 0, color: '#A78BFA' },
    { label: 'Ziele', value: breakdown?.goals ?? 0, color: '#34D399' },
  ]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="mainRingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00C2FF" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
            <filter id="ringGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E2D45"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#mainRingGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
            filter="url(#ringGlow)"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', bounce: 0.4 }}
            className="font-mono font-bold text-white leading-none"
            style={{ fontSize: size * 0.22 }}
          >
            {score}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-[#64748B] uppercase tracking-widest mt-1"
          >
            Life Score
          </motion.span>
        </div>
      </div>

      {/* Breakdown pills */}
      <div className="grid grid-cols-2 gap-2 w-full">
        {categories.map(({ label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.1 }}
            className="flex items-center justify-between px-3 py-2 rounded-xl"
            style={{ background: `${color}10`, border: `1px solid ${color}25` }}
          >
            <span className="text-xs text-[#94A3B8]">{label}</span>
            <span className="font-mono text-xs font-bold" style={{ color }}>{value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
