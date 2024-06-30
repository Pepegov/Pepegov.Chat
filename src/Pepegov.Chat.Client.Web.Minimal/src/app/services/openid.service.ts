import router from "../router";
import HttpClient from "../httpclient";
import {UserInfo} from "../models/auth/user-info";

const config =  {
  client: {
    id: 'MicroservicePassword-ID',
    secret: 'MicroservicePassword-SECRET'
  },
  auth: {
    tokenHost: process.env.identityUrl
  }
};

enum Flows {
  ClientCredentials = "ClientCredentials",
  ResourceOwnerPassword = "ResourceOwnerPassword",
  AuthorizationCode = "AuthorizationCode"
}

export class SimpleOpenIdService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(() => this.GetAccessTokenOnStorage())
  }

  async ResourceOwnerPasswordAuth(username: string, password: string, scopes: string[]) {
    var openIdClient = new OpenIdClient(config)

    const tokenSet = await openIdClient.ResourceOwnerPasswordAuth(username, password, scopes)
    if(tokenSet){
      console.log('Access Token:', tokenSet.access_token);
      console.log('ID Token:', tokenSet.id_token);
      console.log('Refresh Token:', tokenSet.refresh_token);

      localStorage.setItem('access_token', tokenSet.access_token!)
      localStorage.setItem('token_type', Flows.ResourceOwnerPassword)
    }
  }

  parseJwt(token: string): any {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('Invalid JWT token');
    }

    const payload = parts[1];
    const decodedPayload = this.decodeBase64Url(payload);
    return JSON.parse(decodedPayload);
  }

  decodeBase64Url(base64Url: string): string {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    return atob(paddedBase64);
  }

  isTokenAlive(token: string): boolean {
    try {
      // Распарсить токен и получить полезную нагрузку
      const payload = this.parseJwt(token);

      // Проверить наличие поля exp
      if (!payload.exp) {
        throw new Error('Token does not contain an exp claim');
      }

      // Получить текущее время в секундах с 01.01.1970
      const currentTime = Math.floor(Date.now() / 1000);

      // Сравнить текущее время с exp
      return currentTime < payload.exp;
    } catch (error) {
      console.error('Failed to parse token or token is invalid', error);
      return false;
    }
  }

  GetAccessTokenOnStorage() : string | null {
    let access_token = localStorage.getItem('access_token');
    if(access_token && this.isTokenAlive(access_token)){
      return access_token;
    }

    window.location.href = "/login"
    return null;
  }

  async GetUserInfoAsync() : Promise<UserInfo> {
    return this.httpClient.GetAsync<UserInfo>(config.auth.tokenHost + "/connect/userinfo")
  }
}

interface OpenIdConfig {
  client: OpenIdClientSettings | null
  auth: OpenIdAuthSettings | null
}

interface OpenIdClientSettings {
  id: string | null
  secret: string | null
}

interface OpenIdAuthSettings {
  tokenHost: string | undefined
}

interface TokenSet {
  access_token: string | null;
  id_token: string | null;
  token_type: string | null;
  expires_in: number | null
  refresh_token: string | null;
}

interface OpenIdError {
  error: string | null;
  error_description: string | null;
  error_uri: string | null;
}

export class OpenIdClient{
  private config : OpenIdConfig

  constructor(openIdConfig: OpenIdConfig) {
    this.config = openIdConfig
  }

  async ResourceOwnerPasswordAuth(username: string, password: string, scopes: string[]){
    let data =new URLSearchParams({
      "username": username,
      "password": password,
      "grant_type": "password",
      "scope": scopes.join(" "),
      "client_secret": this.config.client!.secret!,
      "client_id": this.config.client!.id!
    })

    try {
      const tokenSetResponse = await fetch(config.auth.tokenHost + "connect/token", {
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        method: "post",
      })

      let tokenSetJson = await tokenSetResponse.json()

      if(tokenSetJson.hasOwnProperty("access_token")){
        return await tokenSetJson as TokenSet
      }

      const error = tokenSetJson as OpenIdError
      console.log(error)
    } catch (error) {
      console.log('Access Token Error', error);
    }
  }
}


