// Deterministic mock data relative to 2026-05-12

const TODAY = new Date('2026-05-12')

function daysAgo(n) {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function addDays(dateStr, n) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

// Pseudo-random but deterministic
function seeded(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  const r = x - Math.floor(x)
  return Math.round(r * (max - min) + min)
}

// --- HEALTH DATA ---
const steps = Array.from({ length: 30 }, (_, i) => ({
  date: daysAgo(29 - i),
  count: seeded(i * 7 + 1, 5800, 13200),
}))

const sleep = Array.from({ length: 30 }, (_, i) => ({
  date: daysAgo(29 - i),
  hours: parseFloat((seeded(i * 3 + 2, 60, 90) / 10).toFixed(1)),
  quality: seeded(i * 5 + 3, 2, 5),
  deepSleep: parseFloat((seeded(i * 2 + 4, 10, 25) / 10).toFixed(1)),
}))

const workoutTypes = ['Laufen', 'Krafttraining', 'Radfahren', 'HIIT', 'Yoga', 'Schwimmen']
const workoutColors = {
  Laufen: '#00C2FF',
  Krafttraining: '#A78BFA',
  Radfahren: '#F5A623',
  HIIT: '#F472B6',
  Yoga: '#34D399',
  Schwimmen: '#60A5FA',
}

const workouts = [
  { date: daysAgo(0), type: 'Laufen', duration: 45, km: 8.2, notes: 'Guter Lauf im Park, Bestzeit!' },
  { date: daysAgo(1), type: 'Krafttraining', duration: 60, km: null, notes: 'Oberkörper – Push-Pull' },
  { date: daysAgo(3), type: 'HIIT', duration: 30, km: null, notes: '5x Tabata, sehr intensiv' },
  { date: daysAgo(4), type: 'Laufen', duration: 35, km: 6.0, notes: 'Entspannter Recovery-Lauf' },
  { date: daysAgo(6), type: 'Radfahren', duration: 90, km: 38.5, notes: 'Tour durch den Wald' },
  { date: daysAgo(7), type: 'Krafttraining', duration: 55, km: null, notes: 'Beine + Core' },
  { date: daysAgo(9), type: 'Laufen', duration: 70, km: 12.5, notes: 'Langer Lauf – Marathon Training' },
  { date: daysAgo(10), type: 'Yoga', duration: 45, km: null, notes: 'Vinyasa Flow – sehr entspannend' },
  { date: daysAgo(11), type: 'Krafttraining', duration: 60, km: null, notes: 'Oberkörper' },
  { date: daysAgo(13), type: 'Schwimmen', duration: 45, km: null, notes: '1500m Kraul' },
  { date: daysAgo(14), type: 'HIIT', duration: 25, km: null, notes: 'Kurz aber brutal' },
  { date: daysAgo(16), type: 'Laufen', duration: 50, km: 9.0, notes: 'Tempolauf Intervalle' },
  { date: daysAgo(17), type: 'Krafttraining', duration: 60, km: null, notes: 'Rücken + Bizeps' },
  { date: daysAgo(20), type: 'Laufen', duration: 80, km: 15.0, notes: 'Langer Sonntags-Lauf' },
  { date: daysAgo(21), type: 'Radfahren', duration: 60, km: 24.0, notes: 'Pendelfahrt' },
  { date: daysAgo(23), type: 'Krafttraining', duration: 55, km: null, notes: 'Beine – Squat PR!' },
  { date: daysAgo(24), type: 'Yoga', duration: 60, km: null, notes: 'Yin Yoga – perfekt nach Beintag' },
  { date: daysAgo(27), type: 'Laufen', duration: 40, km: 7.0, notes: 'Easy Run' },
  { date: daysAgo(28), type: 'Krafttraining', duration: 60, km: null, notes: 'Chest & Triceps' },
]

// Weekly workouts summary (last 12 weeks)
const weeklyWorkouts = Array.from({ length: 12 }, (_, i) => ({
  week: `KW ${10 + i}`,
  count: seeded(i * 11 + 5, 2, 6),
}))

const healthStats = {
  weight: 82.4,
  weightTrend: -0.3,
  heartRate: 58,
  heartRateTrend: -2,
  weeklyKm: 31.7,
  activeMinutesGoal: 150,
  activeMinutes: 127,
  stepsGoal: 10000,
  todaySteps: steps[steps.length - 1].count,
  sleepGoal: 8,
  lastSleepHours: sleep[sleep.length - 1].hours,
}

// --- FINANCE DATA ---
const monthlyFinance = [
  { month: 'Nov', income: 3200, expenses: 2180, savings: 1020 },
  { month: 'Dez', income: 3450, expenses: 2890, savings: 560 },
  { month: 'Jan', income: 3200, expenses: 1980, savings: 1220 },
  { month: 'Feb', income: 3200, expenses: 2100, savings: 1100 },
  { month: 'Mär', income: 3650, expenses: 2240, savings: 1410 },
  { month: 'Apr', income: 3200, expenses: 2050, savings: 1150 },
  { month: 'Mai', income: 1600, expenses: 920, savings: 680 },
]

const categories = [
  { name: 'Miete', icon: 'Home', color: '#64748B', spent: 980, budget: 980 },
  { name: 'Lebensmittel', icon: 'ShoppingCart', color: '#34D399', spent: 320, budget: 400 },
  { name: 'Restaurant', icon: 'UtensilsCrossed', color: '#F5A623', spent: 156, budget: 200 },
  { name: 'Transport', icon: 'Train', color: '#60A5FA', spent: 89, budget: 150 },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#F472B6', spent: 218, budget: 250 },
  { name: 'Sport & Fitness', icon: 'Dumbbell', color: '#00C2FF', spent: 40, budget: 80 },
  { name: 'Unterhaltung', icon: 'Music', color: '#A78BFA', spent: 65, budget: 100 },
  { name: 'Sonstiges', icon: 'MoreHorizontal', color: '#94A3B8', spent: 52, budget: 100 },
]

const transactions = [
  { id: 1, date: daysAgo(0), description: 'Edeka Supermarkt', category: 'Lebensmittel', amount: -45.80, type: 'expense' },
  { id: 2, date: daysAgo(0), description: 'Starbucks Potsdamer Platz', category: 'Restaurant', amount: -6.50, type: 'expense' },
  { id: 3, date: daysAgo(1), description: 'Spotify Premium', category: 'Unterhaltung', amount: -9.99, type: 'expense' },
  { id: 4, date: daysAgo(1), description: 'Nike Running Schuhe', category: 'Sport & Fitness', amount: -89.95, type: 'expense' },
  { id: 5, date: daysAgo(2), description: 'Freelance Design Projekt', category: 'Einnahmen', amount: +450.00, type: 'income' },
  { id: 6, date: daysAgo(3), description: 'Zalando Bestellung', category: 'Shopping', amount: -127.50, type: 'expense' },
  { id: 7, date: daysAgo(3), description: 'BVG Monatskarte', category: 'Transport', amount: -86.00, type: 'expense' },
  { id: 8, date: daysAgo(4), description: 'Fitnessstudio Abo', category: 'Sport & Fitness', amount: -39.99, type: 'expense' },
  { id: 9, date: daysAgo(4), description: 'Restaurant Katz Orange', category: 'Restaurant', amount: -78.00, type: 'expense' },
  { id: 10, date: daysAgo(5), description: 'REWE Supermarkt', category: 'Lebensmittel', amount: -62.40, type: 'expense' },
  { id: 11, date: daysAgo(6), description: 'Netflix', category: 'Unterhaltung', amount: -17.99, type: 'expense' },
  { id: 12, date: daysAgo(7), description: 'Gehalt Mai', category: 'Einnahmen', amount: +3200.00, type: 'income' },
  { id: 13, date: daysAgo(8), description: 'H&M Online Shop', category: 'Shopping', amount: -89.95, type: 'expense' },
  { id: 14, date: daysAgo(9), description: 'Apotheke', category: 'Sonstiges', amount: -23.50, type: 'expense' },
  { id: 15, date: daysAgo(10), description: 'Wochenmarkt', category: 'Lebensmittel', amount: -34.00, type: 'expense' },
]

const financeStats = {
  balance: 8247.50,
  balanceTrend: +342.80,
  monthlyIncome: 3200,
  monthlyExpenses: 1920,
  savingsRate: 40,
  spendingBudgetUsed: 78,
}

// --- HABITS DATA ---
function generateCompletions(streakDays, totalDays = 90, missEvery = 7) {
  const completions = []
  for (let i = 0; i < totalDays; i++) {
    const dayBack = totalDays - 1 - i
    if (dayBack < streakDays) {
      completions.push(daysAgo(dayBack))
    } else if (i % missEvery !== 0) {
      completions.push(daysAgo(dayBack))
    }
  }
  return completions
}

const habits = [
  {
    id: 1,
    name: 'Meditation',
    description: '10 Minuten täglich',
    icon: 'Brain',
    color: '#A78BFA',
    streak: 18,
    longestStreak: 34,
    completions: generateCompletions(18, 90, 8),
    completedToday: true,
    target: 'täglich',
  },
  {
    id: 2,
    name: 'Lesen',
    description: '30 Seiten täglich',
    icon: 'BookOpen',
    color: '#F5A623',
    streak: 7,
    longestStreak: 21,
    completions: generateCompletions(7, 90, 5),
    completedToday: true,
    target: 'täglich',
  },
  {
    id: 3,
    name: '2L Wasser',
    description: 'Mindest-Tagesmenge',
    icon: 'Droplets',
    color: '#00C2FF',
    streak: 23,
    longestStreak: 45,
    completions: generateCompletions(23, 90, 12),
    completedToday: true,
    target: 'täglich',
  },
  {
    id: 4,
    name: 'Sport',
    description: 'Aktiv bewegen',
    icon: 'Dumbbell',
    color: '#34D399',
    streak: 12,
    longestStreak: 18,
    completions: generateCompletions(12, 90, 4),
    completedToday: false,
    target: '5x/Woche',
  },
  {
    id: 5,
    name: 'Journaling',
    description: 'Tagesreflexion',
    icon: 'PenLine',
    color: '#F472B6',
    streak: 5,
    longestStreak: 12,
    completions: generateCompletions(5, 90, 6),
    completedToday: false,
    target: 'täglich',
  },
  {
    id: 6,
    name: 'Spanisch',
    description: 'Vokabeln & Übungen',
    icon: 'Languages',
    color: '#FB923C',
    streak: 3,
    longestStreak: 8,
    completions: generateCompletions(3, 90, 3),
    completedToday: false,
    target: 'täglich',
  },
]

// Weekly habit completion rates
const weeklyHabitData = [
  { week: 'KW 15', rate: 72 },
  { week: 'KW 16', rate: 68 },
  { week: 'KW 17', rate: 85 },
  { week: 'KW 18', rate: 80 },
  { week: 'KW 19', rate: 91 },
  { week: 'KW 20', rate: 88 },
]

const goals = [
  {
    id: 1,
    title: 'Marathon laufen',
    description: 'Berlin Marathon – September 2026',
    category: 'health',
    icon: 'Trophy',
    current: 18.5,
    target: 42.2,
    unit: 'km Longrun',
    targetDate: '2026-09-27',
    color: '#00C2FF',
  },
  {
    id: 2,
    title: 'Ersparnisse',
    description: 'Notgroschen aufbauen',
    category: 'finance',
    icon: 'PiggyBank',
    current: 8247,
    target: 15000,
    unit: '€',
    targetDate: '2026-12-31',
    color: '#F5A623',
  },
  {
    id: 3,
    title: '20 Bücher lesen',
    description: 'Jahres-Leseziel 2026',
    category: 'habits',
    icon: 'BookOpen',
    current: 7,
    target: 20,
    unit: 'Bücher',
    targetDate: '2026-12-31',
    color: '#A78BFA',
  },
  {
    id: 4,
    title: 'Zielgewicht',
    description: 'Gesunder BMI erreichen',
    category: 'health',
    icon: 'Scale',
    current: 82.4,
    target: 78.0,
    unit: 'kg',
    targetDate: '2026-08-01',
    color: '#34D399',
    inverted: true,
  },
]

// --- CALENDAR DATA ---
const events = [
  {
    id: 1,
    title: 'Sport mit Jonas',
    date: '2026-05-13',
    time: '18:30',
    duration: 90,
    color: '#00C2FF',
    category: 'sport',
    location: 'Mauerpark, Berlin',
    description: 'Basketball + Laufen',
  },
  {
    id: 2,
    title: 'Zahnarzt Dr. Müller',
    date: '2026-05-14',
    time: '10:00',
    duration: 60,
    color: '#64748B',
    category: 'gesundheit',
    location: 'Praxis Mitte, Torstraße 12',
    description: 'Halbjahrescheck + Reinigung',
  },
  {
    id: 3,
    title: 'Teammeeting (Remote)',
    date: '2026-05-15',
    time: '14:00',
    duration: 90,
    color: '#60A5FA',
    category: 'arbeit',
    location: 'Zoom',
    description: 'Q2 Sprint Planning',
  },
  {
    id: 4,
    title: 'Eltern besuchen',
    date: '2026-05-17',
    time: '12:00',
    duration: 300,
    color: '#F472B6',
    category: 'familie',
    location: 'Potsdam',
    description: 'Mittagessen + Spaziergang',
  },
  {
    id: 5,
    title: 'Sportgruppe Laufen',
    date: '2026-05-20',
    time: '18:00',
    duration: 75,
    color: '#00C2FF',
    category: 'sport',
    location: 'Tempelhof',
    description: 'Wöchentlicher Gruppenrun',
  },
  {
    id: 6,
    title: 'Konzert — Kraftklub',
    date: '2026-05-22',
    time: '20:00',
    duration: 180,
    color: '#A78BFA',
    category: 'freizeit',
    location: 'Velodrom Berlin',
    description: 'Mit Lena und Tom',
  },
  {
    id: 7,
    title: 'Wochenmarkt',
    date: '2026-05-23',
    time: '09:00',
    duration: 60,
    color: '#34D399',
    category: 'freizeit',
    location: 'Kollwitzplatz',
    description: 'Frisches Obst & Gemüse',
  },
  {
    id: 8,
    title: 'Langer Lauf — Marathon Training',
    date: '2026-05-25',
    time: '08:00',
    duration: 150,
    color: '#00C2FF',
    category: 'sport',
    location: 'Grunewald',
    description: '22km Longrun Pace 5:20/km',
  },
  {
    id: 9,
    title: 'Urlaub buchen — Deadline!',
    date: '2026-05-28',
    time: '23:59',
    duration: 30,
    color: '#F5A623',
    category: 'wichtig',
    location: '',
    description: 'Portugal oder Kreta — Entscheidung treffen!',
  },
  {
    id: 10,
    title: 'Freundeskreis Dinner',
    date: '2026-05-30',
    time: '19:30',
    duration: 180,
    color: '#F472B6',
    category: 'sozial',
    location: 'Restaurant Zola, Berlin',
    description: 'Mit Max, Lena, Jonas, Anna',
  },
  {
    id: 11,
    title: 'Monatsreview',
    date: '2026-05-31',
    time: '10:00',
    duration: 60,
    color: '#A78BFA',
    category: 'persoenlich',
    location: 'Zuhause',
    description: 'Ziele auswerten + Juni planen',
  },
  {
    id: 12,
    title: 'Call mit Entwickler Team',
    date: '2026-06-01',
    time: '09:00',
    duration: 60,
    color: '#60A5FA',
    category: 'arbeit',
    location: 'Google Meet',
    description: 'Projekt-Kickoff neuer Client',
  },
  {
    id: 13,
    title: 'Physiotherapie',
    date: '2026-05-19',
    time: '11:00',
    duration: 60,
    color: '#64748B',
    category: 'gesundheit',
    location: 'Physio Berlin Mitte',
    description: 'Schulter Rehabilitation',
  },
]

// Time blocking for today (May 12)
const todayTimeBlocks = [
  { start: 7, end: 7.5, label: 'Meditation', color: '#A78BFA', category: 'habit' },
  { start: 8, end: 9.5, label: 'Deep Work — Feature Entwicklung', color: '#60A5FA', category: 'arbeit' },
  { start: 10, end: 10.5, label: 'Kaffee + E-Mails', color: '#64748B', category: 'sonstiges' },
  { start: 11, end: 12.5, label: 'Deep Work — Code Review', color: '#60A5FA', category: 'arbeit' },
  { start: 12.5, end: 13.5, label: 'Mittagspause + Spaziergang', color: '#34D399', category: 'pause' },
  { start: 14, end: 15.5, label: 'Meeting Vorbereitung', color: '#60A5FA', category: 'arbeit' },
  { start: 16, end: 17, label: 'Lesen', color: '#F5A623', category: 'habit' },
  { start: 17.5, end: 19, label: 'Abendlauf 8km', color: '#00C2FF', category: 'sport' },
  { start: 20, end: 20.5, label: 'Journaling', color: '#F472B6', category: 'habit' },
]

// --- LIFE SCORE CALCULATION ---
function calculateLifeScore() {
  const todaySteps = steps[steps.length - 1].count
  const todaySleep = sleep[sleep.length - 1].hours
  const healthScore = Math.min(100, Math.round(
    (todaySteps / 10000) * 40 + (todaySleep / 8) * 40 + 20
  ))

  const savingsRate = financeStats.savingsRate
  const budgetAdherence = 100 - financeStats.spendingBudgetUsed + 22
  const financeScore = Math.round((savingsRate * 0.6 + budgetAdherence * 0.4))

  const totalHabits = habits.length
  const completedToday = habits.filter(h => h.completedToday).length
  const avgStreak = habits.reduce((a, h) => a + h.streak, 0) / habits.length
  const habitsScore = Math.round((completedToday / totalHabits) * 60 + Math.min(40, avgStreak * 2))

  const goalsScore = Math.round(
    goals.reduce((acc, g) => {
      const pct = g.inverted
        ? Math.max(0, (g.target - (g.current - g.target)) / g.target)
        : g.current / g.target
      return acc + Math.min(100, pct * 100)
    }, 0) / goals.length
  )

  return {
    total: Math.round((healthScore + financeScore + habitsScore + goalsScore) / 4),
    health: healthScore,
    finance: financeScore,
    habits: habitsScore,
    goals: goalsScore,
  }
}

export const mockData = {
  health: {
    steps,
    sleep,
    workouts,
    weeklyWorkouts,
    stats: healthStats,
    workoutColors,
  },
  finance: {
    monthly: monthlyFinance,
    categories,
    transactions,
    stats: financeStats,
  },
  habits: {
    list: habits,
    goals,
    weeklyData: weeklyHabitData,
  },
  calendar: {
    events,
    todayTimeBlocks,
  },
  lifeScore: calculateLifeScore(),
}

export function initData() {
  const existing = localStorage.getItem('lifeos_data')
  if (!existing) {
    localStorage.setItem('lifeos_data', JSON.stringify(mockData))
  }
  return mockData
}

export { workoutColors }
