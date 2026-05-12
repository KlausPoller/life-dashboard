import { motion } from 'framer-motion'
import { Plus, Activity, Wallet, CheckSquare, Calendar, TrendingUp, Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { Card, containerVariants, itemVariants } from '../components/ui/Card'
import LifeScoreRing from '../components/ui/LifeScoreRing'
import HeatMap from '../components/ui/HeatMap'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

function QuickAddBtn({ label, icon: Icon, color, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}30`,
        color,
      }}
    >
      <Plus size={14} />
      {label}
    </motion.button>
  )
}

export default function Dashboard() {
  const { lifeScore, data, habits } = useApp()
  const navigate = useNavigate()

  const todaySteps = data.health.steps[data.health.steps.length - 1]?.count ?? 0
  const todaySleep = data.health.sleep[data.health.sleep.length - 1]?.hours ?? 0
  const balance = data.finance.stats.balance
  const longestStreak = Math.max(...habits.map(h => h.streak))
  const completedToday = habits.filter(h => h.completedToday).length
  const nextEvent = data.calendar.events.find(e => e.date >= '2026-05-12') ?? null

  const summaryCards = [
    {
      label: 'Gesundheit',
      value: `${Math.round((todaySteps / 10000) * 100)}%`,
      sub: `${todaySteps.toLocaleString('de-DE')} Schritte heute`,
      icon: Activity,
      color: '#00C2FF',
      accent: 'health',
      path: '/gesundheit',
    },
    {
      label: 'Kontostand',
      value: `€ ${balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
      sub: `+€ ${data.finance.stats.balanceTrend.toFixed(2)} diesen Monat`,
      icon: Wallet,
      color: '#F5A623',
      accent: 'finance',
      path: '/finanzen',
    },
    {
      label: 'Habits',
      value: `${completedToday}/${habits.length}`,
      sub: `${longestStreak} Tage Longest Streak`,
      icon: Flame,
      color: '#A78BFA',
      accent: 'habits',
      path: '/habits',
    },
    {
      label: 'Nächstes Event',
      value: nextEvent?.title ?? 'Nichts geplant',
      sub: nextEvent ? `${nextEvent.date} um ${nextEvent.time}` : 'Entspann dich 😊',
      icon: Calendar,
      color: '#34D399',
      accent: 'calendar',
      path: '/kalender',
    },
  ]

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-wrapper"
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>

        {/* Life Score Ring */}
        <motion.div variants={itemVariants} className="col-span-3"
          style={{ gridColumn: 'span 3' }}>
          <Card accent="health" className="h-full">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#64748B] mb-6">Gesamtscore</h3>
            <LifeScoreRing score={lifeScore.total} breakdown={lifeScore} />
          </Card>
        </motion.div>

        {/* Summary cards 2×2 grid */}
        <motion.div variants={containerVariants} className="col-span-9 grid grid-cols-2 gap-4"
          style={{ gridColumn: 'span 9' }}>
          {summaryCards.map(card => (
            <Card
              key={card.label}
              accent={card.accent}
              onClick={() => navigate(card.path)}
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${card.color}15` }}>
                  <card.icon size={18} style={{ color: card.color }} />
                </div>
                <TrendingUp size={14} className="text-[#64748B]" />
              </div>
              <p className="text-xs text-[#64748B] mb-1">{card.label}</p>
              <p className="font-mono font-bold text-xl text-white leading-tight mb-1 truncate"
                style={{ color: card.color }}>
                {card.value}
              </p>
              <p className="text-xs text-[#64748B]">{card.sub}</p>
            </Card>
          ))}
        </motion.div>

        {/* Heatmap */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 8' }}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-white">Aktivitäts-Heatmap</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Tagesschritte — letzte 12 Wochen</p>
              </div>
            </div>
            <HeatMap data={data.health.steps} color="#00C2FF" weeks={12} label="Schritte" max={12000} />
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 4' }}>
          <Card className="h-full">
            <h3 className="text-base font-semibold text-white mb-1">Schnellzugriff</h3>
            <p className="text-xs text-[#64748B] mb-5">Jetzt eintragen</p>

            <div className="flex flex-col gap-3">
              <QuickAddBtn label="Workout loggen" icon={Activity} color="#00C2FF" onClick={() => navigate('/gesundheit')} />
              <QuickAddBtn label="Ausgabe hinzufügen" icon={Wallet} color="#F5A623" onClick={() => navigate('/finanzen')} />
              <QuickAddBtn label="Habit abhaken" icon={CheckSquare} color="#A78BFA" onClick={() => navigate('/habits')} />
              <QuickAddBtn label="Event erstellen" icon={Calendar} color="#34D399" onClick={() => navigate('/kalender')} />
            </div>

            <div className="mt-6 pt-5 border-t border-[#1E2D45]">
              <p className="text-xs text-[#64748B] mb-3">Wochenziel</p>
              {[
                { label: 'Sport', done: 3, goal: 5, color: '#00C2FF' },
                { label: 'Habits', done: completedToday, goal: habits.length, color: '#A78BFA' },
              ].map(item => (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#94A3B8]">{item.label}</span>
                    <span className="font-mono" style={{ color: item.color }}>{item.done}/{item.goal}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: '#1E2D45' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.done / item.goal) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent activity */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 12' }}>
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Letzte Aktivitäten</h3>
              <span className="text-xs text-[#64748B]">Heute, {new Date('2026-05-12').toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {data.health.workouts.slice(0, 3).map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#0A1020', border: '1px solid #1E2D45' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: `${data.health.workoutColors[w.type]}15` }}>
                    🏃
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{w.type}</p>
                    <p className="text-xs text-[#64748B]">{w.duration} min • {w.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
