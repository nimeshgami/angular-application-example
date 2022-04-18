import { ComponentRef, EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from "./user.model";
import { Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { UserAddComponent } from "./user-add/user-add.component";

@Injectable({
  providedIn: "root",
})
export class UserService {
  /** component reference */
  public componentRef: ComponentRef<UserAddComponent>;
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




  constructor(private http: HttpClient, public overlay?: Overlay) { }

  createUser(user): Observable<any> {
    return this.http.post(this.url, user);
  }

  public getUser(): Observable<any> {
    return this.http.get(this.url);
  }

  public getUserById(id): Observable<any> {
    return this.http.get(
      this.url + "/get-user-details/" + id,
      this.httpOptions
    );
  }

  putUser(id: number, data: User) {
    return this.http.post(this.url + "/update-user/" + id, data, this.httpOptions);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(this.url + "/" + id);
  }

  getUserList(pageNumber, searchquery, accountType, sortKey, sortDirection) {
    return this.http.get<any>(
      `${this.url}/get-user-list?page=${pageNumber}&limit=10&search_query=${searchquery}&sortKey=${sortKey}&sortDirection=${sortDirection}${accountType != '' ? '&sub_user_type=' + accountType : ''}`,
      this.httpOptions
    );
  }
  deleteUserById(id) {
    return this.http.delete(`${this.url}/delete-user/${id}`, this.httpOptions);
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
    return this.http.put(this.url + "/user/approve-reject", data, this.httpOptions);


  }

  /** overlay configuration */
  public overlayConfig(data: any, isview): ComponentRef<UserAddComponent> {
    
    console.log("metg=od 2", data);
    const overlayConfig: OverlayConfig = new OverlayConfig();

    /* GlobalPostionStrategy */
    overlayConfig.positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    overlayConfig.hasBackdrop = true;

    this.overlayRef = this.overlay.create(overlayConfig);
    const portal: ComponentPortal<UserAddComponent> =
      new ComponentPortal<UserAddComponent>(UserAddComponent);
    this.componentRef = this.overlayRef.attach(portal);
    this.componentRef.instance.userId = data._id;
    this.componentRef.instance.isViewOnly = isview;


    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.detach());

    return this.componentRef;
  }

  /** close overlay */
  public closeOverlay() {
    this.overlayRef.detach();

    this.componentRef.destroy();

  }

  invokeGetUserData = new EventEmitter();
  subsVar: Subscription;
  onCompleted() {
    this.invokeGetUserData.emit();
  }

}
