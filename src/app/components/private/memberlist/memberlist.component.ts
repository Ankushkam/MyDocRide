import { Component, OnInit, Input} from '@angular/core';
import { MemberService } from './member.service'
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router'
 
declare var $ : any

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.css']
})
export class MemberlistComponent implements OnInit {
  @Input('membersList') public membersList  : any
  @Input() public user : any
  @Input() dataLoaded : any
  doctorsList : any = []
  patient : any

  constructor(
    private _memberService : MemberService,
    private _router : Router
  ) { }

  ngOnInit() {
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

  bookRide(event, doctor_id) {
    localStorage.setItem('pt', CryptoJS.AES.encrypt(JSON.stringify({
      id: this.patient.id, 
      name: `${this.patient.first_name} ${this.patient.last_name}`, 
      image: this.patient.image, 
      doctor_id: doctor_id,
      pickup_name : '',
      pickup_lat : '',
      pickup_lng : '',
      destination_name : this.user.location_name,
      destination_lat : this.user.location_lat,
      destination_lng : this.user.location_lng,
      vehical_name : '',
      vehical_id : '',
    }),'mydocridela123'))
    $('#doctorsList').modal('hide')
    this._router.navigate([`/dashboard/schedule-ride`])
  }

  patbookRide(event, patient) {
    localStorage.setItem('pt', CryptoJS.AES.encrypt(JSON.stringify({
      id: patient.id, 
      name: `${patient.first_name} ${patient.last_name}`, 
      image: patient.image, 
      doctor_id: this.user['id'],
      pickup_name : patient.location_name,
      pickup_lat : patient.location_lat,
      pickup_lng : patient.location_lng,
      destination_name : this.user['location_name'],
      destination_lat : this.user['location_lat'],
      destination_lng : this.user['location_lng'],
      vehical_name : '',
      vehical_id : '',
    }),'mydocridela123'))
    $('#patientsList').modal('hide')
    this._router.navigate([`/dashboard/schedule-ride`])
  }

}
