import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PendingRequestServiceService } from './pending-request-service.service';
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from 'ngx-spinner';
declare let $ : any
@Component({
  selector: 'app-pending-request-list',
  templateUrl: './pending-request-list.component.html',
  styleUrls: ['./pending-request-list.component.css']
})
export class PendingRequestListComponent implements OnInit {
  @Input('AppointmentList') public pendingList:any
  @Input() public user : any
  @Input() public dataLoaded : any
  public flag=false
  

  constructor(  private _spinner : NgxSpinnerService,private pendingRequestService:PendingRequestServiceService,http:HttpClient) { }

  ngOnInit() {
    // this.fetchPendingList(this.user.id)
    if(this.pendingList){
      
this.flag=this.pendingList.length>0
      
    }
  }
accept(item){
  this._spinner.show()
  this.pendingRequestService.setPendingAppointmentStatus({appointment_id:item.id,accepted:1},
   localStorage.getItem('mdrt')).subscribe(res=>{
     item.status="Accepted"
    this._spinner.hide()
   },
   error => {
    this._spinner.hide()
  })

}
reject(item){
  this._spinner.show()
  this.pendingRequestService.setPendingAppointmentStatus({appointment_id:item.id,accepted:2},
     localStorage.getItem('mdrt')).subscribe(res=>{
      item.status="Rejected"
      this._spinner.hide()
     },
     error => {
      this._spinner.hide()
          })
}
  // fetchPendingList(staff_id){
  //   this.pendingRequestService.getPenidnAppointments(staff_id, localStorage.getItem('mdrt'))
  //   .subscribe(
  //     response => {
  //       this.pendingList = response['data']
  //     }, 
  //     error => {
  //       this.pendingList = []
        
  //     })
  // }

}
