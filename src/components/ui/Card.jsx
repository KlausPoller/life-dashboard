import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const accentStyles = {
  health: { borderColor: 'rgba(0,194,255,0.25)', boxShadow: '0 0 30px rgba(0,194,255,0.06)' },
  finance: { borderColor: 'rgba(245,166,35,0.25)', boxShadow: '0 0 30px rgba(245,166,35,0.06)' },
  habits: { borderColor: 'rgba(167,139,250,0.25)', boxShadow: '0 0 30px rgba(167,139,250,0.06)' },
  calendar: { borderColor: 'rgba(52,211,153,0.25)', boxShadow: '0 0 30px rgba(52,211,153,0.06)' },
}

export function Card({ children, className, accent, onClick, style }) {
  const accentStyle = accent ? accentStyles[accent] : {}
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={clsx('rounded-2xl p-6', onClick && 'cursor-pointer', className)}
      style={{
        background: 'rgba(15,22,36,0.9)',
        border: '1px solid #1E2D45',
        backdropFilter: 'blur(20px)',
        ...accentStyle,
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeader({ title, subtitle, color, children }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-[#64748B] mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export function StatPill({ label, value, color, suffix }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
      style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
      <span className="font-mono font-bold text-sm" style={{ color }}>{value}{suffix}</span>
      <span className="text-xs text-[#64748B]">{label}</span>
    </div>
  )
}
