import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number[];
  reminder?: Date;
  streak: number;
  completedDates: string[];
  createdAt: Date;
  isPremium: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private habits = new BehaviorSubject<Habit[]>([]);
  private initialized = false;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    if (!this.initialized) {
      await this.storage.create();
      const habits = await this.storage.get('habits') || [];
      this.habits.next(habits);
      this.initialized = true;
    }
  }

  getHabits(): Observable<Habit[]> {
    return this.habits.asObservable();
  }

  getFreeHabits(): Observable<Habit[]> {
    return this.habits.pipe(
      map(habits => habits.filter(habit => !habit.isPremium))
    );
  }

  async addHabit(habit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'createdAt'>): Promise<void> {
    const currentHabits = this.habits.value;
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      streak: 0,
      completedDates: [],
      createdAt: new Date()
    };
    
    const updatedHabits = [...currentHabits, newHabit];
    await this.storage.set('habits', updatedHabits);
    this.habits.next(updatedHabits);
  }

  async completeHabit(habitId: string, date: Date): Promise<void> {
    const currentHabits = this.habits.value;
    const habitIndex = currentHabits.findIndex(h => h.id === habitId);
    
    if (habitIndex === -1) return;

    const habit = { ...currentHabits[habitIndex] };
    const dateString = date.toISOString().split('T')[0];
    
    if (!habit.completedDates.includes(dateString)) {
      habit.completedDates.push(dateString);
      habit.streak = this.calculateStreak(habit.completedDates);
      
      const updatedHabits = [
        ...currentHabits.slice(0, habitIndex),
        habit,
        ...currentHabits.slice(habitIndex + 1)
      ];
      
      await this.storage.set('habits', updatedHabits);
      this.habits.next(updatedHabits);
    }
  }

  private calculateStreak(completedDates: string[]): number {
    if (completedDates.length === 0) return 0;
    
    const sortedDates = [...completedDates].sort();
    let streak = 1;
    let currentDate = new Date(sortedDates[sortedDates.length - 1]);
    
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const prevDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
}