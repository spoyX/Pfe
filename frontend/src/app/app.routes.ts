import { Routes } from '@angular/router';


export const routes: Routes = [
  {path:'',loadComponent:()=>import('./pages/home/homepage/homepage.component').then(c=>c.HomepageComponent)},
  {path:'admin',loadComponent:()=>import('./pages/admin/dashboard/dashboard.component').then(c=>c.DashboardComponent)},
  
   {path:'login',loadComponent:()=>import('./pages/login/login.component').then(c=>c.LoginComponent)},
   {path:'signup',loadComponent:()=>import('./pages/signup/signup.component').then(c=>c.SignupComponent)},


   {path:'forgot-password',loadComponent:()=>import('./pages/login/forget-password/forget-password.component').then(c=>c.ForgetPasswordComponent)},
   {path:'email-verfication',loadComponent:()=>import('./pages/login/verficationsend/verficationsend.component').then(c=>c.VerficationsendComponent)},
   {path:'reset-password',loadComponent:()=>import('./pages/login/reset-password/reset-password.component').then(c=>c.ResetPasswordComponent)},
   {path:'code-verfication',loadComponent:()=>import('./pages/login/code-verfication/code-verfication.component').then(c=>c.CodeVerficationComponent)},
   


   {path:'member',loadComponent:()=>import('./pages/member/dashboard/dashboard.component').then(c=>c.DashboardComponent) ,children: [

    { path: 'profile' , loadComponent : ()=>import('./pages/member/gestion-profile/gestion-profile.component').then( c=>c.GestionProfileComponent ) },]},
    

   
 

    


    {path:'**',loadComponent:()=>import('./pages/notfound/notfound.component').then(c=>c.NotfoundComponent)},
  

];
