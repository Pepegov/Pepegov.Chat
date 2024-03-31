import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeComponent } from '../components/room/home-room/home.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  constructor(){}

  canDeactivate(component: HomeComponent): Observable<boolean> | boolean {
    if(component.isMeeting){
      //TODO: fix dialog confirm('Confirmation', 'Are you sure exit this page?');
      return true;
    }
    return true;
  }

}
