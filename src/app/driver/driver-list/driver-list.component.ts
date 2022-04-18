import { Overlay } from "@angular/cdk/overlay";
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { Driver } from "../driver.model";
import { DriverService } from "../driver.service";
import { ToastrService } from 'ngx-toastr';
import { SimpleModalService } from 'ngx-simple-modal';
import { ConfirmComponent } from '../../views/confirm/confirm.component';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-driver-list",
  templateUrl: "./driver-list.component.html",
  styleUrls: ["./driver-list.component.scss"],
})
export class DriverListComponent implements OnInit {
  data: any;
  drivers: Driver;


  _currentPage = 0;
  _totalItems = 0;
  _sortKey: string = 'createdAt';
  _sortDirection: string = 'desc';
  _serchText: string = '';
  _applicationType = '';

  @Output() public idFormChild = new EventEmitter();
  constructor(
    private http: HttpClient,
    private simpleModalService: SimpleModalService,
    private toastr: ToastrService,
    private driverService?: DriverService,
    public overlay?: Overlay
  ) { }

  adjustSort(key: string) {

    if (key == this._sortKey) {
      this._sortDirection = this._sortDirection == 'asc' ? 'desc' : 'asc';
    } else {
      this._sortDirection = 'asc';
      this._sortKey = key;
    }

    this.getData();

  }

  pageChanged(a) {
    this._currentPage = a;
    this.getData();
  }

  changeDriverStatus(id, status) {

    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Are sure you want to update Status?'
    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.driverService.updateUserStatus(id, status).subscribe(() => {
          this.toastr.success('Status has been updated.');
          this.getData();
        }, err => {
          this.toastr.error(err.error.message);
        });
      }
    });
  }

  public getData(): void {
    this.driverService.getDriverList(this._currentPage, this._sortKey, this._sortDirection, this._serchText, this._applicationType).subscribe((data) => {
      this.data = data.data.users;
      this._totalItems = data.data.total;
      console.log(data);
    }, err => {
      this.toastr.error(err.error.message);
    });

  }

  deleteDriver(id: string) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Are sure you want to delete this driver?'
    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.driverService.deleteDriverById(id).subscribe(() => {
          this.toastr.success('Driver has been deleted.');
          this.getData();
        }, err => {
          this.toastr.error(err.error.message);
        });
      }
    });
  }

  onChnageSearchBox(txt) {
    if (txt == '' || txt.length > 2) {
      this.getData();
    }
  }

  ngOnInit(): void {
    if (this.driverService.subsVar == undefined) {
      this.driverService.subsVar = this.driverService.
      invokeGetDriverData.subscribe((name: string) => {
        this.getData();
      });
    }
    this.getData();
  }

  /** assign overlay */
  public openForm(data: any, isview: boolean) {
    this.driverService.overlayConfig(data, isview);
  }

  testHttp() {
    
    this.http.get('https://reqres.in/api/users?delay=1').subscribe(res => {
    
    });
  }
}
