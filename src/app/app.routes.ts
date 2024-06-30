import { Routes } from '@angular/router';
import { HomepageComponent } from './modules/website/pages/homepage/homepage.component';
import { DashboardComponent } from './modules/account-management/pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'website', component: HomepageComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
];
