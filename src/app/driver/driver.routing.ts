import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DriverFormComponent } from "./driver-form/driver-form.component";
import { DriverListComponent } from "./driver-list/driver-list.component";
import { DriverComponent } from "./driver.component";

const routes: Routes = [
  {
    path: "",
    component: DriverComponent,
    children: [
      {
        path: "",
        redirectTo: "driver-list",
        pathMatch: "full",
      },
      {
        path: "driver-form",
        component: DriverFormComponent,
      },
      {
        path: "edit/:id",
        component: DriverFormComponent,
      },
      {
        path: "driver-list",
        component: DriverListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverRoutingModule {}
