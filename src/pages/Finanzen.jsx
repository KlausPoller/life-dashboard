import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Plus, X, ShoppingCart, Train, ShoppingBag, Dumbbell, Music, Home, UtensilsCrossed, MoreHorizontal } from 'lucide-react'
import { useApp } from '../App'
import { Card, containerVariants, itemVariants } from '../components/ui/Card'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0F1624', border: '1px solid #1E2D45', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ color: '#64748B', fontSize: 11, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontFamily: 'DM Mono', fontSize: 12, fontWeight: 700 }}>
          {p.name}: € {typeof p.value === 'number' ? p.value.toLocaleString('de-DE') : p.value}
        </p>
      ))}
    </div>
  )
}

const iconMap = { ShoppingCart, Train, ShoppingBag, Dumbbell, Music, Home, UtensilsCrossed, MoreHorizontal }

const transactionCategoryColors = {
  Lebensmittel: '#34D399',
  Restaurant: '#F5A623',
  Transport: '#60A5FA',
  Shopping: '#F472B6',
  'Sport & Fitness': '#00C2FF',
  Unterhaltung: '#A78BFA',
  Einnahmen: '#34D399',
  Sonstiges: '#94A3B8',
}

function CustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 9, fontFamily: 'DM Mono', fontWeight: 700 }}>
      {Math.round(percent * 100)}%
    </text>
  )
}

