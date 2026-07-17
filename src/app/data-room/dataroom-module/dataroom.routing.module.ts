import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HashLocationStrategy } from "@angular/common";

const appRoutes: Routes = [
  // { path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule],
})
export class DataroomModule {}
