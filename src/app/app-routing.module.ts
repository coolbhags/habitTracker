import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'habits',
    pathMatch: 'full'
  },
  {
    path: 'habits',
    loadChildren: () => import('./pages/habits/habits.module').then(m => m.HabitsPageModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('./pages/stats/stats.module').then(m => m.StatsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }