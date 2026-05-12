import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts'
import { Heart, Weight, Footprints, Plus, X } from 'lucide-react'
import { useApp } from '../App'
import { Card, containerVariants, itemVariants } from '../components/ui/Card'
import ActivityRings from '../components/ui/ActivityRings'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

const DarkTooltip = ({ active, payload, label, color = '#00C2FF', unit = '' }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0F1624', border: '1px solid #1E2D45', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ color: '#64748B', fontSize: 11, marginBottom: 2 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || color, fontFamily: 'DM Mono', fontSize: 13, fontWeight: 700 }}>
          {typeof p.value === 'number' ? p.value.toLocaleString('de-DE') : p.value}{unit}
        </p>
      ))}
    </div>
  )
}

const workoutTypeEmojis = {
  Laufen: '🏃', Krafttraining: '🏋️', Radfahren: '🚴', HIIT: '⚡', Yoga: '🧘', Schwimmen: '🏊',
}

export default function Gesundheit() {
  const { data } = useApp()
  const { steps, sleep, workouts, weeklyWorkouts, stats, workoutColors } = data.health
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'Laufen', duration: '', notes: '' })

  const sleepData = sleep.slice(-14).map(s => ({
    date: s.date.slice(5),
    hours: s.hours,
    quality: s.quality,
  }))

  const statCards = [
    { label: 'Gewicht', value: stats.weight, unit: 'kg', trend: stats.weightTrend, icon: Weight, color: '#34D399' },
    { label: 'Ruhepuls', value: stats.heartRate, unit: 'bpm', trend: stats.heartRateTrend, icon: Heart, color: '#F472B6' },
    { label: 'Wöchentl. km', value: stats.weeklyKm, unit: 'km', trend: +2.3, icon: Footprints, color: '#00C2FF' },
  ]

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-wrapper">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>

        {/* Title */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 12' }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Gesundheit & Sport</h1>
            <p className="text-[#64748B] text-sm mt-0.5">Deine körperliche Leistung im Überblick</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #00C2FF, #0080FF)', color: '#fff' }}
          >
            <Plus size={15} /> Workout loggen
          </motion.button>
        </motion.div>

        {/* Activity Rings */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 6' }}>
          <Card accent="health" className="h-full">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#64748B] mb-6">Tagesringe</h3>
            <ActivityRings
              steps={stats.todaySteps}
              stepsGoal={stats.stepsGoal}
              sleep={stats.lastSleepHours}
              sleepGoal={stats.sleepGoal}
              activeMin={stats.activeMinutes}
              activeMinGoal={stats.activeMinutesGoal}
              size={160}
            />
          </Card>
        </motion.div>

        {/* Stat Cards */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 6' }}>
          <div className="grid grid-cols-1 gap-4 h-full">
            {statCards.map(sc => (
              <Card key={sc.label} style={{ padding: '16px 20px' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${sc.color}15` }}>
                      <sc.icon size={17} style={{ color: sc.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-[#64748B]">{sc.label}</p>
                      <p className="font-mono font-bold text-xl text-white">
                        {sc.value} <span className="text-sm text-[#64748B] font-normal">{sc.unit}</span>
                      </p>
                    </div>
                  </div>
                  <div className={`text-xs font-mono font-bold px-2 py-1 rounded-lg`}
                    style={{
                      color: sc.trend > 0 ? '#34D399' : '#F87171',
                      background: sc.trend > 0 ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                    }}>
                    {sc.trend > 0 ? '+' : ''}{sc.trend}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Sleep Chart */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 7' }}>
          <Card>
            <h3 className="text-base font-semibold text-white mb-1">Schlafqualität</h3>
            <p className="text-xs text-[#64748B] mb-6">Letzte 14 Tage</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={sleepData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis dataKey="date" stroke="#1E2D45" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'DM Mono' }} tickLine={false} />
                <YAxis domain={[4, 10]} stroke="#1E2D45" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'DM Mono' }} tickLine={false} axisLine={false} />
                <Tooltip content={<DarkTooltip color="#A78BFA" unit=" h" />} />
                <ReferenceLine y={8} stroke="#A78BFA" strokeDasharray="4 4" strokeOpacity={0.4} />
                <Area type="monotone" dataKey="hours" stroke="#A78BFA" strokeWidth={2} fill="url(#sleepGrad)" dot={false} activeDot={{ r: 4, fill: '#A78BFA' }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Workout frequency */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 5' }}>
          <Card>
            <h3 className="text-base font-semibold text-white mb-1">Trainings-Frequenz</h3>
            <p className="text-xs text-[#64748B] mb-6">Workouts pro Woche</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyWorkouts} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis dataKey="week" stroke="#1E2D45" tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'DM Mono' }} tickLine={false} />
                <YAxis domain={[0, 7]} stroke="#1E2D45" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'DM Mono' }} tickLine={false} axisLine={false} />
                <Tooltip content={<DarkTooltip color="#00C2FF" unit=" Workouts" />} />
                <Bar dataKey="count" fill="#00C2FF" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Recent Workouts */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 12' }}>
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Letzte Workouts</h3>
              <span className="text-xs text-[#64748B]">{workouts.length} Einträge</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {workouts.slice(0, 6).map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#0A1020', border: '1px solid #1E2D45' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${workoutColors[w.type]}15`, border: `1px solid ${workoutColors[w.type]}25` }}>
                    {workoutTypeEmojis[w.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{w.type}</p>
                      <span className="font-mono text-xs" style={{ color: workoutColors[w.type] }}>{w.duration} min</span>
                    </div>
                    <p className="text-xs text-[#64748B] truncate">{w.notes}</p>
                    <p className="text-xs text-[#1E2D45] mt-0.5">{w.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Log Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ gridColumn: 'span 12' }}
          >
            <Card accent="health">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white">Workout eintragen</h3>
                <button onClick={() => setShowForm(false)}><X size={16} className="text-[#64748B]" /></button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#64748B] block mb-2">Trainingsart</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: '#0A1020', border: '1px solid #1E2D45', fontFamily: 'Outfit' }}
                  >
                    {Object.keys(workoutTypeEmojis).map(t => (
                      <option key={t} value={t}>{workoutTypeEmojis[t]} {t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#64748B] block mb-2">Dauer (Minuten)</label>
                  <input
                    type="number"
                    placeholder="45"
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: '#0A1020', border: '1px solid #1E2D45', fontFamily: 'DM Mono' }}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#64748B] block mb-2">Notizen</label>
                  <input
                    type="text"
                    placeholder="Wie war das Training?"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: '#0A1020', border: '1px solid #1E2D45', fontFamily: 'Outfit' }}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #00C2FF, #0080FF)' }}
                >
                  Speichern ✓
                </motion.button>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
