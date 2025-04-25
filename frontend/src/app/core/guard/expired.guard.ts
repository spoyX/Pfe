import { CanActivateFn,Router } from '@angular/router';
import{AuthentificationService} from '../auth/authentification.service'
import { inject } from '@angular/core';

export const expiredGuard: CanActivateFn = (route, state) => {
  
  const router=inject(Router)

  
  
  
  const membershipStatus = localStorage.getItem('membershipStatus');

  if (membershipStatus === 'expired') {
    return true;
  } else {
    router.navigate(['/member']);
    return false;
  }
};
