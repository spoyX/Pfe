import { Routes } from '@angular/router';


export const routes: Routes = [
  {path:'',loadComponent:()=>import('./pages/home/homepage/homepage.component').then(c=>c.HomepageComponent)},
  {path:'admin',loadComponent:()=>import('./pages/admin/dashboard/dashboard.component').then(c=>c.DashboardComponent)},
  {path:'member',loadComponent:()=>import('./pages/member/dashboard/dashboard.component').then(c=>c.DashboardComponent)},
   {path:'login',loadComponent:()=>import('./pages/login/login.component').then(c=>c.LoginComponent)}




];
