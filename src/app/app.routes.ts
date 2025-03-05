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
      {
        path: 'departments/:departmentId/goals/:goalId',
        loadComponent: () =>
          import('./goal-details/goal-details.component').then(
            (c) => c.GoalDetailsComponent
          ),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./admin/admin-panel/admin-panel.component').then(
            (c) => c.AdminPanelComponent
          ),
      },
      {
        path: 'admin/goals',
        loadComponent: () =>
          import('./admin/goal-templates/goal-templates.component').then(
            (c) => c.GoalTemplatesComponent
          ),
      },
      {
        path: 'admin/goals/create',
        loadComponent: () =>
          import('./admin/create-goal-form/create-goal-form.component').then(
            (c) => c.CreateGoalFormComponent
          ),
      },
      {
        path: 'admin/programs',
        loadComponent: () =>
          import('./admin/programs/programs.component').then(
            (c) => c.ProgramsComponent
          ),
      },
      {
        path: 'admin/interventions',
        loadComponent: () =>
          import('./admin/interventions/interventions.component').then(
            (c) => c.InterventionsComponent
          ),
      },
      {
        path: 'admin/intakes',
        loadComponent: () =>
          import('./admin/intakes/intakes.component').then(
            (c) => c.IntakesComponent
          ),
      },
      {
        path: 'admin/department-goals',
        loadComponent: () =>
          import('./admin/department-goals/departments-goals.component').then(
            (c) => c.DepartmentsGoalsComponent
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
