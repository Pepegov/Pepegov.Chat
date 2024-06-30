import { Component } from '@angular/core';
import {OpenIdService} from "./services/openid.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pepegov.Chat.Client';

  constructor(private readonly identity: OpenIdService) {}
}
