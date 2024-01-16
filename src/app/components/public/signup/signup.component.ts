import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../../../shared/password-custom-validation';
import { SignupService } from './signup.service'
import { NgxSpinnerService } from "ngx-spinner";
import { FlashMessagesService } from 'angular2-flash-messages'; 
import { ActivatedRoute, Router, ParamMap } from '@angular/router'
import { nameRegex, phoneRegex, userTypeRegex } from '../../../shared/regex-helpers'
import { isNull } from 'util';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class  SignupComponent implements OnInit {

  showForgotPasswordForm = false
  showResendLink = false
  noDataList = true
  companies = []
  showPatientCaregiverRadios = false
  showCompanyDriverRadios = false
  public userType : string 
  options = {
    componentRestrictions: { country: 'USA' }
  }
  isConflict = false
  conflictMessage : string
  showRadios : boolean = false

  constructor(
    private _fb : FormBuilder, 
    private _signupService : SignupService,
    private _spinner : NgxSpinnerService,
    private _route : ActivatedRoute,
    private _router : Router,
    private _flashMessagesService: FlashMessagesService
    ) { }

  //Forgot Password Form
  forgotPasswordForm = this._fb.group({
    password : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    password_confirmation : ['', [Validators.required]],
  }, { validator : ConfirmPasswordValidator.MatchPassword })

  //Forgot Password Processing After CLick
  forgotPassword(event) {
    if(localStorage.getItem('fa')) {
      this._spinner.show()
      let data = {
        email : CryptoJS.AES.decrypt(localStorage.getItem('fa'), 'mydocridela123').toString(CryptoJS.enc.Utf8),
        password : this.forgotPasswordForm.get('password').value,
        password_confirmation : this.forgotPasswordForm.get('password_confirmation').value,
        token : ''
      }
      this._route.paramMap.subscribe((paramMap: ParamMap) => {
        data.token = paramMap.get('token')
      })
      
      this._signupService.passwordReset(data)
      .subscribe(
        response => {
          this._spinner.hide()
          this._flashMessagesService.show(response['message'], { cssClass: 'alert-success', timeout: 5000 });
          localStorage.removeItem('fa')
          this.forgotPasswordForm.reset()
          this.login()
        },
        error => {
          if(error.status===422) {
            this._flashMessagesService.show('Invalid request.', { cssClass: 'alert-danger', timeout: 5000 });
          }
          else {
            this._flashMessagesService.show('Invalid request.', { cssClass: 'alert-danger', timeout: 5000 });
          }
          this._spinner.hide()
        }
      )
    }
    else {
      this._flashMessagesService.show('Invalid Request.', { cssClass: 'alert-danger', timeout: 5000 });
    }
  }

  //Registration Form
  registrationForm = this._fb.group({
    first_name : ['', [Validators.required, Validators.maxLength(25), Validators.pattern(nameRegex)]],
    last_name : ['', [Validators.required, Validators.maxLength(25), Validators.pattern(nameRegex)]],
    company : ['', [Validators.required]],
    mobile_number : ['', [Validators.required, Validators.pattern(phoneRegex)]],
    email : ['', [Validators.required, Validators.email]],
    password : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    password_confirmation : ['', [Validators.required]],
    terms_of_service : ['',[Validators.required]],
    type : [''],
    approved : [false],
    address : [''],
    latitude : [''],
    longitude : ['']
  }, { validator : ConfirmPasswordValidator.MatchPassword });

  //Registration Processing After CLick
  registerUser(event) {
     //Setting terms_of_service value to empty if unchecked 
    if(this.registrationForm.value.terms_of_service == false || this.registrationForm.value.terms_of_service == '' ) {
      this.registrationForm.value.terms_of_service = ""
    }
    this.isConflict = false
    this._spinner.show()
    if(this.showPatientCaregiverRadios)
      this.registrationForm.value.type = 'CG';
    this._signupService.signup(this.registrationForm.value).subscribe(
      response => {
        this._flashMessagesService.show(response['message'], { cssClass: 'alert-success', timeout: 5000 });
        this.showResendLink = true
        localStorage.setItem('number', window.btoa(response['id']))
        this.registrationForm.reset()
        this._spinner.hide()
        this.showResendLink = true
      },
      error => {
        if (error.status===422) {
          Object.keys(error.error).forEach(key => {
            const formControl = this.registrationForm.get(key)
            if (formControl) {
              formControl.setErrors({
                serverError : error.error[key][0]
              })
            }
          })
            
        }
        else if (error.status===409) {
          this.isConflict = true
          this.conflictMessage = error.error['message']
        }
        else if (error.status===0 || error.status===500) {
          this._flashMessagesService.show('Server is not responding', { cssClass: 'alert-danger', timeout: 5000 });
        }
        this._spinner.hide()
      }
    )
  }
  
  //Redirecting To Login
  login() {
    this._router.navigate(['/welcome/login'])
  }

  //Resending Account Verification Email
  resendEmail() {
    this._spinner.show()
    if (localStorage.getItem('number')) {
      this._signupService.getUserForResendEmail(window.atob(localStorage.getItem('number')))
      .subscribe(
        response => {
          this._flashMessagesService.show(response['message'], { cssClass: 'alert-success', timeout: 5000 });
          this._spinner.hide()
        },
        error => {
          if (error.status===429) {
            this._flashMessagesService.show('Too many attempts, try after 1 minute', { cssClass: 'alert-danger', timeout: 5000 });
          } 
          else {
            this._flashMessagesService.show(error['message'], { cssClass: 'alert-danger', timeout: 5000 });
          }
          this._spinner.hide()
        }
      )
    } 
  }

  ngOnInit() {
    if (localStorage.getItem('mdrt')) {
      this._router.navigate(['/dashboard/staff-list'])
    }
    else {
      this._route.paramMap.subscribe((paramMap: ParamMap) => {
        if (!isNull(paramMap.get('token')) && paramMap.get('token').length === 64) {
          this.showForgotPasswordForm = true
        }
        else {
          if(paramMap.get('type')==='healthcare') {
            this.showRadios = false
            this.userType = 'h' //h denotes healthcare
            this.registrationForm.controls['type'].setValue('HCP')
            const role = 'HCP'
            this._signupService.companies(role).subscribe(
              response => {
                this.companies = response['companies']
              }
            )
          }
          else if(paramMap.get('type')==='caregiver') {
            this.showRadios = true
            this.userType = 'pc' //pc denotes patient-caregiver
            this.showPatientCaregiverRadios = true
            const role = 'CG'
            this._signupService.companies(role).subscribe(
              response => {
                this.companies = response['companies']
              }
            )
          }
          else if(paramMap.get('type')==='transportationproviders') {
            this.showRadios = true
            this.userType = 'd' //d denotes driver
            this.showCompanyDriverRadios = true
            // this.registrationForm.controls['type'].setValue('Driver')
            const role = 'Driver'
            this._signupService.companies(role).subscribe(
              response => {
                this.companies = response['companies']
              }
            )
          }
          else {
            this._router.navigate(['/'])
          }
        }
      })
    }
  }

  getAddress(address: any) {
    this.registrationForm.controls['address'].setValue(address.formatted_address)
    this.registrationForm.controls['latitude'].setValue(address.geometry.location.lat()) 
    this.registrationForm.controls['longitude'].setValue(address.geometry.location.lng())
  }


}
