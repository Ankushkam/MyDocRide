import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import {AngularFireMessaging} from '@angular/fire/messaging';
import {BehaviorSubject} from 'rxjs';
import { DashboardService } from '../dashboard/dashboard.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public notificationCount : number = 0
  currentMessage = new BehaviorSubject(null);

  constructor(
    private _router: Router, private _route : ActivatedRoute,
    private angularFireMessaging: AngularFireMessaging,
    private _dashboardService : DashboardService,
  ) {
    this.angularFireMessaging.messaging.subscribe(
      (_message : any) => {
        //_message.onMessage = _message.onMessage.bind(_message);
        _message._next = (payload: any) => {
            Swal.fire({
              title: payload.data.title,
              text : payload.data.body,
              icon: 'info',
              showCancelButton: true,
              cancelButtonText : 'Close',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Go to New Requests',
            }).then((result) => {
              if (result.value) {
                window.location.href = '/dashboard/notifications'
              }
            })
            // this.notificationCount = this.notificationCount + 1
          };
        _message.onTokenRefresh = _message.onTokenRefresh.bind(_message);
      }
    )  
  }

  ngOnInit() {
    this.requestPermission()
    this.receiveMessage()
  }

  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this._dashboardService.saveToken({token}, localStorage.getItem('mdrt'))
        .subscribe(
          response => {
            console.log(response)
          },
          error => {
            console.log(error)
          }
        )
      }
    )
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        this.currentMessage.next(payload);
      }
    )
  }

}
