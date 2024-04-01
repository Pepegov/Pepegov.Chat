import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {OpenIdService} from "../services/openid.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: OpenIdService, private toastr: ToastrService){}

  canActivate(): Observable<boolean> {
    return this.accountService.userProfileSubject.pipe(
      map(user => {
        if(user){
          return true;
        }
        this.toastr.warning('Please login!');
        return false;
      })
    )
  }

}
