import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ComponentRef, EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriverFormComponent } from './driver-form/driver-form.component';
import { Driver } from './driver.model';

import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  /** component reference */
  public componentRef: ComponentRef<DriverFormComponent>;
  /** overlay reference */
  public overlayRef: OverlayRef;

  public url: string = "http://192.1.1.1:3118/api/v1/admin";
  public authToken = sessionStorage.getItem("auth_token");
  public httpOptions = {
    headers: new HttpHeaders({
      Authorization: this.authToken,
      'user_type': '1'
    }),
  };

  constructor(private http: HttpClient,
    public overlay?: Overlay) { }

  createDriver(driver): Observable<any> {
    return this.http.post(this.url, driver);
  }

  public getDriver(): Observable<any> {
    return this.http.get(this.url);
  }

  public getDriverById(id): Observable<any> {
    return this.http.get(
      this.url + "/get-driver-details/" + id,
      this.httpOptions
    );
  }

  putDriver(id: number, data: Driver) {
    return this.http.post(this.url + "/update-driver/" + id, data, this.httpOptions);
  }

  deleteDriver(id: string): Observable<any> {
    return this.http.delete(this.url + '/' + id);
  }

  getDriverList(pageNumber, sortKey, sortDirection, searchquery, applicationType) {
    return this.http.get<any>(`${this.url}/get-driver-list?page=${pageNumber}&limit=10&search_query=${searchquery}&applicationType=${applicationType}&sortKey=${sortKey}&sortDirection=${sortDirection}`, this.httpOptions);
  }
  deleteDriverById(id) {
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

    return this.http.delete<any>(`${this.url}/delete-user/${id}`, httpOptions);
  }

  updateUserStatus(id, status) {
    var data = {
      "user_id": id,
      "is_active": status
    };
    return this.http.put(this.url + "/active-deactive-user", data, this.httpOptions);


  }
  updateUserApprovStatus(id, status) {
    var data = {
      "user_id": id,
      "status": status
    };
    return this.http.put(this.url + "/driver/approve-reject", data, this.httpOptions);


  }
  /** overlay configuration */
  public overlayConfig(driverId: any, isview): ComponentRef<DriverFormComponent> {
    console.log("metg=od 2", driverId)
    const overlayConfig: OverlayConfig = new OverlayConfig();

    /* GlobalPostionStrategy */
    overlayConfig.positionStrategy = this.overlay.position().global()
      .centerHorizontally()
      .centerVertically();


    overlayConfig.hasBackdrop = true;

    this.overlayRef = this.overlay.create(overlayConfig);
    const portal: ComponentPortal<DriverFormComponent> = new ComponentPortal<DriverFormComponent>(DriverFormComponent);
    this.componentRef = this.overlayRef.attach(portal);
    this.componentRef.instance.driverId = driverId._id;
    this.componentRef.instance.isViewOnly = isview;

    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.detach());

    return this.componentRef;
  }

  /** close overlay */
  public closeOverlay() {
    this.overlayRef.detach();

    this.componentRef.destroy();
  }

  invokeGetDriverData = new EventEmitter();
  subsVar: Subscription;
  onCompleted() {
    this.invokeGetDriverData.emit();
  }


}
