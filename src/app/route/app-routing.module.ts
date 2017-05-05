import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';

import { AdminComponent } from '../admin/admin.component';
import { UserComponent } from '../user/user.component';
import { TestComponent } from '../test/test.component';
import { ViewComponent } from "app/view/view.component";
import { PartsComponent } from "app/parts/parts.component";

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'test', component: TestComponent },
  { path: 'view', component: ViewComponent },
  { path: 'user', component: UserComponent },
  { path: 'parts', component: PartsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private _router: Router) { }
}