// src/data/habits.js

export const HABIT_PRESETS = [
  { id: 'coffee',      name: 'Coffee',          emoji: '☕', cost: 150,  time: 15, freq: 'daily',    category: 'Food & Drink',    color: '#FF9F43' },
  { id: 'uber',        name: 'Cab / Uber',       emoji: '🚗', cost: 300,  time: 30, freq: 'daily',    category: 'Transport',       color: '#0CB8A4' },
  { id: 'takeout',     name: 'Swiggy / Zomato',  emoji: '🍔', cost: 400,  time: 10, freq: 'daily',    category: 'Food & Drink',    color: '#FF6B6B' },
  { id: 'netflix',     name: 'Netflix',          emoji: '📺', cost: 649,  time: 90, freq: 'monthly',  category: 'Entertainment',   color: '#A29BFE' },
  { id: 'smoking',     name: 'Cigarettes',       emoji: '🚬', cost: 300,  time: 20, freq: 'daily',    category: 'Health',          color: '#636E72' },
  { id: 'gym',         name: 'Gym Skip',         emoji: '💪', cost: 1500, time: 0,  freq: 'monthly',  category: 'Health',          color: '#7ED321' },
  { id: 'shopping',    name: 'Impulse Shopping', emoji: '🛍️', cost: 2000, time: 120,freq: 'weekly',   category: 'Shopping',        color: '#FD79A8' },
  { id: 'alcohol',     name: 'Alcohol',          emoji: '🍺', cost: 400,  time: 60, freq: 'weekly',   category: 'Food & Drink',    color: '#FDCB6E' },
  { id: 'snacks',      name: 'Snacks',           emoji: '🍿', cost: 80,   time: 20, freq: 'daily',    category: 'Food & Drink',    color: '#FF9F43' },
  { id: 'spotify',     name: 'Spotify',          emoji: '🎵', cost: 119,  time: 30, freq: 'monthly',  category: 'Entertainment',   color: '#00B894' },
  { id: 'bubble_tea',  name: 'Bubble Tea',       emoji: '🧋', cost: 200,  time: 20, freq: 'daily',    category: 'Food & Drink',    color: '#E17055' },
  { id: 'gaming',      name: 'Gaming',           emoji: '🎮', cost: 500,  time: 120,freq: 'weekly',   category: 'Entertainment',   color: '#6C5CE7' },
];

export const EMOJIS = [
  '☕','🚗','🍔','🎵','📺','🍺','🚬','💪','🛍️','🎮',
  '🍿','🧋','🍕','🧴','📱','🎬','🏃','🧘','🍫','🍰',
  '🥤','🎯','📚','🌿','🏖️','🚀','💅','🎸','🍜','🥗',
];

export const CATEGORIES = [
  'Food & Drink', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Personal Care', 'Other'
];

export const FREQUENCY_OPTIONS = [
  { key: 'daily',    label: 'Daily',    multiplier: 30    },
  { key: 'weekdays', label: 'Weekdays', multiplier: 22    },
  { key: 'weekly',   label: 'Weekly',   multiplier: 4.33  },
  { key: 'monthly',  label: 'Monthly',  multiplier: 1     },
];

export function getMultiplier(freq) {
  return FREQUENCY_OPTIONS.find(f => f.key === freq)?.multiplier ?? 30;
}

export function getMonthlyCost(habit) {
  return habit.cost * getMultiplier(habit.freq);
}

export function getYearlyCost(habit) {
  return getMonthlyCost(habit) * 12;
}

export function getMonthlyMinutes(habit) {
  return (habit.time || 0) * getMultiplier(habit.freq);
}

export function formatCurrency(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return `₹${Math.round(amount)}`;
}

export function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getTenYearProjection(monthlyAmount) {
  // Simple compound interest: monthly SIP at 12% pa = 1% pm
  let invested = 0;
  for (let i = 0; i < 120; i++) {
    invested = (invested + monthlyAmount) * 1.01;
  }
  return { spent: monthlyAmount * 12 * 10, invested: Math.round(invested) };
}

export const ACHIEVEMENT_LIST = [
  { id: 'first_habit',  name: 'First Step',     desc: 'Add your first habit',          icon: '🌱', target: 1,    metric: 'habits_count'    },
  { id: 'five_habits',  name: 'Habit Hunter',   desc: 'Track 5 habits',                icon: '🎯', target: 5,    metric: 'habits_count'    },
  { id: 'seven_streak', name: 'On Fire 🔥',     desc: 'Log in 7 days in a row',        icon: '🔥', target: 7,    metric: 'streak'          },
  { id: 'thirty_streak',name: 'Unstoppable',    desc: '30-day streak',                 icon: '⚡', target: 30,   metric: 'streak'          },
  { id: 'big_spender',  name: 'Eye Opener',     desc: 'Discover ₹10k/mo in habits',   icon: '👀', target: 10000,metric: 'monthly_total'   },
  { id: 'saver',        name: 'Smart Saver',    desc: 'Cut spending by 20%',           icon: '💰', target: 20,   metric: 'reduction_pct'   },
];

export const ALTERNATIVES = [
  { label: 'International flight',  cost: 45000,  icon: '✈️'  },
  { label: 'New iPhone',            cost: 80000,  icon: '📱'  },
  { label: 'Goa trip',              cost: 25000,  icon: '🏖️'  },
  { label: 'MacBook Air',           cost: 110000, icon: '💻'  },
  { label: 'Mutual Fund SIP (1yr)', cost: 60000,  icon: '📈'  },
  { label: 'Scooter down payment',  cost: 20000,  icon: '🛵'  },
];
