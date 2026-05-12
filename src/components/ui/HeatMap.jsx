import { useState } from 'react'
import { motion } from 'framer-motion'

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

function getColorIntensity(value, max, color) {
  if (!value || value === 0) return 'rgba(30,45,69,0.4)'
  const intensity = Math.min(1, value / max)
  const hex = color.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const alpha = 0.15 + intensity * 0.85
  return `rgba(${r},${g},${b},${alpha})`
}

export default function HeatMap({ data, color = '#00C2FF', weeks = 12, label = 'Schritte', max }) {
  const [tooltip, setTooltip] = useState(null)

  // Build a 7×weeks grid from dates array
  const today = new Date('2026-05-12')
  const cells = []

  // Start from `weeks` weeks ago, aligned to Monday
  const start = new Date(today)
  start.setDate(today.getDate() - (weeks * 7) + 1)
  const dayOfWeek = start.getDay() === 0 ? 6 : start.getDay() - 1
  start.setDate(start.getDate() - dayOfWeek)

  const dateMap = {}
  if (data) {
    data.forEach(d => {
      dateMap[d.date] = d.count ?? d.value ?? d.hours ?? d
    })
  }

  const grid = []
  const cur = new Date(start)
  for (let w = 0; w < weeks; w++) {
    const col = []
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().split('T')[0]
      col.push({
        date: dateStr,
        value: dateMap[dateStr] ?? 0,
        month: cur.getMonth(),
        day: cur.getDate(),
        inFuture: cur > today,
      })
      cur.setDate(cur.getDate() + 1)
    }
    grid.push(col)
  }

  // Month labels
  const monthLabels = []
  grid.forEach((col, wi) => {
    const firstDay = col[0]
    if (wi === 0 || col[0].day <= 7) {
      if (wi === 0 || grid[wi - 1]?.[0]?.month !== firstDay.month) {
        monthLabels.push({ wi, month: firstDay.month })
      }
    }
  })

  const effectiveMax = max ?? Math.max(...Object.values(dateMap), 1)

  return (
    <div className="relative overflow-x-auto">
      {/* Month labels */}
      <div className="flex mb-1 ml-8">
        {grid.map((_, wi) => {
          const label = monthLabels.find(m => m.wi === wi)
          return (
            <div key={wi} style={{ width: 14, marginRight: 2 }} className="shrink-0">
              {label && (
                <span className="text-[10px] text-[#64748B]" style={{ whiteSpace: 'nowrap' }}>
                  {MONTHS_DE[label.month]}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1">
          {DAYS.map((d, i) => (
            <div key={d} style={{ height: 14 }} className="flex items-center">
              <span className="text-[10px] text-[#64748B] w-6">{i % 2 === 0 ? d : ''}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        {grid.map((col, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {col.map((cell, di) => (
              <motion.div
                key={cell.date}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: cell.inFuture ? 0.2 : 1, scale: 1 }}
                transition={{ delay: (wi * 7 + di) * 0.002 }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: cell.inFuture ? '#1E2D45' : getColorIntensity(cell.value, effectiveMax, color),
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  setTooltip({
                    date: cell.date,
                    value: cell.value,
                    x: e.clientX,
                    y: e.clientY,
                  })
                }}
                onMouseLeave={() => setTooltip(null)}
                whileHover={{ scale: 1.3 }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 ml-8">
        <span className="text-[10px] text-[#64748B]">Weniger</span>
        {[0.1, 0.3, 0.5, 0.7, 1].map(v => (
          <div
            key={v}
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              background: getColorIntensity(v * effectiveMax, effectiveMax, color),
            }}
          />
        ))}
        <span className="text-[10px] text-[#64748B]">Mehr</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg text-xs shadow-xl"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 40,
            background: '#0F1624',
            border: '1px solid #1E2D45',
            color: '#E2E8F0',
          }}
        >
          <div className="text-[#64748B]">{tooltip.date}</div>
          <div className="font-mono font-bold" style={{ color }}>
            {tooltip.value ? tooltip.value.toLocaleString('de-DE') : '—'} {label}
          </div>
        </div>
      )}
    </div>
  )
}
