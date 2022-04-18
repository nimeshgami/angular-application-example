import { Component } from '@angular/core';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  public _dyear = (new Date()).getFullYear();

  constructor(private router: Router, private http: HttpClient, private authService: AuthService,private toastr: ToastrService) {

  }
  ngOnInit() {
    if (sessionStorage.getItem("isLogin") === null) {
      this.router.navigateByUrl('/login');
    }
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  Logout() {
    this.authService.ActiveUserLogout().subscribe(
      data => {
        sessionStorage.clear();
        this.router.navigateByUrl('login');
      },
      err => {
        this.toastr.error(err.error.message);
      });
  }

  startedClass = false;
  completedClass = false;
  preventAbuse = false;

  onStarted() {

  }

  onCompleted() {

  }

  options = {
    minimum: 0.08,
    maximum: 1,
    ease: 'linear',
    speed: 200,
    trickleSpeed: 300,
    meteor: true,
    spinner: true,
    spinnerPosition: 'right',
    direction: 'leftToRightIncreased',
    color: 'red',
    thick: true
  };


  testHttp() {
    this.preventAbuse = true;
    this.http.get('https://reqres.in/api/users?delay=1').subscribe(res => {

    });
  }
}
