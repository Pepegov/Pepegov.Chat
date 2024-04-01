import {Injectable} from "@angular/core";
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";

const oAuthConfig: AuthConfig = {
  issuer: environment.identityUrl,
  strictDiscoveryDocumentValidation: false,
  responseType: "code",
  redirectUri: window.location.origin,
  clientId: 'Microservice.Identity-ID',
  dummyClientSecret: 'Microservice.Identity-SECRET',
  scope: 'openid offline_access profile email phone roles api'
}

export interface UserInfo {
  birthdate: string,
  email: string,
  email_verified: boolean,
  phone_number: string,
  phone_number_verified: boolean,
  name: string,
  given_name: string,
  family_name: string,
  updated_at: string,
  gender: string | null,
  nickname: string | null,
  middle_name: string | null
  role: string[] | null
}

@Injectable({
  providedIn: 'root'
})
export class OpenIdService {

  userProfileSubject = new Subject<UserInfo>()

  constructor(private readonly oAuthService: OAuthService) {
    oAuthService.configure(oAuthConfig)
    oAuthService.logoutUrl = environment.identityUrl + "connect/logout"
    oAuthService.loadDiscoveryDocument().then(() => {
      oAuthService.tryLoginCodeFlow().then(() => {
        if (!oAuthService.hasValidAccessToken()) {
          oAuthService.initLoginFlow()
        } else {
          oAuthService.loadUserProfile().then((userProfile) => {
            this.userProfileSubject.next(userProfile as UserInfo)
          })
        }
      })
    })
  }

  isLoggedId() : boolean {
    return this.oAuthService.hasValidAccessToken()
  }

  logout() {
    this.oAuthService.logOut()
  }

  getAccessToken() : string {
    return this.oAuthService.getAccessToken();
  }

  authHeader() : HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
    })
  }
}
