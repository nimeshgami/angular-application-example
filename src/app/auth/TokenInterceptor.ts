import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const currentUser = this.authService.getToken();
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `${currentUser}`,
          'user_type': '1'
        }
      });
    }

    return next.handle(request).pipe(tap(() => { },
      (err: any) => {

        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }
          this.authService.Logout();
          this.router.navigate(['login']);
        }
      }));
  }
}