import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Zap } from 'lucide-react'
import { useApp } from '../../App'

const moods = [
  { emoji: '😴', label: 'Erschöpft' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Gut' },
  { emoji: '😊', label: 'Super' },
  { emoji: '🔥', label: 'Energisch' },
]

export default function DailyCheckIn({ onClose }) {
  const { completeCheckIn } = useApp()
  const [step, setStep] = useState(0)
  const [sleepRating, setSleepRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [energy, setEnergy] = useState(7)
  const [mood, setMood] = useState(null)
  const [priority, setPriority] = useState('')

  const hour = 9
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 17 ? 'Guten Nachmittag' : 'Guten Abend'

  const handleFinish = () => {
    completeCheckIn()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        className="w-full max-w-md relative"
        style={{
          background: 'rgba(15,22,36,0.98)',
          border: '1px solid #1E2D45',
          borderRadius: 24,
          overflow: 'hidden',
        }}
      >
        {/* Header gradient line */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #00C2FF, #A78BFA, #34D399)' }} />

        <div className="p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: '#1E2D45', color: '#64748B' }}
          >
            <X size={14} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00C2FF, #A78BFA)' }}>
              <Zap size={13} color="#fff" fill="#fff" />
            </div>
            <span className="font-bold text-sm tracking-widest text-[#64748B]">LIFE OS</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-1">{greeting}, Enzo! ☀️</h2>
                <p className="text-[#64748B] mb-8">Lass uns deinen Tag starten. Wie war dein Schlaf?</p>

                {/* Sleep rating */}
                <div className="mb-8">
                  <p className="text-sm text-[#94A3B8] mb-4">Schlafqualität</p>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSleepRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                      >
                        <Star
                          size={32}
                          fill={(hoveredStar || sleepRating) >= star ? '#F5A623' : 'transparent'}
                          stroke={(hoveredStar || sleepRating) >= star ? '#F5A623' : '#1E2D45'}
                          strokeWidth={1.5}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {sleepRating > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-[#F5A623] mt-2"
                    >
                      {['', 'Sehr schlecht', 'Schlecht', 'Okay', 'Gut', 'Ausgezeichnet'][sleepRating]}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(1)}
                  disabled={!sleepRating}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background: sleepRating ? 'linear-gradient(135deg, #00C2FF, #6366F1)' : '#1E2D45',
                    color: sleepRating ? '#fff' : '#64748B',
                  }}
                >
                  Weiter →
                </motion.button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-1">Wie ist deine Energie?</h2>
                <p className="text-[#64748B] mb-8">Auf einer Skala von 1–10</p>

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-[#64748B]">Erschöpft</span>
                    <span className="font-mono font-bold text-2xl" style={{ color: '#00C2FF' }}>{energy}</span>
                    <span className="text-xs text-[#64748B]">Topfit</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={energy}
                    onChange={e => setEnergy(+e.target.value)}
                    className="w-full"
                    style={{ accentColor: '#00C2FF' }}
                  />
                </div>

                <p className="text-sm text-[#94A3B8] mb-4 mt-8">Stimmung heute</p>
                <div className="flex gap-3 mb-8">
                  {moods.map(m => (
                    <motion.button
                      key={m.emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setMood(m.emoji)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all"
                        style={{
                          background: mood === m.emoji ? 'rgba(167,139,250,0.2)' : '#1E2D45',
                          border: mood === m.emoji ? '2px solid #A78BFA' : '2px solid transparent',
                        }}
                      >
                        {m.emoji}
                      </div>
                      <span className="text-[10px] text-[#64748B]">{m.label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-4 py-3 rounded-xl text-sm text-[#64748B]"
                    style={{ background: '#1E2D45' }}>
                    ←
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #A78BFA, #6366F1)' }}
                  >
                    Weiter →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-1">Heutige Priorität</h2>
                <p className="text-[#64748B] mb-8">Was ist dein wichtigstes Ziel für heute?</p>

                <input
                  type="text"
                  placeholder="z.B. Deep Work Session abschließen…"
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-[#64748B] outline-none mb-8 transition-all"
                  style={{
                    background: '#0A1020',
                    border: '1px solid #1E2D45',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#34D399' }}
                  onBlur={e => { e.target.style.borderColor = '#1E2D45' }}
                  autoFocus
                />

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-4 py-3 rounded-xl text-sm text-[#64748B]"
                    style={{ background: '#1E2D45' }}>
                    ←
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinish}
                    className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #34D399, #059669)' }}
                  >
                    Los geht's! ✨
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1.5 justify-center pb-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: step === i ? 24 : 8,
                background: step === i ? '#00C2FF' : '#1E2D45',
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
