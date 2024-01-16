import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PatientsListComponent } from '../patients-list/patients-list.component'

@Component({
  selector: 'app-stafflist',
  templateUrl: './stafflist.component.html',
  styleUrls: ['./stafflist.component.css']
})
export class StafflistComponent implements OnInit {
  @Input() dataLoaded : any
  @Input() staffList : any
  @Input('user') public user
  @ViewChild(PatientsListComponent, {static : true}) patientsListComponent : PatientsListComponent

  constructor() { }

  showPatients(event, staff_id) {
    if (this.user.user_type==='HCP' || this.user.user_type==='CG') {
      this.patientsListComponent.showModal(event, staff_id)
    }
  }

  ngOnInit() {

  }

}
