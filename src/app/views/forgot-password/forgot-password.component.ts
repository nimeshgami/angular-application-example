import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  public loginForm: FormGroup;
  public loginForm2: FormGroup;

  public ErrorMsg: String;
  iLogin: Ilogin = new Ilogin();
  isByPhone: boolean = true;

  constructor(private toastr: ToastrService,private LoginService: LoginService, private router: Router) {

    this.loginForm = new FormGroup({
      phone_number: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[+]\d{12}$/),
      ])
    });

    this.loginForm2 = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i),
      ])
    });

    this.ErrorMsg = "";
  }

  ngOnInit(): void {
  }

  onLogin() {

    this.router.navigateByUrl('login');
  }
  onClickEmail() {
    this.isByPhone = false;
  }
  onClickPhone() {
    this.isByPhone = true;
  }
  submitted = false;

  onSendOTP() {
    this.submitted = true;

    if (this.isByPhone) {
      if (this.loginForm.valid) {

        this.LoginService.ForgotPassword(this.iLogin.phone_number).subscribe(
          data => {
            this.toastr.success(data.message);
            this.router.navigateByUrl('verify-otp/phone/' + this.iLogin.phone_number);
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
    } else {
      if (this.loginForm2.valid) {

        this.LoginService.ForgotPasswordByEmail(this.iLogin.email).subscribe(
          data => {
            this.toastr.success(data.message);
            this.router.navigateByUrl('verify-otp/email/' + this.iLogin.email);
          },
          erro => {
            this.ErrorMsg = erro.error.message
          });

        this.submitted = false;

      } else {
        Object.keys(this.loginForm2.controls).forEach(key => {
          const controlErrors: ValidationErrors = this.loginForm2.get(key).errors;
          if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            });
          }
        });
      }
    }


  }
}
export class Ilogin {
  phone_number: string;
  email: string;
}