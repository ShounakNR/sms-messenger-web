import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Messages } from './pages/messages/messages';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'messages', component: Messages },
];