export default function Finanzen() {
  const { data } = useApp()
  const { monthly, categories, transactions, stats } = data.finance
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ amount: '', category: 'Lebensmittel', description: '' })

  const pieData = categories.filter(c => c.name !== 'Miete').map(c => ({
    name: c.name,
    value: c.spent,
    color: c.color,
  }))

  const balanceTrendPositive = stats.balanceTrend > 0

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-wrapper">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>

        {/* Header */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 12' }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Finanzen</h1>
            <p className="text-[#64748B] text-sm mt-0.5">Einnahmen, Ausgaben & Budgets im Blick</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #F5A623, #EF8C12)', color: '#000' }}
          >
            <Plus size={15} /> Ausgabe hinzufügen
          </motion.button>
        </motion.div>

        {/* Balance Card */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 4' }}>
          <Card accent="finance" className="h-full">
            <p className="text-xs text-[#64748B] uppercase tracking-widest mb-3">Kontostand</p>
            <div className="flex items-end gap-3 mb-2">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', bounce: 0.3 }}
                className="font-mono font-bold text-white leading-none"
                style={{ fontSize: 38 }}
              >
                € {stats.balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </motion.span>
            </div>
            <div className="flex items-center gap-1.5 mb-6">
              {balanceTrendPositive
                ? <TrendingUp size={14} style={{ color: '#34D399' }} />
                : <TrendingDown size={14} style={{ color: '#F87171' }} />}
              <span className="text-sm font-mono" style={{ color: balanceTrendPositive ? '#34D399' : '#F87171' }}>
                {balanceTrendPositive ? '+' : ''}€ {stats.balanceTrend.toFixed(2)} diesen Monat
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Monatl. Einnahmen', value: stats.monthlyIncome, color: '#34D399' },
                { label: 'Monatl. Ausgaben', value: stats.monthlyExpenses, color: '#F87171' },
                { label: 'Sparquote', value: `${stats.savingsRate}%`, color: '#F5A623', noEuro: true },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-xs text-[#64748B]">{item.label}</span>
                  <span className="font-mono text-sm font-bold" style={{ color: item.color }}>
                    {item.noEuro ? item.value : `€ ${item.value.toLocaleString('de-DE')}`}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Area Chart */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 8' }}>
          <Card>
            <h3 className="text-base font-semibold text-white mb-1">Einnahmen vs. Ausgaben</h3>
            <p className="text-xs text-[#64748B] mb-5">Letzte 7 Monate</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthly} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis dataKey="month" stroke="#1E2D45" tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'DM Mono' }} tickLine={false} />
                <YAxis stroke="#1E2D45" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'DM Mono' }} tickLine={false} axisLine={false}
                  tickFormatter={v => `€${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
                <Tooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="income" name="Einnahmen" stroke="#34D399" strokeWidth={2} fill="url(#incGrad)" dot={false} />
                <Area type="monotone" dataKey="expenses" name="Ausgaben" stroke="#F87171" strokeWidth={2} fill="url(#expGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Donut Chart */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 5' }}>
          <Card>
            <h3 className="text-base font-semibold text-white mb-1">Ausgaben nach Kategorie</h3>
            <p className="text-xs text-[#64748B] mb-4">Dieser Monat</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    dataKey="value" paddingAngle={2} labelLine={false} label={CustomPieLabel}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`€ ${v}`, '']} contentStyle={{ background: '#0F1624', border: '1px solid #1E2D45', borderRadius: 10, fontFamily: 'DM Mono' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1">
                {pieData.slice(0, 5).map(item => (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-xs text-[#94A3B8] truncate" style={{ maxWidth: 80 }}>{item.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-white">€{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Budget Bars */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 7' }}>
          <Card>
            <h3 className="text-base font-semibold text-white mb-1">Budget-Übersicht</h3>
            <p className="text-xs text-[#64748B] mb-5">Mai 2026</p>
            <div className="space-y-4">
              {categories.slice(0, 6).map(cat => {
                const pct = Math.min(100, (cat.spent / cat.budget) * 100)
                const isOver = pct >= 90
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                        <span className="text-[#94A3B8]">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono" style={{ color: isOver ? '#F87171' : '#64748B' }}>
                          € {cat.spent}
                        </span>
                        <span className="text-[#1E2D45]">/</span>
                        <span className="font-mono text-[#64748B]">€ {cat.budget}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#1E2D45' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: isOver ? '#F87171' : cat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Transactions */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 12' }}>
          <Card>
            <h3 className="text-base font-semibold text-white mb-5">Letzte Transaktionen</h3>
            <div className="space-y-2">
              {transactions.slice(0, 8).map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                  style={{ background: '#0A1020', border: '1px solid #1E2D45' }}
                  whileHover={{ borderColor: '#2A3F5A' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${transactionCategoryColors[tx.category] ?? '#64748B'}15` }}>
                    <span style={{ fontSize: 16 }}>
                      {tx.type === 'income' ? '💰' :
                        tx.category === 'Lebensmittel' ? '🛒' :
                        tx.category === 'Restaurant' ? '🍽️' :
                        tx.category === 'Transport' ? '🚇' :
                        tx.category === 'Shopping' ? '🛍️' :
                        tx.category === 'Sport & Fitness' ? '🏋️' : '🎵'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{tx.description}</p>
                    <p className="text-xs text-[#64748B]">{tx.category} · {tx.date}</p>
                  </div>
                  <span
                    className="font-mono font-bold text-sm shrink-0"
                    style={{ color: tx.type === 'income' ? '#34D399' : '#F87171' }}
                  >
                    {tx.type === 'income' ? '+' : ''}€ {Math.abs(tx.amount).toFixed(2)}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Add form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ gridColumn: 'span 12' }}
          >
            <Card accent="finance">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white">Ausgabe hinzufügen</h3>
                <button onClick={() => setShowForm(false)}><X size={16} className="text-[#64748B]" /></button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#64748B] block mb-2">Betrag (€)</label>
                  <input type="number" placeholder="0.00" value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: '#0A1020', border: '1px solid #1E2D45', fontFamily: 'DM Mono' }} />
                </div>
                <div>
                  <label className="text-xs text-[#64748B] block mb-2">Kategorie</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: '#0A1020', border: '1px solid #1E2D45', fontFamily: 'Outfit' }}>
                    {categories.map(c => <option key={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#64748B] block mb-2">Beschreibung</label>
                  <input type="text" placeholder="Was hast du gekauft?" value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: '#0A1020', border: '1px solid #1E2D45', fontFamily: 'Outfit' }} />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #F5A623, #EF8C12)', color: '#000' }}>
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
