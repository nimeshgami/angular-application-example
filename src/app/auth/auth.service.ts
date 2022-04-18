import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  public url: string = "http://192.1.1.1:3118/api/v1/users";

  getToken() {
    return sessionStorage.getItem("auth_token");
  }


  Logout() {
    sessionStorage.clear();
  }

  ActiveUserLogout() {

    let authToken = sessionStorage.getItem('auth_token');

    let httpOptions =
    {
      headers: new HttpHeaders(
        {
          "Authorization": authToken,
          'user_type': '1'
        }
      )
    }

    return this.http.post(this.url + "/logout", {}, httpOptions);
  }

}
