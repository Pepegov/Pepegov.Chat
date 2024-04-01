import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import {OpenIdService, UserInfo} from "../services/openid.service";

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  user: UserInfo;
  //<li class="nav-item" *appHasRole='["admin", "superadmin"]'>
  constructor(private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: OpenIdService) { }

  ngOnInit(): void {
    this.accountService.userProfileSubject.subscribe(user => {
      this.user = user;
    })
  }
}
