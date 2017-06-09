import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocketService } from '../socket.service';
import { MdButtonModule, MdInputModule } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.css']
})
export class PartsComponent implements OnInit, OnDestroy {
  public myForm: FormGroup;
  connection;
  messages = [];
  constructor(private _fb: FormBuilder, private socketService: SocketService, private modalService: NgbModal) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      parts: this._fb.array([
        this.initPart()
      ])
    });
    const control = <FormGroup>this.myForm.controls['parts'];
    this.connection = this.socketService.getParts().subscribe(data => {
      this.messages.push(data);
      let thisForm = <FormArray>this.myForm.controls['parts'];
      if (thisForm.length < data['parts'].length) {
        while (thisForm.length != data['parts'].length) {
          this.addPart();
        }
      }
      else if (thisForm.length > data['parts'].length) {
        while (thisForm.length != data['parts'].length) {
          this.removePart(thisForm.length);
        }
      }
      control.setValue(data['parts'], { onlySelf: true });
    })
    this.socketService.emitPartsquery();
  }
  ngOnDestroy() {
    this.connection.unsubscribe();
  }
  initPart() {
    return this._fb.group({
      name: '',
      quantity: null,
      hours: null
    })
  }

  addPart() {
    const control = <FormArray>this.myForm.get(`parts`);
    control.push(this.initPart());
  }
  removePart(i: number) {
    const control = <FormArray>this.myForm.get(`parts`);
    control.removeAt(i);
  }
  save(model: object, content) {
    this.modalService.open(content);
    this.socketService.saveParts(model);
    this.socketService.emitPartsquery();
  }
}
