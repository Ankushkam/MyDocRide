import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DashboardService } from '../dashboard/dashboard.service'
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmPasswordValidator } from '../../../shared/password-custom-validation';
import { isNull } from 'util'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @Input() public user : any
  @Input() public dataLoaded : any
  public passwordErrorServer : boolean
  public passwordErrorClient : boolean
  public passwordErrorMsg : string
  public isPasswordUpdate : boolean
  public updatedPasswordAt : string

  constructor(
    private _fb : FormBuilder,
    private _dashboardService : DashboardService,
    private _spinner : NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.companyForm.patchValue({
      hospital_name : this.user.hospital_name
    })
  }

  passwordForm = this._fb.group({
    current_password : ['', [Validators.required]],
    password : ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation : ['', [Validators.required]]
  }, { validator : ConfirmPasswordValidator.MatchPassword })

  updatePassword() {
    this._spinner.show()
    this.passwordErrorServer = false
    this.passwordErrorClient = false
    if (this.passwordForm.get('current_password').value === this.passwordForm.get('password').value) {
      this.passwordErrorClient = true
      this.passwordErrorMsg = 'Current password and New password cannot be same.'
    } 
    else {
      this._dashboardService.updatePassword(localStorage.getItem('mdrt'), this.passwordForm.value)
      .subscribe(
        response => {
          this._spinner.hide()
          this.passwordForm.reset()
          this.isPasswordUpdate = true
          this.updatedPasswordAt = response['password_updated_at']
        },
        error => {
          if (error.status===401) {
            this._spinner.hide()
            this.passwordErrorServer = true
            this.passwordErrorMsg = error.error['message']
          } 
          else {
            this._spinner.hide()
          }
        }
      )
    }
  }

  companyForm = this._fb.group({
    hospital_name : ['', [Validators.required, Validators.maxLength(50)]]
  })

  updateCompany() {
    this._spinner.show()
    this._dashboardService.updateHospital(localStorage.getItem('mdrt'), this.companyForm.value, this.user.id)
    .subscribe(
      response => {
        this._spinner.hide()
      },
      error => {
        this._spinner.hide()
      }
    )
  }

}
