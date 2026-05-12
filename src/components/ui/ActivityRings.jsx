import { motion } from 'framer-motion'

function Ring({ cx, cy, r, progress, color, trackColor, strokeWidth, delay = 0 }) {
  const circumference = 2 * Math.PI * r
  const offset = circumference - Math.min(1, progress) * circumference

  return (
    <>
      <circle cx={cx} cy={cy} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
      <motion.circle
        cx={cx} cy={cy} r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay }}
      />
    </>
  )
}

export default function ActivityRings({ steps, stepsGoal, sleep, sleepGoal, activeMin, activeMinGoal, size = 180 }) {
  const rings = [
    { r: size / 2 - 12, progress: steps / stepsGoal, color: '#00C2FF', track: '#001E2B', width: 16, delay: 0 },
    { r: size / 2 - 36, progress: activeMin / activeMinGoal, color: '#F5A623', track: '#241900', width: 16, delay: 0.15 },
    { r: size / 2 - 60, progress: sleep / sleepGoal, color: '#A78BFA', track: '#130E1F', width: 16, delay: 0.3 },
  ]

  const labels = [
    { label: 'Schritte', value: steps.toLocaleString('de-DE'), goal: stepsGoal.toLocaleString('de-DE'), color: '#00C2FF', unit: '' },
    { label: 'Aktiv Min.', value: activeMin, goal: activeMinGoal, color: '#F5A623', unit: ' min' },
    { label: 'Schlaf', value: sleep.toFixed(1), goal: sleepGoal, color: '#A78BFA', unit: ' h' },
  ]

  return (
    <div className="flex items-center gap-8">
      {/* SVG Rings */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            {rings.map((ring, i) => (
              <radialGradient key={i} id={`ringGlow${i}`}>
                <stop offset="0%" stopColor={ring.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={ring.color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          {rings.map((ring, i) => (
            <Ring
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={ring.r}
              progress={ring.progress}
              color={ring.color}
              trackColor={ring.track}
              strokeWidth={ring.width}
              delay={ring.delay}
            />
          ))}
        </svg>
      </div>

      {/* Labels */}
      <div className="flex flex-col gap-4">
        {labels.map(({ label, value, goal, color, unit }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <div>
              <span className="text-xs text-[#64748B] block">{label}</span>
              <span className="font-mono font-bold text-white text-sm">
                {value}{unit}
                <span className="text-[#64748B] font-normal text-xs"> / {goal}{unit}</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
