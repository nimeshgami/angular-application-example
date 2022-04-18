import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  iLogin: Ilogin = new Ilogin();

  public loginForm: FormGroup;
  public ErrorMsg: String;
  constructor(private LoginService: LoginService, private router: Router) {

    this.loginForm = new FormGroup({
      user_name: new FormControl("", [
        Validators.required
      ]),
      password: new FormControl("", [
        Validators.required
      ]),
    });
    this.ErrorMsg = "";
  }


  ngOnInit() {
    if (sessionStorage.getItem("isLogin") !== null) {
      this.router.navigateByUrl('/default/dashboard');
    }
  }

  //***ADMIN LOGIN LOGIC***
  submitted = false;

  onForgotPass()
  {
    this.router.navigateByUrl('forgot-password');

  }
  onLogin() {

    this.submitted = true;
    if (this.loginForm.valid) {

      this.LoginService.Login(this.iLogin.UserName, this.iLogin.Password).subscribe(
        data => {
          console.log("Login => ")
          console.log(data)
          this.router.navigateByUrl('/default/dashboard');
          sessionStorage.setItem("isLogin", "true");
          sessionStorage.setItem("auth_token", data.data.auth_token);

        },
        erro => {
          this.ErrorMsg = erro.error.message
        });


      this.submitted = false;
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.loginForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }







    // console.log(this.iLogin.UserName)
    // if(this.iLogin.UserName == 'admin' && this.iLogin.Password == 'admin')
    // {
    //   this.router.navigateByUrl('/default/dashboard');
    //   sessionStorage.setItem("isLogin", "true");
    // }
    // else
    // {
    //   this.router.navigateByUrl('login');
    // }
  }
}

export class Ilogin {
  UserName: string;
  Password: string;
}
