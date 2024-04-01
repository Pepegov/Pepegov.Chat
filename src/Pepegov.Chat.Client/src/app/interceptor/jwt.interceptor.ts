import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {OpenIdService} from "../services/openid.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private openIdService: OpenIdService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token : string = this.openIdService.getAccessToken();
    if(token){
      request = request.clone({
        setHeaders:{
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
