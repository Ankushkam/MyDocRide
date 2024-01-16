import { Component, OnInit, Input } from '@angular/core';
import { MemberService } from '../memberlist/member.service'
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router'
import { NewRequestService } from './new-request.service';

declare var $ : any

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {
  @Input() public user : any
  @Input() public dataLoaded : any
  @Input() public bookings : any
  doctorsList : any = []
  patient : any
  doctor : any
  request : any = []

  constructor(
    private _memberService : MemberService,
    private _router : Router,
    private _newRequestService : NewRequestService,
  ) { }

  ngOnInit() {
    if(this.user.user_type == "HCPDoctor")
      this.selectRequest('',this.user.id)
  }

  showDoctors(event, patient) {
    this._memberService.getDoctors(localStorage.getItem('mdrt')).
    subscribe(
      response => {
        this.doctorsList = response['data']
        this.patient = patient
        $('#doctorsList').modal('show')
      },
      error => {
        this.doctorsList = []
        $('#doctorsList').modal('hide')
      }
    )
  }

  selectRequest(event, doc_id){
    this.doctor = doc_id
    this._newRequestService.newAppointments(localStorage.getItem('mdrt'), this.user.id)
    .subscribe(
      response => {
        this.request = response['data']
        $('#doctorsList').modal('show')
      },
      error => {
        this.request = []
        $('#doctorsList').modal('hide')
      }
    )
  }

  bookRide(event, patient) {
    localStorage.setItem('pt', CryptoJS.AES.encrypt(JSON.stringify({
      id: patient.patient_details.id, 
      name: `${patient.patient_details.first_name} ${patient.patient_details.last_name}`, 
      image: patient.patient_details.image,
      pickup_name : patient.pickup_address,
      pickup_lat : patient.lat,
      pickup_lng : patient.lng,
      destination_name : this.user.location_name,
      destination_lat : this.user.location_lat,
      destination_lng : this.user.location_lng,
      vehical_name : patient.car.car_name,
      vehical_id : patient.car_type,
      doctor_id: this.doctor,
      appointment_date : patient.appointment_date
    }),'mydocridela123'))
    $('#doctorsList').modal('hide')
    this._router.navigate([`/dashboard/schedule-ride`])
  }

}
