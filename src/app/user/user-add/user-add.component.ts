import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { UserListComponent } from "../user-list/user-list.component";
import { UserService } from "../user.service";
import { ToastrService } from 'ngx-toastr';
import { SimpleModalService } from 'ngx-simple-modal';
import { ConfirmComponent } from "../../views/confirm/confirm.component";
@Component({
  selector: "app-user-add",
  templateUrl: "./user-add.component.html",
  styleUrls: ["./user-add.component.scss"],
})
export class UserAddComponent implements OnInit {
  public userId: number;
  isViewOnly: boolean = false;
  public userdate;
  isEditable: boolean = false;
  public userForm: FormGroup;
  public imagePath: String;

  @ViewChild(UserListComponent) child: UserListComponent;
  constructor(private simpleModalService: SimpleModalService, private toastr: ToastrService, private userService: UserService) {

    this.userForm = new FormGroup({
      first_name: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z]+$"),
      ]),
      last_name: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z]+$"),
      ]),
      phone_number: new FormControl("", [
        Validators.required,
        //Validators.pattern("P[0-9]*6"),
      ]),
      email: new FormControl("", [
        Validators.maxLength(30),
        Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i),
        Validators.required
      ]),

      company_name: new FormControl("", [
        Validators.required
      ]),
      business_address: new FormControl("", [
        Validators.required
      ]),
      business_type: new FormControl("", [
        Validators.required
      ]),
      tax_number: new FormControl("", [
        Validators.required
      ])
    });
  }

  ngOnInit() {
    console.log("working");
    console.log(this.userId);
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((usr: any) => {
        // console.log(usr.userDetails);
        this.userdate = usr.userDetails;
        this.userForm.patchValue({
          first_name: usr.userDetails.first_name,
          last_name: usr.userDetails.last_name,
          phone_number: usr.userDetails.phone_number,
          email: usr.userDetails.email,
          company_name: usr.userDetails.company_name,
          business_address: usr.userDetails.business_address,
          business_type: usr.userDetails.business_type,
          tax_number: usr.userDetails.tax_number
        });
        this.imagePath = usr.userDetails.profile_pic;
        this.isEditable = true;
      });
    }
  }

  submitted = false;
  onSubmitUser() {
    this.submitted = true;
    if (this.userForm.valid) {
      if (this.isEditable === false) {
        this.userService.createUser(this.userForm.value).subscribe(() => {
          this.toastr.success('User has been created.');
        }, err => {
          this.toastr.error(err.error.message);
        });
      } else {
        console.log("working");
        let userData = this.userForm.value;
        userData.user_id = this.userId;
        this.userService
          .putUser(this.userId, userData)
          .subscribe(() => {
            this.userService.closeOverlay();
            this.userService.onCompleted();
            this.toastr.success('User has been updated.');
          }, err => {
            this.toastr.error(err.error.message);
          });
      }

      this.submitted = false;

    } else {
      Object.keys(this.userForm.controls).forEach(key => {

        const controlErrors: ValidationErrors = this.userForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }
  }

  changeuserStatus(status) {
    this.userService.updateUserApprovStatus(this.userId, status).subscribe(() => {

      this.userService.closeOverlay();
      this.userService.onCompleted();
      this.toastr.success('User status has been updated.');

    }, err => {
      this.toastr.error(err.error.message);
    });

    // this.simpleModalService.addModal(ConfirmComponent, {
    //   title: 'Please Confirm',
    //   message: 'Are sure you want to update Status?'
    // }).subscribe((isConfirmed) => {
    //   if (isConfirmed) {

    //   }
    // });
  }

  clearValue() {
    this.userForm.reset();
  }

  public closeForm() {
    this.userService.closeOverlay();
  }

}
