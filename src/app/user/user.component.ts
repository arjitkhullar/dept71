import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocketService } from "../socket.service";
import { MdButtonModule, MdInputModule } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  public myForm: FormGroup;
  connection;
  messages = [];
  constructor(private _fb: FormBuilder, private socketService: SocketService, private modalService: NgbModal) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      users: this._fb.array([
        this.initUser()
      ])
    });
    const control = <FormGroup>this.myForm.controls['users'];
    this.connection = this.socketService.getUsers().subscribe(data => {
      this.messages.push(data);
      let thisForm = <FormArray>this.myForm.controls['users'];
      if (thisForm.length < data['users'].length) {
        while (thisForm.length != data['users'].length) {
          this.addUser();
        }
      } else if (thisForm.length > data['users'].length) {
        while (thisForm.length != data['users'].length) {
          this.removeUser(thisForm.length);
        }
      }
      control.setValue(data['users'], { onlySelf: true });
    })
    this.socketService.emitUsersquery();
  }
  ngOnDestroy() {
    this.connection.unsubscribe();
  }
  initUser() {
    return this._fb.group({
      name: '',
      hours: null
    })
  }

  addUser() {
    const control = <FormArray>this.myForm.get(`users`);
    control.push(this.initUser());
  }
  removeUser(i: number) {
    const control = <FormArray>this.myForm.get(`users`);
    control.removeAt(i);
  }
  save(model: object, content) {
    this.modalService.open(content);
    this.socketService.saveUsers(model);
    this.socketService.emitUsersquery();
  }
}
