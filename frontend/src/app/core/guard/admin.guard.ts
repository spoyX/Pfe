import { CanActivateFn ,Router } from '@angular/router';
import{AuthentificationService} from '../auth/authentification.service'
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const _auth=inject(AuthentificationService)
  const router=inject(Router)

  if(_auth.getDataFromToken().role =="admin"){
    return true
  }
  else{
    router.navigate(['/member'])
    return false
  }


};
