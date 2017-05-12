import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

  constructor() { }
  private url = 'http://10.27.10.177:3003';
  private socket;

  saveData(data: object, week: number) {

    this.socket.emit('saveData', { 'data': data, 'week': week });
  }
  emitSheetquery(week: number) {
    this.socket.emit('getSheet', week);
  }
  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('loadSheet', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
  transferSheet(pram: Object) {
    this.socket.emit('transferSheet', pram);
  }
  emitPartsquery() {
    this.socket.emit('getParts', 'sendParts');
  }
  saveParts(data: object) {
    this.socket.emit('saveParts', data);
  }
  getParts() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('loadParts', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
  emitUsersquery() {
    this.socket.emit('getUsers', 'sendUsers');
  }
  saveUsers(data: object) {
    this.socket.emit('saveUsers', data);
  }
  getUsers() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('loadUsers', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
  emitViewQuery(week: number) {
    this.socket.emit('getView', week);
  }
  getView() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('ShowView', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}