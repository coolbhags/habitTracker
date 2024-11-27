import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = false;

  constructor(
    private platform: Platform,
    private storage: Storage
  ) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const savedTheme = await this.storage.get('darkMode');
    
    if (savedTheme !== null) {
      this.setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.setTheme(prefersDark.matches);
    }
  }

  async setTheme(dark: boolean) {
    this.darkMode = dark;
    document.body.classList.toggle('dark', dark);
    await this.storage.set('darkMode', dark);
  }

  async toggleTheme() {
    await this.setTheme(!this.darkMode);
  }
}