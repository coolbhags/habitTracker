import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { HabitService, Habit } from '../../services/habit.service';
import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-habits',
  templateUrl: './habits.page.html',
  styleUrls: ['./habits.page.scss'],
})
export class HabitsPage implements OnInit {
  habits$: Observable<Habit[]>;

  constructor(
    private habitService: HabitService,
    private notificationService: NotificationService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.habits$ = this.habitService.getHabits();
  }

  ngOnInit() {}

  async addHabit() {
    const alert = await this.alertController.create({
      header: 'New Habit',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Habit name'
        },
        {
          name: 'frequency',
          type: 'select',
          placeholder: 'Frequency',
          options: [
            { text: 'Daily', value: 'daily' },
            { text: 'Weekly', value: 'weekly' },
            { text: 'Custom', value: 'custom' }
          ]
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (data.name && data.frequency) {
              this.habitService.addHabit({
                name: data.name,
                frequency: data.frequency,
                isPremium: false
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async completeHabit(habit: Habit) {
    await this.habitService.completeHabit(habit.id, new Date());
  }
}