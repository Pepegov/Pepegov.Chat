import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/authorization/user';
import { AccountService } from 'src/app/services/account.service';
import { AuthData } from 'src/app/models/authorization/auth-data';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hidePasswordFlag = true;
  loginFormControl = new FormControl('', [Validators.required, Validators.min(5)]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.min(5)]);
  user: User;
  
  constructor(public accountService: AccountService, 
    private router: Router, 
    private toastr: ToastrService,
    ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=> this.user = user);
  }

  ngOnInit(): void {
    if(this.user){//if user login then redict to home page
      this.router.navigateByUrl('/room');
    } 
  }

  login(){
    if(this.loginFormControl.valid && this.passwordFormControl.valid){
      const data = new AuthData();
      data.UserName = this.loginFormControl.value;
      data.Password = this.passwordFormControl.value;

      this.accountService.login(data)
    } 
  }
}
