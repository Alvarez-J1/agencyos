import { Routes } from '@angular/router';

import { AppLayoutComponent } from './layout/app-layout/app-layout';
import { ClientDetailComponent } from './pages/client-detail/client-detail';
import { ClientsComponent } from './pages/clients/clients';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { ProjectDetailComponent } from './pages/project-detail/project-detail';
import { ProjectsComponent } from './pages/projects/projects';
import { SettingsComponent } from './pages/settings/settings';
import { SignupComponent } from './pages/signup/signup';
import { TasksComponent } from './pages/tasks/tasks';
import { authGuard } from './services/auth.guard';

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
    canActivate: [authGuard],
    canActivateChild: [authGuard],
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
        path: 'projects/:id',
        component: ProjectDetailComponent
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
