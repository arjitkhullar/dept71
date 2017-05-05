import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

  constructor() { }
  private url = 'http://localhost:3003';
  private socket;

  saveData(data: object) {

    this.socket.emit('saveData', data);
  }
  getSheet(week: number) {
    this.socket = io(this.url);
    this.socket.emit('getSheet', week);
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

}