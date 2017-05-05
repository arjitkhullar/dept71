import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { SocketService } from "../socket.service";
import { DataExchangeService } from "app/data-exchange.service";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SocketService, DataExchangeService]
})
export class AdminComponent implements OnInit, OnDestroy {
    connection;
    public myForm: FormGroup;
    @ViewChild('input')
    input: ElementRef;




    ngOnDestroy() {
        // this.connection.unsubscribe();
    }

    public data = { "addresses": [{ "name": "Cser3", "days": [[{ "part": "CE", "alloted": "22" }], [{ "part": "CE", "alloted": "0" }], [{ "part": "DE", "alloted": "0" }], [{ "part": "CE", "alloted": "0" }], [{ "part": "DE", "alloted": "0" }], [{ "part": "HE", "alloted": "0" }]] }] };

    ngOnInit() {
        // this.connection = this.socketService.getMessages().subscribe(message => {
        //     this.messages.push(message);
        // })
        this.myForm = this._fb.group({
            addresses: this._fb.array([
                this.initAddress(),
            ])
        });
        const control = <FormGroup>this.myForm;
        setTimeout(() => {
            control.setValue(this.data, { onlySelf: true });

        }, 1000);
    }
    constructor(private _fb: FormBuilder, private _sanitizer: DomSanitizer,
        private socketService: SocketService, private sheetService: DataExchangeService) {

    }

    createSheet(week: number) {
        console.log(week);
        this.sheetService.getSheet(week);
        // return +num;
    }
    UserUpdate(user: string, index: number) {
        this.users.splice(this.users.indexOf(user), 1);
        this.temp_users[index] = user;
    }
    returnCount(val: number, dir: number): number {
        let y = +val;
        return y += dir;
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
            alloted: ''
        });
    }
    public users = [
        'AUser1',
        'Bser2',
        'Cser3',
        'Dser4',
        'Eser5',
        'Fser6',
    ]
    public temp_users = {};
    changeCount(part: string, num: number) {
        for (let i of this.dashboard) {
            if (i['name'] == part) {
                i['quantity'] += num;
            }
        }
    }
    public dashboard = [
        {
            name: 'AQ',
            quantity: 4
        },
        {
            name: 'BE',
            quantity: 6
        },
        {
            name: 'CE',
            quantity: 6
        },
        {
            name: 'DE',
            quantity: 6
        },
        {
            name: 'HE',
            quantity: 6
        },
        {
            name: 'FE',
            quantity: 6
        },
        {
            name: 'FF',
            quantity: 6
        }]
    public continents = [{
        id: 1,
        name: 'AQ',
        hours: '4'
    }, {

        id: 2,
        name: 'BE',
        hours: '1'
    }, {

        id: 3,
        name: 'CE',
        hours: '7'
    }, {

        id: 4,
        name: 'DE',
        hours: '4'
    }, {

        id: 5,
        name: 'HE',
        hours: '3'
    }, {

        id: 6,
        name: 'FE',
        hours: '3'
    }, {

        id: 7,
        name: 'FF',
        hours: '06'
    }
    ];
    autocompleListFormatter = (data: any): SafeHtml => {
        let html = `<span>${data.quantity} X ${data.name}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }
    addAddress() {
        const control = <FormArray>this.myForm.controls['addresses'];
        control.push(this.initAddress());
    }

    removeAddress(i: number, user: string) {
        const control = <FormArray>this.myForm.controls['addresses'];
        control.removeAt(i);
        this.users.push(this.temp_users[i]);

    }
    addPart(i: number, d: number) {
        const control = <FormArray>this.myForm.get(`addresses.${i}.days.${d}`);
        control.push(this.initPart());
    }
    removePart(i: number, d: number, p: number) {
        const control = <FormArray>this.myForm.get(`addresses.${i}.days.${d}`);
        control.removeAt(p);
    }
    save(model: Object) {
        console.log(JSON.stringify(model));
        this.socketService.saveData(model);
    }

}