import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Flame, Trophy, Check, Brain, BookOpen, Droplets, Dumbbell, PenLine, Languages, Target } from 'lucide-react'
import { useApp } from '../App'
import { Card, containerVariants, itemVariants } from '../components/ui/Card'
import HeatMap from '../components/ui/HeatMap'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

const iconMap = { Brain, BookOpen, Droplets, Dumbbell, PenLine, Languages }

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0F1624', border: '1px solid #1E2D45', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ color: '#64748B', fontSize: 11 }}>{label}</p>
      <p style={{ color: '#A78BFA', fontFamily: 'DM Mono', fontSize: 13, fontWeight: 700 }}>
        {payload[0].value}% Abschlussrate
      </p>
    </div>
  )
}

function HabitRow({ habit, onToggle }) {
  const Icon = iconMap[habit.icon] ?? Check
  return (
    <motion.div
      layout
      className="flex items-center gap-4 p-4 rounded-xl transition-all"
      style={{ background: '#0A1020', border: `1px solid ${habit.completedToday ? habit.color + '30' : '#1E2D45'}` }}
      whileHover={{ borderColor: habit.color + '40' }}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${habit.color}15` }}>
        <Icon size={18} style={{ color: habit.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white">{habit.name}</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md text-[#64748B]"
            style={{ background: '#1E2D45' }}>{habit.target}</span>
        </div>
        <p className="text-xs text-[#64748B]">{habit.description}</p>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1 shrink-0">
        <Flame size={14} style={{ color: habit.streak > 0 ? '#F5A623' : '#1E2D45' }} />
        <span className="font-mono text-sm font-bold" style={{ color: habit.streak > 0 ? '#F5A623' : '#64748B' }}>
          {habit.streak}
        </span>
      </div>

      {/* Check button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85 }}
        onClick={() => onToggle(habit.id)}
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
        style={{
          background: habit.completedToday ? habit.color : 'transparent',
          border: `2px solid ${habit.completedToday ? habit.color : '#1E2D45'}`,
        }}
      >
        <AnimatePresence>
          {habit.completedToday && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <Check size={14} color="#000" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

function GoalCard({ goal }) {
  const progress = goal.inverted
    ? Math.max(0, Math.min(1, (goal.target + (goal.target - goal.current)) / goal.target))
    : Math.min(1, goal.current / goal.target)
  const pct = Math.round(progress * 100)
  const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date('2026-05-12')) / 86400000)

  return (
    <motion.div variants={itemVariants} className="p-4 rounded-xl"
      style={{ background: '#0A1020', border: '1px solid #1E2D45' }}
      whileHover={{ borderColor: goal.color + '40', y: -1 }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-white">{goal.title}</p>
          <p className="text-xs text-[#64748B] mt-0.5">{goal.description}</p>
        </div>
        <div className="text-right">
          <p className="font-mono font-bold text-sm" style={{ color: goal.color }}>
            {goal.inverted ? goal.target : goal.current} <span className="text-[#64748B] font-normal text-xs">{goal.unit}</span>
          </p>
          <p className="text-[10px] text-[#64748B]">von {goal.inverted ? goal.current : goal.target} {goal.unit}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full mb-2" style={{ background: '#1E2D45' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${goal.color}, ${goal.color}cc)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className="font-mono" style={{ color: goal.color }}>{pct}%</span>
        <span className="text-[#64748B]">
          {daysLeft > 0 ? `${daysLeft} Tage verbleibend` : 'Abgelaufen'}
        </span>
      </div>
    </motion.div>
  )
}

export default function Habits() {
  const { habits, toggleHabit, data } = useApp()
  const completedToday = habits.filter(h => h.completedToday).length
  const totalToday = habits.length
  const completionPct = Math.round((completedToday / totalToday) * 100)

  const bestStreak = Math.max(...habits.map(h => h.longestStreak))
  const currentStreak = Math.max(...habits.map(h => h.streak))

  // Use first habit's completions for heatmap demo
  const firstHabit = habits[0]

  const habitHeatmapData = firstHabit?.completions?.map(date => ({ date, count: 1 })) ?? []

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-wrapper">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>

        {/* Header */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 12' }}>
          <h1 className="text-2xl font-bold text-white">Ziele & Habits</h1>
          <p className="text-[#64748B] text-sm mt-0.5">Deine täglichen Gewohnheiten und Langzeitziele</p>
        </motion.div>

        {/* Today's completion ring */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 4' }}>
          <Card accent="habits" className="h-full">
            <p className="text-xs text-[#64748B] uppercase tracking-widest mb-4">Heute abgeschlossen</p>
            <div className="flex items-center gap-5 mb-5">
              <div className="relative" style={{ width: 80, height: 80 }}>
                <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={40} cy={40} r={32} stroke="#1E2D45" strokeWidth={8} fill="none" />
                  <motion.circle cx={40} cy={40} r={32} stroke="#A78BFA" strokeWidth={8} fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 32}
                    initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - completionPct / 100) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono font-bold text-lg text-white">{completionPct}%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white font-mono">{completedToday}<span className="text-[#64748B] text-lg">/{totalToday}</span></p>
                <p className="text-xs text-[#64748B] mt-1">Habits heute</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl text-center" style={{ background: '#0A1020' }}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame size={14} style={{ color: '#F5A623' }} />
                  <span className="font-mono font-bold text-lg text-white">{currentStreak}</span>
                </div>
                <p className="text-[10px] text-[#64748B]">Aktueller Streak</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: '#0A1020' }}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Trophy size={14} style={{ color: '#F5A623' }} />
                  <span className="font-mono font-bold text-lg text-white">{bestStreak}</span>
                </div>
                <p className="text-[10px] text-[#64748B]">Rekord-Streak</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Habit List */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 8' }}>
          <Card className="h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Heutige Habits</h3>
              <span className="text-xs px-2 py-1 rounded-lg font-mono" style={{ background: '#A78BFA20', color: '#A78BFA' }}>
                {completedToday}/{totalToday} erledigt
              </span>
            </div>
            <div className="space-y-2">
              {habits.map(habit => (
                <HabitRow key={habit.id} habit={habit} onToggle={toggleHabit} />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Heatmap */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 7' }}>
          <Card>
            <h3 className="text-base font-semibold text-white mb-1">Habit-Verlauf</h3>
            <p className="text-xs text-[#64748B] mb-5">Meditation — letzte 12 Wochen</p>
            <HeatMap data={habitHeatmapData} color="#A78BFA" weeks={12} label="✓ erledigt" max={1} />
          </Card>
        </motion.div>

        {/* Weekly completion chart */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 5' }}>
          <Card>
            <h3 className="text-base font-semibold text-white mb-1">Wöchentliche Rate</h3>
            <p className="text-xs text-[#64748B] mb-5">Abschlussrate aller Habits</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.habits.weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis dataKey="week" stroke="#1E2D45" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'DM Mono' }} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#1E2D45" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'DM Mono' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="rate" fill="#A78BFA" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Goals */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 12' }}>
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <Target size={18} style={{ color: '#34D399' }} />
              <h3 className="text-base font-semibold text-white">Langzeit-Ziele</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data.habits.goals.map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
