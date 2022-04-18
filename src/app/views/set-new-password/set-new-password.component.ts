import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmedValidator } from '../../common/confirmed.validator';
@Component({
  selector: 'app-dashboard',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss']
})
export class SetNewPasswordComponent implements OnInit {

  public loginForm: FormGroup;
  public ErrorMsg: String;
  iLogin: Ilogin = new Ilogin();
  public id: string;

  constructor(private toastr: ToastrService, private LoginService: LoginService, private router: Router, private _Activatedroute: ActivatedRoute) {
    this.loginForm = new FormGroup({
      newPassword: new FormControl("", [
        Validators.required
      ]),
      rePassword: new FormControl("", [
        Validators.required
      ])
    });
    this.ErrorMsg = "";
  }

  ngOnInit(): void {
    this.id = this._Activatedroute.snapshot.paramMap.get("reset_password_token");
  }

  onLogin() {

    this.router.navigateByUrl('login');
  }

  submitted = false;
  onUpdateNewPassword() {
    this.submitted = true;
    if (this.loginForm.valid) {

      if (btoa(this.iLogin.newPassword) != btoa(this.iLogin.rePassword)) {
        this.ErrorMsg = "password does not match"
        return;
      }

      this.LoginService.SetNewPassword(this.id, this.iLogin.newPassword).subscribe(
        data => {
          this.toastr.success(data.message);
          this.router.navigateByUrl('login');
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
  newPassword: string;
  rePassword: string;
}