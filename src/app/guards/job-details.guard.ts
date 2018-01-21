import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { JobDetailsService } from 'app/job-details/job-details.service';
import { ContractStatus } from './../shared/utils';

@Injectable()
export class JobDetailsGuard implements CanActivate {

  constructor(private _jbDetailsService: JobDetailsService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if ((this._jbDetailsService.contract && this._jbDetailsService.contract.get('status') == ContractStatus.draft) || !this._jbDetailsService.contract) {
        return false;
      } else {
        return true;
      }
  }
}
