import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import {AccountService} from "../../services/account.service";
import {OpenIdService} from "../../services/openid.service";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  constructor() { }
  ngOnInit() {
  }
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

}
