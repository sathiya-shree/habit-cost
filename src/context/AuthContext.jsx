// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext  = createContext(null);
const STORAGE_KEY  = '@habitcost_users_v2';
const SESSION_KEY  = '@habitcost_session_v2';

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { restoreSession(); }, []);

  async function getAllUsers() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  async function saveAllUsers(users) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  async function restoreSession() {
    try {
      const id = await AsyncStorage.getItem(SESSION_KEY);
      if (id) {
        const users = await getAllUsers();
        const found = users.find(u => u.id === id);
        if (found) { setUser(found); }
      }
    } catch {}
    setLoading(false);
  }

  async function register({ name, email, password, income }) {
    const users = await getAllUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id:           `user_${Date.now()}`,
      name:         name.trim(),
      email:        email.trim().toLowerCase(),
      password,
      income:       income || 50000,
      habits:       [],
      streak:       1,
      lastLogin:    new Date().toISOString(),
      joinedAt:     new Date().toISOString(),
      notificationsEnabled: true,
      reminderTime: '20:00',
      currency:     '₹',
    };
    users.push(newUser);
    await saveAllUsers(users);
    await AsyncStorage.setItem(SESSION_KEY, newUser.id);
    setUser(newUser);
    return newUser;
  }

  async function login({ email, password }) {
    const users = await getAllUsers();
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found)                   throw new Error('No account found with this email.');
    if (found.password !== password) throw new Error('Incorrect password.');

    // Update streak
    const last     = new Date(found.lastLogin);
    const today    = new Date();
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
    if      (diffDays === 1) found.streak = (found.streak || 0) + 1;
    else if (diffDays > 1)   found.streak = 1;
    found.lastLogin = today.toISOString();

    const updated = users.map(u => u.id === found.id ? found : u);
    await saveAllUsers(updated);
    await AsyncStorage.setItem(SESSION_KEY, found.id);
    setUser(found);
    return found;
  }

  async function logout() {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  async function updateUser(updates) {
    const users   = await getAllUsers();
    const updated = { ...user, ...updates };
    const list    = users.map(u => u.id === user.id ? updated : u);
    await saveAllUsers(list);
    setUser(updated);
    return updated;
  }

  async function addHabit(habit) {
    const newHabit = { ...habit, id: `habit_${Date.now()}`, createdAt: new Date().toISOString() };
    return updateUser({ habits: [...(user.habits || []), newHabit] });
  }

  async function updateHabit(id, changes) {
    const habits = (user.habits || []).map(h => h.id === id ? { ...h, ...changes } : h);
    return updateUser({ habits });
  }

  async function deleteHabit(id) {
    const habits = (user.habits || []).filter(h => h.id !== id);
    return updateUser({ habits });
  }

  async function clearAllHabits() {
    return updateUser({ habits: [] });
  }

  return (
    <AuthContext.Provider value={{
      user, loading,
      register, login, logout,
      updateUser, addHabit, updateHabit, deleteHabit, clearAllHabits,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
