import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketService } from '../socket.service';
import { MdButtonModule, MdInputModule } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SocketService]
})
export class AdminComponent implements OnInit, OnDestroy {
  connection;
  partsConnection;
  usersConnection;
  messages = [];
  users;
  dashboard;
  copy_dash;
  public temp_users = {};
  message = '';
  invalidPart = '';
  invalidUser = '';
  closeResult: string;
  highlightedWeek = 1;
  weekArray: Object = { '1': true };
  modelTitle = '';
  // @ViewChild('name') name: ElementRef;
  // @ViewChild('part') part: ElementRef;
  public myForm: FormGroup;
  constructor(private _fb: FormBuilder,
    private socketService: SocketService, private modalService: NgbModal) { }
  ngOnDestroy() {
    this.connection.unsubscribe();
    this.partsConnection.unsubscribe();
    this.usersConnection.unsubscribe();
  }
  ngOnInit() {

    this.myForm = this._fb.group({
      addresses: this._fb.array([
        this.initAddress(),
      ])
    });
    const control = <FormGroup>this.myForm;
    this.connection = this.socketService.getMessages().subscribe(data => {
      this.messages.push(data);
      const addlength = <FormArray>this.myForm.controls['addresses'];
      let i: number, d: number, p: number;
      if (addlength.length < data['sheet']['addresses'].length) {
        while (addlength.length !== data['sheet']['addresses'].length) {
          this.addAddress();
        }
      } else if (addlength.length > data['sheet']['addresses'].length - 1) {
        while (data['sheet']['addresses'].length !== addlength.length) {
          const control = <FormArray>this.myForm.controls['addresses'];
          control.removeAt(data['sheet']['addresses'].length);
        }
      }
      for (i = 0; i < data['sheet']['addresses'].length; i++) {
        for (d = 0; d < data['sheet']['addresses'][i]['days'].length; d++) {
          const len = <FormArray>this.myForm.get(`addresses.${i}.days.${d}`);
          if (data['sheet']['addresses'][i]['days'][d].length > len.length) {
            while (data['sheet']['addresses'][i]['days'][d].length !== len.length) {
              this.addPart(i, d);
            }
          } else if (data['sheet']['addresses'][i]['days'][d].length < len.length) {
            while (data['sheet']['addresses'][i]['days'][d].length !== len.length) {
              this.removePart(i, d, len.length - 1);
            }
          }
        }

      }
      control.setValue(data['sheet'], {
        onlySelf: true
      });
      // let event = new MouseEvent('click', { bubbles: true });
      // this.name.nativeElement.dispatchEvent(event);
    });
    this.partsConnection = this.socketService.getParts().subscribe(data => {

      this.dashboard = data['parts'];
      this.copy_dash = data['parts'];
    });
    this.usersConnection = this.socketService.getUsers().subscribe(data => {
      this.users = data['users'];
    });
    this.socketService.emitSheetquery(0);
    this.socketService.emitPartsquery();
    this.socketService.emitUsersquery();


  }
  copySheet(toWeek: number) {
    const WeekTransfer = { 'from': this.highlightedWeek - 1, 'to': toWeek };
    this.socketService.transferSheet(WeekTransfer);
  }

  valueChanged(event: any, i: number, d: number, p: number) {
    if (event !== undefined) {
      const control = <FormArray>this.myForm.get(`addresses.${i}.days.${d}.${p}.part`);
      if (typeof (control) === 'object') {
        control.setValue(control['_value']['name'], { onlySelf: false });
      }
    }
  }

