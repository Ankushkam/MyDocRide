import { Component, OnInit, Input } from '@angular/core';
import { PatientListService } from './patient-list.service'
import { Router } from '@angular/router'
import * as CryptoJS from 'crypto-js';

declare let $ : any

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  @Input() public user : any
  public patientsList = []
  public errorMsg
  public staff_id

  constructor(
    private _patientListService : PatientListService,
    private _router : Router
  ) { }

  ngOnInit() {
  }

  showModal(event, staff_id) {
    this.staff_id = staff_id
    this._patientListService.getPatients(staff_id, localStorage.getItem('mdrt'))
    .subscribe(
      response => {
        this.patientsList = response['data']
        // if(this.patientsList[0] && this.patientsList[0]['members'].length > 0)
        //   this.patientsList = this.patientsList[0]['members']

        $('#patientsList').modal('show')
      }, 
      error => {
        this.patientsList = []
        $('#patientsList').modal('show')
      }
    )
  }

  bookRide(event, patient) {
    localStorage.setItem('pt', CryptoJS.AES.encrypt(JSON.stringify({
      id: patient.id, 
      name: `${patient.first_name} ${patient.last_name}`, 
      image: patient.image, 
      doctor_id: this.staff_id,
      pickup_name : '',
      pickup_lat : '',
      pickup_lng : '',
      destination_name : patient.location_name,
      destination_pickup_name : patient.street+','+patient.street,
      destination_lat : patient.location_lat,
      destination_lng : patient.location_lng,

      vehical_name : '',
      vehical_id : '',
    }),'mydocridela123'))
    $('#patientsList').modal('hide')
    this._router.navigate([`/dashboard/schedule-ride`])
  }

}
