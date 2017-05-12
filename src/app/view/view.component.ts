import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from "../socket.service";
@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, OnDestroy {

    constructor(private socketService: SocketService) { }
    connection;
    data;
    ngOnInit() {
        this.connection = this.socketService.getView().subscribe(response => {
            this.data = response['addresses'];
        })
        this.socketService.emitViewQuery(0);
    }
    ngOnDestroy() {
        this.connection.unsubscribe();
    }

}
