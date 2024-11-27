import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {
    this.requestPermissions();
  }

  async requestPermissions() {
    await LocalNotifications.requestPermissions();
  }

  async scheduleNotification(habitId: string, habitName: string, time: Date) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: parseInt(habitId),
          title: 'Habit Reminder',
          body: `Time to complete your habit: ${habitName}`,
          schedule: { at: time, repeats: true }
        }
      ]
    });
  }

  async cancelNotification(habitId: string) {
    await LocalNotifications.cancel({
      notifications: [{ id: parseInt(habitId) }]
    });
  }
}