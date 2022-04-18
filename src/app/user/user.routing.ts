import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserAddComponent } from "./user-add/user-add.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserComponent } from "./user.component";

const routes: Routes = [
  {
    path: "",
    component: UserComponent,
    children: [
      {
        path: "",
        redirectTo: "user-list",
        pathMatch: "full",
      },
      {
        path: "user-add",
        component: UserAddComponent,
      },
      {
        path: "edit/:id",
        component: UserAddComponent,
      },
      {
        path: "user-list",
        component: UserListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
