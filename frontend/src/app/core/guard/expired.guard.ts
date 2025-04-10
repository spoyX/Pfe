import { CanActivateFn,Router } from '@angular/router';
import{AuthentificationService} from '../auth/authentification.service'
import { inject } from '@angular/core';

export const expiredGuard: CanActivateFn = (route, state) => {
  const _auth=inject(AuthentificationService)
  const router=inject(Router)

  
  
  if ( _auth.getDataFromToken().status === 'expired') {
    router.navigate(['/']);
    return false;
  }else{
    
    return true;
  }



};
