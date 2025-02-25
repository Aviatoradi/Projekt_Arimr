import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { GoalEditorComponent } from './components/goal-editor/goal-editor.component';
import { TaskViewComponent } from './components/task-viewer/task-viewer.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { CustomGoalComponent } from './components/custom-goal/custom-goal.component';

export const routes: Routes = [
  {
    path: 'app',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'departments/:id',
        loadComponent: () =>
          import('./department-page/department-page.component').then(
            (c) => c.DepartmentPageComponent
          ),
      },
      { path: 'goals', component: GoalEditorComponent },
      { path: 'tasks', component: TaskViewComponent },
      { path: 'custom-goal', component: CustomGoalComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'profile', component: ProfileComponent },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  // {
  //   path: 'admin',
  //   component:
  //   children: [
  //
  //   ]
  //   loadComponent: () => import('components/')
  // }
  { path: '', redirectTo: 'app', pathMatch: 'full' }, // ✅ Domyślnie przekierowuje na logowanie
];
