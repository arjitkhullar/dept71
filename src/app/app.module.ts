import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { AppRoutingModule } from './route/app-routing.module';
import { ViewComponent } from './view/view.component';
import { PartsComponent } from './parts/parts.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from './socket.service';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UserComponent,
    ViewComponent,
    PartsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MaterialModule,
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NguiAutoCompleteModule,
    AppRoutingModule,
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
