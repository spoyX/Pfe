import { CanActivateFn, Router } from '@angular/router';
import{AuthentificationService} from '../auth/authentification.service'
import { inject } from '@angular/core';
export const dashGuard: CanActivateFn = (route, state) => {
   const _user=inject(AuthentificationService)
     const router=inject(Router)
   if(_user.isLoggedIn()==true){
    return true
   }
   else{
    router.navigate(['/login'])

    return false
   }
};
