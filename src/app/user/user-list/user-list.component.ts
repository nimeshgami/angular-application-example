import { Overlay } from "@angular/cdk/overlay";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { UserService } from "../user.service";
import { ToastrService } from 'ngx-toastr';
import { SimpleModalService } from 'ngx-simple-modal';
import { ConfirmComponent } from '../../views/confirm/confirm.component';

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  data: any;
  users: User;
  elementClicked = 'Click any of the list item below';

  _currentPage = 0;
  _totalItems = 0;
  _sortKey: string = 'createdAt';
  _sortDirection: string = 'desc';
  _serchText: string = '';
  _accountType: string = '';

  @Output() public idFormChild = new EventEmitter();
  constructor(
    private simpleModalService: SimpleModalService,
    private toastr: ToastrService,
    private userService?: UserService,
    public overlay?: Overlay) { }

  public getUserData(): void {
    this.userService.getUserList((this._currentPage + 1), this._serchText, this._accountType, this._sortKey, this._sortDirection).subscribe((data) => {
      this.data = data.data.users;
      this._totalItems = data.data.total;
    }, err => {
      this.toastr.error(err.error.message);
    });
  }

  deleteUser(id: string) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Are sure you want to delete this user?'
    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.userService.deleteUserById(id).subscribe(() => {
          this.toastr.success('User has been deleted.');
          this.getUserData();
        }, err => {
          this.toastr.error(err.error.message);
        });
      }
    });
  }

  ngOnInit(): void {
    if (this.userService.subsVar == undefined) {
      this.userService.subsVar = this.userService.
        invokeGetUserData.subscribe((name: string) => {

          this.getUserData();
        });
    }

    this.getUserData();
  }

  /** assign overlay */
  public openForm(data: any, isview: boolean) {
    
    this.userService.overlayConfig(data, isview);
  }

  changeuserStatus(id, status) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Are sure you want to update Status?'
    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.userService.updateUserStatus(id, status).subscribe(() => {
          this.getUserData();
          this.toastr.success('Status has been updated.');
        }, err => {
          this.toastr.error(err.error.message);
        });
      }
    });
  }




  adjustSort(key: string) {

    if (key == this._sortKey) {
      this._sortDirection = this._sortDirection == 'asc' ? 'desc' : 'asc';
    } else {
      this._sortDirection = 'asc';
      this._sortKey = key;
    }

    this.getUserData();

  }

  pageChanged(a) {
    this._currentPage = a;
    this.getUserData();
  }

  onChnageSearchBox(txt) {

    if (txt == '' || txt.length > 2) {
      this.getUserData();
    }
  }

}
