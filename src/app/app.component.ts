import { Component, OnInit } from '@angular/core';
import { WebsocketsService } from './websockets.service';
import { MessagingService } from './shared/messaging.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'gofer-frontend';

  constructor(
    private _messagingService: MessagingService
    // private _websocketsService : WebsocketsService,
  ) {}

  ngOnInit() {
    // this._messagingService.requestPermission()
    // this._messagingService.receiveMessage()
    // console.log(this._messagingService.currentMessage)
    // this._websocketsService.listen('testEvent').subscribe(data => {
    //   console.log(data)
    // })
  }

  // emit() {
  //   this._websocketsService.emitRequest('testEvent')
  // }

}
