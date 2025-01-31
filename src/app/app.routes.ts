import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { GoalEditorComponent } from './components/goal-editor/goal-editor.component';
import { TaskViewComponent } from './components/task-viewer/task-viewer.component';
import { CustomGoalComponent } from '/Users/adrianchlebio/Projekt/src/app/components/custom-goal/custom-goal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '/Users/adrianchlebio/Projekt/src/app/services/auth.guard';
import { AuthService } from './services/auth.service';


export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' }, // ✅ Domyślnie przekierowuje na logowanie
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // ✅ Po zalogowaniu dostępne
  { path: 'goals', component: GoalEditorComponent },
  { path: 'tasks', component: TaskViewComponent, canActivate: [AuthGuard] },
  { path: 'custom-goal', component: CustomGoalComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
