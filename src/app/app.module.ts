import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { TestComponent } from './test/test.component';
import { AppRoutingModule } from './route/app-routing.module';
import { ViewComponent } from './view/view.component';
import { PartsComponent } from './parts/parts.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdInputModule } from '@angular/material';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import 'hammerjs';
import { SocketService } from "./socket.service";
import { DataExchangeService } from "app/data-exchange.service";



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UserComponent,
    TestComponent,
    ViewComponent,
    PartsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MdButtonModule,
    MdInputModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2AutoCompleteModule,
    AppRoutingModule,
  ],
  providers: [SocketService, DataExchangeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
