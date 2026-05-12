import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, MapPin, CalendarDays } from 'lucide-react'
import { useApp } from '../App'
import { Card, containerVariants, itemVariants } from '../components/ui/Card'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

const categoryColors = {
  sport: '#00C2FF',
  gesundheit: '#64748B',
  arbeit: '#60A5FA',
  familie: '#F472B6',
  freizeit: '#A78BFA',
  sozial: '#F472B6',
  persoenlich: '#A78BFA',
  wichtig: '#F5A623',
}

export default function Kalender() {
  const { data } = useApp()
  const { events, todayTimeBlocks } = data.calendar
  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(4) // May = 4
  const [selectedDate, setSelectedDate] = useState('2026-05-12')

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth)
  const today = '2026-05-12'

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const getEventsForDate = (dateStr) => events.filter(e => e.date === dateStr)

  const selectedEvents = getEventsForDate(selectedDate)

  const upcomingEvents = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 7)

  const selectedDateObj = new Date(selectedDate)
  const selectedDateLabel = selectedDateObj.toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-wrapper">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>

        {/* Header */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 12' }}>
          <h1 className="text-2xl font-bold text-white">Kalender & Zeit</h1>
          <p className="text-[#64748B] text-sm mt-0.5">Deine Events und Termine im Überblick</p>
        </motion.div>

        {/* Calendar Month View */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 7' }}>
          <Card className="h-full">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-white">
                {MONTHS_DE[currentMonth]} {currentYear}
              </h3>
              <div className="flex items-center gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={prevMonth}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: '#1E2D45' }}>
                  <ChevronLeft size={14} className="text-[#94A3B8]" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={nextMonth}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: '#1E2D45' }}>
                  <ChevronRight size={14} className="text-[#94A3B8]" />
                </motion.button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-[10px] text-[#64748B] font-medium py-1">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {/* Days */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayEvents = getEventsForDate(dateStr)
                const isToday = dateStr === today
                const isSelected = dateStr === selectedDate
                const isPast = dateStr < today

                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(dateStr)}
                    className="relative flex flex-col items-center py-2 rounded-xl transition-all"
                    style={{
                      background: isSelected ? '#34D39920' : isToday ? '#1E2D45' : 'transparent',
                      border: isSelected ? '1px solid #34D399' : isToday ? '1px solid #2A3F5A' : '1px solid transparent',
                    }}
                  >
                    <span className="text-sm font-medium" style={{
                      color: isToday ? '#34D399' : isSelected ? '#34D399' : isPast ? '#64748B' : '#E2E8F0'
                    }}>
                      {day}
                    </span>
                    {/* Event dots */}
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((ev, idx) => (
                          <div key={idx} className="w-1 h-1 rounded-full"
                            style={{ background: ev.color || categoryColors[ev.category] }} />
                        ))}
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Selected day events */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 5' }}>
          <Card className="h-full">
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays size={16} style={{ color: '#34D399' }} />
              <div>
                <h3 className="text-sm font-semibold text-white">{selectedDateLabel}</h3>
                {selectedEvents.length === 0 && (
                  <p className="text-xs text-[#64748B]">Keine Events an diesem Tag</p>
                )}
              </div>
            </div>

            {selectedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-4xl mb-3">🌿</span>
                <p className="text-[#94A3B8] text-sm font-medium">Freier Tag!</p>
                <p className="text-[#64748B] text-xs mt-1">Perfekt zum Entspannen oder Spontanes planen</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((ev, i) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-3 rounded-xl"
                    style={{ background: '#0A1020', borderLeft: `3px solid ${ev.color}` }}
                  >
                    <p className="text-sm font-semibold text-white mb-1">{ev.title}</p>
                    <div className="flex items-center gap-1 text-xs text-[#64748B] mb-1">
                      <Clock size={11} />
                      <span>{ev.time} Uhr · {ev.duration} min</span>
                    </div>
                    {ev.location && (
                      <div className="flex items-center gap-1 text-xs text-[#64748B]">
                        <MapPin size={11} />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    )}
                    {ev.description && (
                      <p className="text-xs text-[#64748B] mt-1.5 italic">{ev.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Time blocking today */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 6' }}>
          <Card>
            <h3 className="text-base font-semibold text-white mb-1">Zeitplan heute</h3>
            <p className="text-xs text-[#64748B] mb-5">12. Mai 2026</p>
            <div className="relative">
              {todayTimeBlocks.map((block, i) => {
                const top = (block.start - 7) * 40
                const height = (block.end - block.start) * 40
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="absolute left-12 right-0 rounded-lg px-3 flex items-center"
                    style={{
                      top,
                      height: Math.max(height, 32),
                      background: `${block.color}20`,
                      borderLeft: `3px solid ${block.color}`,
                    }}
                  >
                    <span className="text-xs font-medium truncate" style={{ color: block.color }}>
                      {block.label}
                    </span>
                  </motion.div>
                )
              })}
              {/* Hour markers */}
              {Array.from({ length: 15 }, (_, i) => i + 7).map(h => (
                <div key={h} className="flex items-center gap-2" style={{ height: 40 }}>
                  <span className="text-[10px] text-[#64748B] font-mono w-10 shrink-0 text-right">
                    {h}:00
                  </span>
                  <div className="flex-1 border-t border-dashed border-[#1E2D4530]" />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming events */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 6' }}>
          <Card>
            <h3 className="text-base font-semibold text-white mb-1">Kommende Events</h3>
            <p className="text-xs text-[#64748B] mb-5">Nächste 7 Events</p>
            <div className="space-y-3">
              {upcomingEvents.map((ev, i) => {
                const d = new Date(ev.date)
                const dayLabel = d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
                const isToday = ev.date === today
                const isTomorrow = ev.date === '2026-05-13'
                const relativeLabel = isToday ? 'Heute' : isTomorrow ? 'Morgen' : dayLabel

                return (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                    style={{ background: '#0A1020', border: '1px solid #1E2D45' }}
                    whileHover={{ borderColor: ev.color + '40', y: -1 }}
                  >
                    {/* Color dot + date */}
                    <div className="flex flex-col items-center shrink-0 w-12">
                      <div className="w-2.5 h-2.5 rounded-full mb-1" style={{ background: ev.color }} />
                      <span className="text-[10px] text-[#64748B] text-center leading-tight">{relativeLabel}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{ev.title}</p>
                      <div className="flex items-center gap-1 text-xs text-[#64748B] mt-0.5">
                        <Clock size={10} />
                        <span>{ev.time} Uhr</span>
                        {ev.location && (
                          <>
                            <span className="mx-1">·</span>
                            <MapPin size={10} />
                            <span className="truncate">{ev.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-xs px-2 py-1 rounded-lg shrink-0 capitalize"
                      style={{ background: `${ev.color}15`, color: ev.color }}>
                      {ev.category}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </motion.div>
  )
}
