import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_URL = 'https://reqres.in';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public url: string = "http://192.1.1.1:3118/api/v1/users";
  public httpOptions =
    {
      headers: new HttpHeaders(
        {
          "content-type": 'application/json',
          'user_type': '1'
        }
      )
    };

  constructor(private http: HttpClient) { }

  public Login(username, password) {
    let _POST =
    {
      "email": username,
      "password": password
    }
    return this.http.post<any>(this.url + "/login", _POST, this.httpOptions);
  }

  public ForgotPassword(phoneNumber) {

    let _POST =
    {
      "phone_number": phoneNumber
    }
    return this.http.post<any>(this.url + "/forgot-password", _POST, this.httpOptions);
  }
  public ForgotPasswordByEmail(phoneNumber) {

    let _POST =
    {
      "email": phoneNumber
    }
    return this.http.post<any>(this.url + "/forgot-password", _POST, this.httpOptions);
  }

  public SendOTP(phoneNumber) {

    let _POST =
    {
      "phone_number": phoneNumber
    }
    return this.http.post<any>(this.url + "/send-otp", _POST, this.httpOptions);
  }

  public VerifyOTP(id, otp, type, verifyType) {

    if (type == 'phone') {

      let _POST =
      {
        "phone_number": id,
        "otp": otp,
        "verify_type": verifyType
      }
      return this.http.post<any>(this.url + "/verify-otp", _POST, this.httpOptions);
    }
    else {
      let _POST =
      {
        "email": id,
        "otp": otp,
        "verify_type": verifyType
      }
      return this.http.post<any>(this.url + "/verify-otp", _POST, this.httpOptions);

    }
  }

  public SetNewPassword(reset_password_token, new_password) {

    let _POST =
    {
      "reset_password_token": reset_password_token,
      "new_password": new_password
    }
    return this.http.post<any>(this.url + "/set-new-password", _POST, this.httpOptions);
  }

}
