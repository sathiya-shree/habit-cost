# 💸 HabitCost — React Native / Expo Mobile App

> **See the real money & time cost of your daily habits.**  
> Track coffee, Uber rides, subscriptions, takeout — and discover what you could do with that money instead.

---

## 🎨 Design System

| Attribute | Choice |
|-----------|--------|
| **Platform** | React Native / Expo (iOS + Android) |
| **State** | React Context + AsyncStorage (offline-first) |
| **Auth** | Local JWT-style sessions (swap with Firebase/Supabase for prod) |

---

## 📱 Screens

| Screen | Description |
|--------|-------------|
| **Splash** | Onboarding with animated feature cards and real stats |
| **Register** | Full validation, password strength meter, income input |
| **Login** | Email/password with error handling |
| **Dashboard** | Greeting, streak badge, stat cards, habit list, 10-year projection |
| **Analytics** | Bar chart, pie chart, time chart, insight cards, alternatives |
| **Profile** | Achievements, streak milestones, notification toggle, settings |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo`
- iOS: Xcode + Simulator **OR** Expo Go app
- Android: Android Studio **OR** Expo Go app

### 1. Install & Run

```bash
# Clone / unzip the project
cd habitcost

# Install all dependencies
npm install

# Start the Expo dev server
npx expo start
```

Then:
- **iOS Simulator** → press `i`
- **Android Emulator** → press `a`
- **Physical device** → scan QR code with Expo Go app (iOS/Android)

### 2. Environment (optional — for production backend)

Create a `.env` file:
```
EXPO_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## 🗂️ Project Structure

```
habitcost/
├── App.jsx                        ← Root: fonts, navigation, auth guard
├── app.json                       ← Expo config (icons, permissions, plugins)
├── babel.config.js
├── package.json
│
└── src/
    ├── context/
    │   └── AuthContext.jsx        ← User auth, habit CRUD, AsyncStorage persistence
    │
    ├── data/
    │   └── habits.js              ← Presets, helpers, formatters, achievements
    │
    ├── navigation/
    │   └── TabNavigator.jsx       ← Custom tropical bottom tab bar
    │
    ├── screens/
    │   ├── SplashScreen.jsx       ← Animated onboarding
    │   ├── RegisterScreen.jsx     ← Sign up with password strength
    │   ├── LoginScreen.jsx        ← Sign in with validation
    │   ├── DashboardScreen.jsx    ← Main home screen
    │   ├── AnalyticsScreen.jsx    ← Charts & insights
    │   └── ProfileScreen.jsx      ← Achievements, streaks, settings
    │
    ├── components/
    │   ├── UI.jsx                 ← All reusable components
    │   ├── HabitCard.jsx          ← Individual habit display card
    │   └── AddHabitSheet.jsx      ← Bottom sheet for adding habits
    │

```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **React Native 0.74** | Cross-platform iOS + Android |
| Build Tool | **Expo SDK 51** | Zero-config native builds |
| Navigation | **React Navigation v6** | Native stack + bottom tabs |
| Storage | **AsyncStorage** | Offline-first, no backend needed |
| Charts | **react-native-chart-kit** | Bar, pie, line charts |
| Animations | **React Native Animated API** | Sheet slide-up, fade-in |
| Fonts | **@expo-google-fonts/poppins** | Distinctive display font |
| Gradients | **expo-linear-gradient** | Tropical color system |
| Notifications | **expo-notifications** | Daily habit reminders |
| Auth | **Context + AsyncStorage** | Local sessions, easy swap to Firebase |

---

## ✨ Features

### 🔐 Authentication
- User registration with full validation (name, email, password, income)
- Password strength meter (Weak → Fair → Good → Strong)
- Persistent sessions (stays logged in across app restarts)
- Per-user data isolation

### 💰 Habit Tracking
- 12 preset habits (Coffee, Uber, Netflix, Swiggy, etc.)
- Custom habits with emoji picker
- Frequencies: Daily, Weekdays, Weekly, Monthly
- Auto-calculated: daily / monthly / yearly cost + time spent

### 📊 Analytics
- **Bar chart** — monthly cost per habit
- **Pie chart** — cost breakdown by category
- **Time chart** — time spent per month
- **Alternatives panel** — what you could buy with saved money
- **10-year projection** — spending vs compound investment returns

### 🔥 Streaks & Achievements
- Daily login streak counter with milestone badges (7, 14, 30, 60, 100 days)
- 6 achievements: First Step, Habit Hunter, On Fire, Unstoppable, Eye Opener, Smart Saver
- Visual locked/unlocked state per achievement

### 🔔 Notifications
- Daily reminder at custom time (default 8 PM)
- Permission request flow
- Toggle in Profile settings
- Milestone celebration notifications

---

## 🔌 Connecting to a Backend

The app currently uses AsyncStorage (local device storage).  
To connect to your FastAPI / Node.js backend:

### 1. Create `src/utils/api.js`
```js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### 2. Replace AuthContext functions
```js
// register()
const res = await api.post('/api/auth/register', { name, email, password, income });
await AsyncStorage.setItem('@token', res.data.token);

// login()
const res = await api.post('/api/auth/login', { email, password });
await AsyncStorage.setItem('@token', res.data.token);

// addHabit()
const res = await api.post('/api/habits/', habit);
```

---

## 📦 Build for Production

### Android APK / AAB
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Over-the-Air Updates
```bash
eas update --branch production --message "Bug fixes"
```

---

## 🌴 Screenshots

| Login | Home | Dashboard | Analytics | Profile | Add Habits |
|------|------|----------|-----------|---------|-------------|
| ![](login-page.jpeg) | ![](home-page.jpeg) | ![](dashboard.jpeg) | ![](analytics.jpeg) | ![](profile.jpeg) | ![](customise.jpeg) |

## 👨‍💻 Developer Notes

- All monetary calculations use `getMonthlyCost()` from `src/data/habits.js` — single source of truth
- Colors are defined once in `src/utils/theme.js` — change the whole app in one file
- Achievements auto-evaluate from live user data — no manual unlocking needed
- The `scheduleDailyReminder()` function handles permission requests automatically

---

## 📄 License

MIT — Free to use for academic purposes.

---
