import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LobbyListComponent } from './components/lobby/lobby-list/lobby-list.component';
import { HomeComponent } from './components/room/home-room/home.component';
import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './guards/auth.guard'
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { NotfoundComponent } from './components/error-page/notfound/notfound.component';
import { ServerErrorComponent } from './components/error-page/server-error/server-error.component';

const routes: Routes = [
  {
    path:'',
    //runGuardsAndResolvers:'always',
    //canActivate: [AuthGuard],
    children:[
      {path: 'lobby', component: LobbyListComponent},
      {path: 'room/:id', component: HomeComponent, canDeactivate: [PreventUnsavedChangesGuard]},
    ]
  },  
  {path: 'login', component: LoginComponent},
  {path: 'not-found', component: NotfoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: NotfoundComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
