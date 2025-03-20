import { Routes } from '@angular/router';
import { dashGuard } from './core/guard/dash.guard';
import { loginGuard } from './core/guard/login.guard';
import { adminGuard } from './core/guard/admin.guard';



export const routes: Routes = [
  {path:'',loadComponent:()=>import('./pages/home/homepage/homepage.component').then(c=>c.HomepageComponent)},
  {path:'admin',canActivate:[dashGuard ,adminGuard],loadComponent:()=>import('./pages/admin/dashboard/dashboard.component').then(c=>c.DashboardComponent)},
  
   {path:'login',canActivate : [loginGuard],loadComponent:()=>import('./pages/login/login.component').then(c=>c.LoginComponent)},
   {path:'signup',loadComponent:()=>import('./pages/signup/signup.component').then(c=>c.SignupComponent)},


   {path:'forgot-password',loadComponent:()=>import('./pages/login/forget-password/forget-password.component').then(c=>c.ForgetPasswordComponent)},
   {path:'email-verfication',loadComponent:()=>import('./pages/login/verficationsend/verficationsend.component').then(c=>c.VerficationsendComponent)},
   {path:'reset-password',loadComponent:()=>import('./pages/login/reset-password/reset-password.component').then(c=>c.ResetPasswordComponent)},
   {path:'code-verfication',loadComponent:()=>import('./pages/login/code-verfication/code-verfication.component').then(c=>c.CodeVerficationComponent)},
   
    {path:'subscription-plan',loadComponent:()=>import('./pages/payment/subscriptionplan/subscriptionplan.component').then(c=>c.SubscriptionplanComponent)},
    {path:'payment-success',loadComponent:()=>import('./pages/payment/paymentsucces/paymentsucces.component').then(c=>c.PaymentsuccesComponent)},


   {path:'member',canActivate:[dashGuard],loadComponent:()=>import('./pages/member/dashboard/dashboard.component').then(c=>c.DashboardComponent) ,children: [

    { path: 'profile' , loadComponent : ()=>import('./pages/member/gestion-profile/gestion-profile.component').then( c=>c.GestionProfileComponent ),children: [
      {path: 'overview',loadComponent:()=>import('./pages/member/gestion-profile/overview/overview.component').then(c=>c.OverviewComponent)},
      {path: 'edit',loadComponent:()=>import('./pages/member/gestion-profile/edit-profile/edit-profile.component').then(c=>c.EditProfileComponent)},
      {path: 'change-password',loadComponent:()=>import('./pages/member/gestion-profile/change-password/change-password.component').then(c=>c.ChangePasswordComponent)},

      { path: '', redirectTo: 'overview', pathMatch: 'full' }



    ] },
    
  ]},


    
    
   
 

    


    {path:'**',loadComponent:()=>import('./pages/notfound/notfound.component').then(c=>c.NotfoundComponent)},
  

];
