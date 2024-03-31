import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/authorization/user';
import { tap } from 'rxjs/operators';
import { PresenceService } from './presence.service';
import { AuthData } from '../models/authorization/auth-data'
import { Token } from '../models/authorization/token'

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();
  router: any;
  //errorHandler: any;

  constructor(private http: HttpClient, private presence: PresenceService) {  }

  login(authData: AuthData){
    const formData = new URLSearchParams()

    //TODO fix that
    formData.set('client_id', '')
    formData.set('client_secret', '')
    formData.set('grant_type', 'password')
    formData.set('scope', 'offline_access openid profile')
    formData.set('username', authData.UserName)
    formData.set('password', authData.Password)
    //qron-gateway.joytech.store/gateway/identity
    return this.http.post("/token", formData, {
        headers: new HttpHeaders({
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
      }
    ).pipe(
      tap((token: Token) => localStorage.setItem('accessToken', token.access_token)),
      tap((token: Token) => this.SetCurrentUser(token))
    ).subscribe()
  }

  private SetCurrentUser(token: Token){
    const claims : any = this.ParseJwt(token.access_token)
    //name => given_name
    //email => email
    //last name => family_name
    //login => name
    //sub => id
    //phone_number => phone

    let user = new User();
    user.email = claims.email;
    user.id = claims.sub;
    user.name = claims.given_name;
    user.lastName = claims.family_name;
    user.phone = claims.phone_number;
    user.login = claims.name;

     if(user){
       localStorage.setItem('user', JSON.stringify(user));
       this.currentUserSource.next(user)
     }
  }

  Logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  GetAccessToken(){
    return localStorage.getItem('accessToken')
  }

  GetCurretUser(){
    return localStorage.getItem('user')
  }

  private ParseJwt (token : string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }
}
