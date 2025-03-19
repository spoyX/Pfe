import { CanActivateFn, Router } from '@angular/router';
import{AuthentificationService} from '../auth/authentification.service'
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  
  const _user=inject(AuthentificationService)
  const router=inject(Router)
 
   if(_user.isLoggedIn()==false){
    return true
   }
   else{
    router.navigate(['/admin'])
    return false
   }
};
