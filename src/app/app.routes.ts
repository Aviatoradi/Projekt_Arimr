import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { GoalEditorComponent } from './components/goal-editor/goal-editor.component';
import { TaskViewComponent } from './components/task-viewer/task-viewer.component';
import { CustomGoalComponent } from '/Users/adrianchlebio/Projekt/src/app/components/custom-goal/custom-goal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';


export const routes: Routes = [
  { path: '', redirectTo: 'goals', pathMatch: 'full' },
  { path: 'goals', component: GoalEditorComponent },
  { path: 'tasks', component: TaskViewComponent },
  { path: 'custom-goal', component: CustomGoalComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