  toggleHighlight(newValue: number) {
    if (this.highlightedWeek === newValue) {
      this.highlightedWeek = -1;
    } else {
      this.highlightedWeek = newValue;
    }
  }
  createSheet(week: number) {
    this.weekArray = {};
    this.weekArray[(week + 1)] = true;
    this.socketService.emitSheetquery(week);
  }
  UserUpdate(event: any, user: string, i: number) {
    if (event !== undefined) {
      const control = <FormArray>this.myForm.get(`addresses.${i}.name`);
      if (typeof (control) === 'object') {
        control.setValue(control['_value']['name'], { onlySelf: false });
      }
    }
    // this.users.splice(this.users.indexOf(user), 1);
    // this.temp_users[index] = user;
  }
  initAddress() {
    return this._fb.group({
      name: '',
      days: this._fb.array([
        this._fb.array([
          this.initPart(),
        ]),
        this._fb.array([
          this.initPart(),
        ]),
        this._fb.array([
          this.initPart(),
        ]),
        this._fb.array([
          this.initPart(),
        ]),
        this._fb.array([
          this.initPart(),
        ]),
        this._fb.array([
          this.initPart(),
        ]),
      ]),

    });
  }
  initPart() {
    return this._fb.group({
      part: '',
    });
  }

  autocompleListFormatter = (data: any) => {
    return data.name;
  }
  addAddress() {
    const control = <FormArray>this.myForm.controls['addresses'];
    control.push(this.initAddress());
  }
  removeAddress(i: number, user: string) {
    const control = <FormArray>this.myForm.controls['addresses'];
    control.removeAt(i);
    // this.users.push(this.temp_users[i]);
  }
  addPart(i: number, d: number) {
    const control = <FormArray>this.myForm.get(`addresses.${i}.days.${d}`);
    control.push(this.initPart());
  }
  removePart(i: number, d: number, p: number) {
    const control = <FormArray>this.myForm.get(`addresses.${i}.days.${d}`);
    control.removeAt(p);
  }
  save(model: Object, content) {
    const regxTest = /[@]\d{1}$/;
    const regxGet = /(.*)@(\d)/;
    this.message = '';
    this.invalidPart = '';
    this.invalidUser = '';
    const days = { 0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday', 4: 'Friday', 5: 'Saturday' };
    for (const i of model['addresses']) {
      i['days'].forEach((d, index) => {
        for (const p of d) {
          if (regxTest.test(p['part'])) {
            const match = regxGet.exec(p['part']);
            this.changeCount(match[1], +match[2]);
          } else {
            if (!this.changeCount(p['part'], 1)) {
              if (p['part'] === '') {
                this.invalidPart += `Please add a part for ${i['name']} on ${days[index]} \n`;
              } else {
                this.invalidPart += `Please add ${p['part']} to the parts list\n`;
              }
            }
          }
        }
      });
      this.CheckForm(i['name']);
    }
    this.CheckForm();
    this.modalService.open(content).result.then((result) => {

      if (result === 'Yes') {
        let select: number;
        Object.keys(this.weekArray).forEach(function (key) {
          select = +key;
        });
        this.socketService.saveData(model, +select - 1);
      }
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
    this.restoreDash();

  }
  changeCount(part: string, num: number): boolean {
    for (const i of this.copy_dash) {
      if (i['name'].trim() === part.trim()) {
        i['quantity'] -= num;
        return true;
      }
    }
    return false;
  }
  CheckForm(name?: string) {
    if (name === undefined) {
      for (const i of this.copy_dash) {
        if (+i['quantity'] > 0) {
          this.message += `${i['quantity']} X ${i['name']} left unallotted\n`;
        }
        if (+i['quantity'] < 0) {
          this.message += `${(-1 * +i['quantity'])} extra ${i['name']} allotted\n`;
        }
      }
      this.message += this.invalidPart;
    } else {
      let isValid = false;
      this.users.forEach((user, index) => {
        if (user['name'] === name) {
          isValid = true;
        }
      });
      if (!isValid) {
        this.invalidUser += `Please add ${name} to the users list\n`;
      }
      this.message += this.invalidUser;
    }
    if (this.message.length > 1) {
      this.modelTitle = 'Still Submit ?';
    } else {
      this.modelTitle = 'Save Now ?';
    }
  }
  restoreDash() {
    this.copy_dash = JSON.parse(JSON.stringify(this.dashboard));
  }
}
;
