import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Driver } from "../driver.model";
import { DriverService } from "../driver.service";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: "app-driver-form",
  templateUrl: "./driver-form.component.html",
  styleUrls: ["./driver-form.component.scss"],
})
export class DriverFormComponent implements OnInit {

  public driverId: number;
  isEditable: boolean = false;
  isViewOnly: boolean = false;
  public driverForm: FormGroup;
  public imagePath: String;
  public userdate: any;

  constructor(
    private driverService: DriverService,
    private toastr: ToastrService
  ) {
    this.driverForm = new FormGroup({
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
        Validators.pattern(/^[\+\d]?(?:[\d-.\s()]*)$/),
      ]),
      email: new FormControl("", [
        Validators.maxLength(30),
        Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i),
        Validators.required
      ]),
      delivery_company: new FormControl("", [
        Validators.required
      ]),

    });
  }

  ngOnInit() {
    console.log("working")
    console.log(this.driverId)
    if (this.driverId) {
      this.driverService.getDriverById(this.driverId).subscribe((drv: any) => {
        console.log(drv);
        this.userdate = drv.driverDetails;
        this.driverForm.patchValue({
          first_name: drv.driverDetails.first_name,
          last_name: drv.driverDetails.last_name,
          phone_number: drv.driverDetails.phone_number,
          email: drv.driverDetails.email,
          delivery_company: drv.driverDetails.delivery_company,
        });
        this.imagePath = drv.driverDetails.profile_pic;
        this.isEditable = true;

      });
    }
  }

  submitted = false;
  onSubmitDriver() {
    this.submitted = true;
    if (this.driverForm.valid) {

      if (this.isEditable === false) {
        this.driverService.createDriver(this.driverForm.value).subscribe(() => {
          this.toastr.success('User has been created.');
        }, err => {
          this.toastr.error(err.error.message);
        });
      } else {
        let userData = this.driverForm.value;
        userData.user_id = this.driverId;
        this.driverService
          .putDriver(this.driverId, userData)
          .subscribe(() => {
            this.driverService.closeOverlay();
            this.driverService.onCompleted();
            this.toastr.success('User has been updated.');
          }, err => {
            this.toastr.error(err.error.message);
          });
      }

      this.submitted = false;

    }
    else {
      Object.keys(this.driverForm.controls).forEach(key => {

        const controlErrors: ValidationErrors = this.driverForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }


  }

  clearValue() {
    this.driverForm.reset();
  }
  public closeForm() {
    this.driverService.closeOverlay();
  }

  changeuserStatus(status) {
    this.driverService.updateUserApprovStatus(this.driverId, status).subscribe(() => {

      this.driverService.closeOverlay();
      this.driverService.onCompleted();
      this.toastr.success('Driver status has been updated.');

    }, err => {
      this.toastr.error(err.error.message);
    });
  }
}
