// src/utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

async function setupChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habitcost-reminders', {
      name: 'HabitCost Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0CB8A4',
      sound: true,
    });
  }
}

export async function scheduleDailyReminders(userName = '') {
  try {
    // Cancel all old notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    await setupChannel();

    const name = userName || 'there';

    // ── MORNING notification (8:00 AM) ──
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Good Morning from HabitCost!',
        body: `Hey ${name}! Start your day mindfully — check what your habits will cost you today.`,
        sound: true,
        data: { type: 'morning_reminder' },
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
        channelId: 'habitcost-reminders',
      },
    });

    // ── EVENING notification (8:00 PM) ──
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Evening Check-in — HabitCost',
        body: `Hey ${name}! How did your habits go today? Log them now to stay on track 💪`,
        sound: true,
        data: { type: 'evening_reminder' },
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
        channelId: 'habitcost-reminders',
      },
    });

    console.log('✓ Morning (8AM) and Evening (8PM) reminders scheduled');
    return true;
  } catch (e) {
    console.log('Schedule error:', e);
    return false;
  }
}

export async function cancelReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {}
}

export async function sendTestNotification(userName = '') {
  try {
    await setupChannel();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Notifications are working!',
        body: `Great ${userName}! You will now get reminders at 8AM and 8PM every day.`,
        sound: true,
      },
      trigger: null, // shows immediately
    });
    return true;
  } catch (e) {
    console.log('Test notification error:', e);
    return false;
  }
}

export async function sendMilestoneNotification(achievement) {
  try {
    await setupChannel();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏆 Achievement Unlocked!',
        body: `You earned "${achievement.name}" — ${achievement.desc}`,
        sound: true,
      },
      trigger: null,
    });
  } catch (e) {}
}

// Keep old name working too
export const scheduleDailyReminder = scheduleDailyReminders;
