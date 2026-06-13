import { Routes } from '@angular/router';

import { AppLayoutComponent } from './layout/app-layout/app-layout';
import { ClientDetailComponent } from './pages/client-detail/client-detail';
import { ClientsComponent } from './pages/clients/clients';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { ProjectsComponent } from './pages/projects/projects';
import { SettingsComponent } from './pages/settings/settings';
import { SignupComponent } from './pages/signup/signup';
import { TasksComponent } from './pages/tasks/tasks';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'clients',
        component: ClientsComponent
      },
      {
        path: 'clients/:id',
        component: ClientDetailComponent
      },
      {
        path: 'projects',
        component: ProjectsComponent
      },
      {
        path: 'tasks',
        component: TasksComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
