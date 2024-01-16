import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service'
import { FormBuilder,  Validators } from '@angular/forms'
import { nameRegex, phoneRegex } from '../../../shared/regex-helpers'
import States from '../../../shared/states.json'
import { StateCheckValidator } from '../../../shared/state-validator'
import { FlashMessagesService } from 'angular2-flash-messages'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @Input() public user : any
  @Input() public dataLoaded : any
  states = States

  options = {
    componentRestrictions: { country: 'USA' }
  }

  constructor(
    private _dashboardService : DashboardService,
    private _fb : FormBuilder,
    private _spinner : NgxSpinnerService,
    private _flashMessagesService: FlashMessagesService,
    private _router : Router
  ) { }

  ngOnInit() {
    this.staffForm.patchValue({
      first_name : this.user.first_name,
      last_name : this.user.last_name,
      mobile_number : this.user.mobile_number,
      street : this.user.street,
      state : this.user.state,
      zipcode : this.user.zipcode,
      city : this.user.city,
      location_name : this.user.location_name
    })
  }

  staffForm = this._fb.group({
    first_name : ['', [Validators.required, Validators.maxLength(25) , Validators.pattern(nameRegex)]],
    last_name : ['', [Validators.required, Validators.maxLength(25), Validators.pattern(nameRegex)]],
    mobile_number : ['', [Validators.required, Validators.pattern(phoneRegex)]],
    street : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    state : ['', [Validators.required]],
    zipcode : ['', [Validators.required, Validators.maxLength(15)]],
    city : ['', [Validators.required, Validators.pattern(nameRegex), Validators.minLength(3), Validators.maxLength(25)]],
    location_name : [''],
    location_lat : [''],
    location_lng : ['']
  }, { validator : StateCheckValidator.MatchState })


  submitStaffForm() {
    this._spinner.show()
    if (
      this.staffForm.get('first_name').value==='' ||
      this.staffForm.get('last_name').value==='' ||
      this.staffForm.get('mobile_number').value==='' ||
      this.staffForm.get('state').value==='' ||
      this.staffForm.get('city').value==='' ||
      this.staffForm.get('street').value==='' ||
      this.staffForm.get('zipcode').value===''
    ) {
      this._spinner.hide()
    } 
    else {
      this._dashboardService.updateUser(this.staffForm.value, this.user['id'], localStorage.getItem('mdrt'))
      .subscribe(
        response => {
          this._spinner.hide()
          window.location.href = '/dashboard/staff-list'
        },
        error => {
          if (error.status===422) {
            this._spinner.hide()
            Object.keys(error.error).forEach(key => {
              const formControl = this.staffForm.get(key)
              if (formControl) {
                formControl.setErrors({
                  serverError : error.error[key][0]
                })
              }
            })
          }
          else if (error.status===0 || error.status===500) {
            this._flashMessagesService.show('Server is not responding', { cssClass: 'alert-danger', timeout: 5000 });
          }
          this._spinner.hide()
        }
      )
    }
  }

  getLocation(address: any) {
    this.staffForm.controls['location_name'].setValue(address.formatted_address)
    this.staffForm.controls['location_lat'].setValue(address.geometry.location.lat())
    this.staffForm.controls['location_lng'].setValue(address.geometry.location.lng())
  }

}
