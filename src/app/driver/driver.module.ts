import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverFormComponent } from './driver-form/driver-form.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DriverRoutingModule } from './driver.routing';
import { DriverService } from './driver.service';
import { DriverComponent } from './driver.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { TokenInterceptor } from '../auth/TokenInterceptor';



@NgModule({
  declarations: [
    DriverComponent,
    DriverFormComponent,
    DriverListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DriverRoutingModule,
    OverlayModule,
    NgxPaginationModule,
    NgProgressModule,
    NgProgressHttpModule
  ],
  providers: [
    DriverService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class DriverModule { }
