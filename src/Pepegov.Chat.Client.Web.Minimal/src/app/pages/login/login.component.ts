import './login.component.css'
import {SimpleOpenIdService} from "../../services/openid.service";
import {OnLoadComponent} from "../../component.app";
import {Component} from "../../component.decoration";
import {getCurrentQueryParams} from "../../router";

@Component({
    selector: 'app',
    templateUrl: './login.component.html',
})
export class LoginPageComponent implements OnLoadComponent{
    openIdService: SimpleOpenIdService

    constructor() {
        this.openIdService = new SimpleOpenIdService()
    }

    async OnLoad(): Promise<void> {
        const form = document.querySelector('#login_form') as HTMLFormElement;
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            let username_input = document.querySelector('#username_input') as HTMLInputElement;
            let password_input = document.querySelector('#password_input') as HTMLInputElement;

            this.openIdService.ResourceOwnerPasswordAuth(username_input.value, password_input.value, ["openid", "offline_access"]).then(() => {
                this.redirectTobBackUrl()
            })
        });
    }

    private redirectTobBackUrl() : void {
        const url = getCurrentQueryParams().get('redirect_uri');
        if(url){
            window.location.href = url;
        }
        else {
            window.location.href = "/"
        }
    }
}