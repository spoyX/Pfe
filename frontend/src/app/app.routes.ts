import { Routes } from '@angular/router';
import { dashGuard } from './core/guard/dash.guard';
import { loginGuard } from './core/guard/login.guard';
import { adminGuard } from './core/guard/admin.guard';
import { expiredGuard } from './core/guard/expired.guard';



export const routes: Routes = [
  {path:'',loadComponent:()=>import('./pages/home/homepage/homepage.component').then(c=>c.HomepageComponent)},
  {path:'admin',canActivate:[dashGuard ,adminGuard],loadComponent:()=>import('./pages/admin/dashboard/dashboard.component').then(c=>c.DashboardComponent),children:[
    {path:'',loadComponent:()=>import('./pages/admin/dashboard/main/main.component').then(c=>c.MainComponent)},
    {path:'Blog-Dashboard',loadComponent:()=>import('./pages/admin/dashboard/blog-dashboard/blog-dashboard.component').then(c=>c.BlogDashboardComponent)},
    {path:'user-reports',loadComponent:()=>import('./pages/admin/dashboard/users-reports/users-reports.component').then(c=>c.UsersReportsComponent)},
    {path:'event-reports',loadComponent:()=>import('./pages/admin/dashboard/event-dashboard/event-dashboard.component').then(c=>c.EventDashboardComponent)},
    

    {path:'payment-detail/:id',loadComponent:()=>import('./pages/admin/payment-detail/payment-detail.component').then(c=>c.PaymentDetailComponent)},
    {path:'chat',loadComponent:()=>import('./pages/member/chat/chat.component').then(c=>c.ChatComponent)},
    {path:'blog',loadComponent:()=>import('./pages/admin/blog/blog.component').then(c=>c.BlogComponent)},
    {path:'blog-list',loadComponent:()=>import('./pages/admin/blog/blog-list/blog-list.component').then(c=>c.BlogListComponent)},
    {path:'blog-detail/:id',loadComponent:()=>import('./pages/admin/blog/blog-detail/blog-detail.component').then(c=>c.BlogDetailComponent)},
    {path:'blog-create',loadComponent:()=>import('./pages/admin/blog/blog-create/blog-create.component').then(c=>c.BlogCreateComponent)},
    {path:'blog-update/:id',loadComponent:()=>import('./pages/admin/blog/blog-update/blog-update.component').then(c=>c.BlogUpdateComponent)},
    {path:'calendar',loadComponent:()=>import('./pages/admin/calendar/calendar.component').then(c=>c.CalendarComponent)},
    {path:'user-management',loadComponent:()=>import('./pages/admin/user-management/user-management.component').then(c=>c.UserManagementComponent)},
    {path:'profile-view/:id',loadComponent:()=>import('./pages/admin/user-management/profile-view/profile-view.component').then(c=>c.ProfileViewComponent)},
    {path:'event-creation',loadComponent:()=>import('./pages/admin/event/event-create/event-create.component').then(c=>c.EventCreateComponent)},
    {path:'event-update/:id',loadComponent:()=>import('./pages/admin/event/event-update/event-update.component').then(c=>c.EventUpdateComponent)},

    {path:'event-list',loadComponent:()=>import('./pages/admin/event/event.component').then(c=>c.EventComponent)},
    {path:'event-details/:id',loadComponent:()=>import('./pages/admin/event/event-details/event-details.component').then(c=>c.EventDetailsComponent)},
    

    


    
 
  ]},
  
   {path:'login',canActivate : [loginGuard],loadComponent:()=>import('./pages/login/login.component').then(c=>c.LoginComponent)},
   {path:'signup',loadComponent:()=>import('./pages/signup/signup.component').then(c=>c.SignupComponent)},
   



   {path:'forgot-password',loadComponent:()=>import('./pages/login/forget-password/forget-password.component').then(c=>c.ForgetPasswordComponent)},
   {path:'check-mail',loadComponent:()=>import('./pages/login/verficationsend/verficationsend.component').then(c=>c.VerficationsendComponent)},
   {path:'reset-password',loadComponent:()=>import('./pages/login/reset-password/reset-password.component').then(c=>c.ResetPasswordComponent)},
   {path:'code-verfication',loadComponent:()=>import('./pages/login/code-verfication/code-verfication.component').then(c=>c.CodeVerficationComponent)},
  
   

   {path:'expired',canActivate:[expiredGuard],loadComponent:()=>import('./shared/layout/expired-membership/expired-membership.component').then(c=>c.ExpiredMembershipComponent)},
   {path:'subscription',canActivate:[expiredGuard],loadComponent:()=>import('./shared/layout/expired-membership/subscription/subscription.component').then(c=>c.SubscriptionComponent)},

   {path:'success',canActivate:[expiredGuard],loadComponent:()=>import('./shared/layout/expired-membership/succes/succes.component').then(c=>c.SuccesComponent)},

    {path:'subscription-plan',loadComponent:()=>import('./pages/payment/subscriptionplan/subscriptionplan.component').then(c=>c.SubscriptionplanComponent)},
    {path:'payment-success',loadComponent:()=>import('./pages/payment/paymentsucces/paymentsucces.component').then(c=>c.PaymentsuccesComponent)},
    {path:'payment-fail',loadComponent:()=>import('./pages/payment/payment-fail/payment-fail.component').then(c=>c.PaymentFailComponent)},
    
  
   {path:'member',canActivate:[dashGuard],loadComponent:()=>import('./pages/member/dashboard/dashboard.component').then(c=>c.DashboardComponent) ,children: [
    
    {path:'',loadComponent:()=>import('./pages/member/dashboard/main/main.component').then(c=>c.MainComponent)},
    {path:'chat',loadComponent:()=>import('./pages/member/chat/chat.component').then(c=>c.ChatComponent)},
    {path:'transaction',loadComponent:()=>import('./pages/member/transaction/transaction.component').then(c=>c.TransactionComponent)},
    {path:'faq',loadComponent:()=>import('./shared/layout/faq/faq.component').then(c=>c.FaqComponent)},
    {path:'subscription-renew',loadComponent:()=>import('./pages/member/subscription-renew/subscription-renew.component').then(c=>c.SubscriptionRenewComponent)},
    {path:'subscription-succes',loadComponent:()=>import('./pages/member/subscription-succes/subscription-succes.component').then(c=>c.SubscriptionSuccesComponent)},
    {path:'my-membership',loadComponent:()=>import('./pages/member/dashboard/my-membership/my-membership.component').then(c=>c.MyMembershipComponent)},
    {path:'calendar',loadComponent:()=>import('./pages/member/calendar/calendar.component').then(c=>c.CalendarComponent)},
    {path:'transaction/recipt/:id',loadComponent:()=>import('./pages/member/transaction/recipt/recipt.component').then(c=>c.ReciptComponent)},
    {path:'event-list',loadComponent:()=>import('./pages/member/event/event.component').then(c=>c.EventComponent)},
    {path:'event-details/:id',loadComponent:()=>import('./pages/member/event/event-details/event-details.component').then(c=>c.EventDetailsComponent)},

    
    {path:'contact',loadComponent:()=>import('./shared/layout/contact/contact.component').then(c=>c.ContactComponent)},




    

    {path:'blog',loadComponent:()=>import('./pages/member/blog/blog.component').then(c=>c.BlogComponent)},
    {path:'blog-list',loadComponent:()=>import('./pages/member/blog/blog-list/blog-list.component').then(c=>c.BlogListComponent)},
    {path:'blog-detail/:id',loadComponent:()=>import('./pages/member/blog/blog-detail/blog-detail.component').then(c=>c.BlogDetailComponent)},
    { path: 'profile' , loadComponent : ()=>import('./pages/member/gestion-profile/gestion-profile.component').then( c=>c.GestionProfileComponent ),children: [
      {path: 'overview',loadComponent:()=>import('./pages/member/gestion-profile/overview/overview.component').then(c=>c.OverviewComponent)},
      {path: 'edit',loadComponent:()=>import('./pages/member/gestion-profile/edit-profile/edit-profile.component').then(c=>c.EditProfileComponent)},
      {path: 'change-password',loadComponent:()=>import('./pages/member/gestion-profile/change-password/change-password.component').then(c=>c.ChangePasswordComponent)},
      
      { path: '', redirectTo: 'overview', pathMatch: 'full' }



    ] },
    
  ]},


    
    
   
 

    


    {path:'**',loadComponent:()=>import('./pages/notfound/notfound.component').then(c=>c.NotfoundComponent)},
  

];
