import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];
