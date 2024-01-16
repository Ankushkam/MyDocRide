import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  
  socket : any
  private _url = 'localhost:9000'

  constructor() {
    this.socket = io(this._url)
  }
  
  listen(eventName : string) {
    return new Observable(subscriber => {
      this.socket.on(eventName, data => {
        subscriber.next(data);
      })
    })
  }

  emitRequest(eventName : string) {
    return this.socket.emit(eventName)
  }

}
