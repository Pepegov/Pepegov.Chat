import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MatCommonModule} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSidenavModule} from '@angular/material/sidenav';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { CommonModule, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HasRoleDirective } from './directives/has-role.directive';

import { ErrorInterceptor } from './interceptor/error.interceptor';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { LoadingInterceptor } from './interceptor/loading.interceptor';

import { HomeComponent } from './components/room/home-room/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotfoundComponent } from './components/error-page/notfound/notfound.component';
import { ServerErrorComponent } from './components/error-page/server-error/server-error.component';
import { VideoBoxUserComponent } from './components/video-box-user/video-box-user.component';
import { AddRoomModalComponent } from './components/lobby/create-room-modal/create-room-modal.component';
import { EditRoomModalComponent } from './components/lobby/edit-room-modal/edit-room-modal.component';
import { LobbyListComponent } from './components/lobby/lobby-list/lobby-list.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TimeagoModule } from 'ngx-timeago';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SocialLoginModule } from '@abacritt/angularx-social-login';

import { ConfigService } from './services/ConfigService';

import { map } from 'rxjs';
import { ChatComponent } from './components/room/chat/chat.component';
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';
import {MatListModule} from "@angular/material/list";
import {OAuthModule, provideOAuthClient} from "angular-oauth2-oidc";
function initialize(http: HttpClient, config: ConfigService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      http.get('../assets/config.json')
        .pipe(
          map((x: ConfigService) => {
            config.STUN_SERVER = x.STUN_SERVER;
            config.urlTurnServer = x.urlTurnServer;
            config.username = x.username;
            config.password = x.password;
            config.isRecorded = x.isRecorded;
            config.clockRegister = x.clockRegister;
            config.pageSize = x.pageSize;
            resolve(true);
          })
        ).subscribe();
    });
  };
}

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NotfoundComponent,
    ServerErrorComponent,
    LobbyListComponent,
    VideoBoxUserComponent,
    HasRoleDirective,
    AddRoomModalComponent,
    EditRoomModalComponent,
    ChatComponent,
    SidenavListComponent,
  ],
  imports: [
    MatListModule,
    MatCommonModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatSidenavModule,
    MatDialogModule,

    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SocialLoginModule,
    OAuthModule.forRoot(),
    TimeagoModule.forRoot(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    PaginationModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-left'
    }),
  ],
  exports: [
    MatListModule,
  ],

  providers: [
    provideHttpClient(),
    provideOAuthClient(),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
