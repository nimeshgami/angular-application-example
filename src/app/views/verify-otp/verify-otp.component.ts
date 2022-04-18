import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOTPComponent implements OnInit {

  public loginForm: FormGroup;
  public ErrorMsg: String;
  iLogin: Ilogin = new Ilogin();
  public type: string;
  public userId: string;

  constructor(private toastr: ToastrService, private LoginService: LoginService, private router: Router, private _Activatedroute: ActivatedRoute) {


    this.loginForm = new FormGroup({
      otp: new FormControl("", [
        Validators.required
      ])
    });
    this.ErrorMsg = "";

  }

  ngOnInit(): void {

    this.userId = this._Activatedroute.snapshot.paramMap.get("id");
    this.type = this._Activatedroute.snapshot.paramMap.get("type");
  }

  onLogin() {
    this.router.navigateByUrl('login');
  }

  submitted = false;
  onVerifyOTP() {
    this.submitted = true;
    if (this.loginForm.valid) {

      this.LoginService.VerifyOTP(this.userId, this.iLogin.otp, this.type, 2).subscribe(
        data => {
          this.toastr.success(data.message);
          this.router.navigateByUrl('set-new-password/' + data.data.reset_password_token);
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



  }
}
export class Ilogin {
  otp: string;
}