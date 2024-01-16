import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service'
import { ActivatedRoute, ParamMap, Router } from '@angular/router' 
import { NgxSpinnerService } from "ngx-spinner";
import { emailRegex } from '../../../shared/regex-helpers'
import { FlashMessagesService } from 'angular2-flash-messages'; 
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment'
 
declare let $ : any

@Component({
  selector: 'app-login-forgotpassword',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  type = true
  token
  serverUrl : string = environment.production ? 'https://mydocridewebapp.com' : 'http://localhost:8000'

  constructor(
    private _fb : FormBuilder, 
    private _loginService : LoginService,
    private _route : ActivatedRoute,
    private _router : Router,
    private _spinner : NgxSpinnerService,
    private _flashMessagesService: FlashMessagesService,
  ) {  }

  showModal(event, type) {
    $('#login_forgotpasswordModal').modal('show')
    this.type = type
  }

  //Forgot Password Section
  forgotPasswordForm = this._fb.group({
    email : ['', [Validators.required, Validators.email]]
  });

  forgotPassword() {
    this._spinner.show()
    this._loginService.userExist(this.forgotPasswordForm.value).subscribe(
      response => {
        let status = JSON.parse(JSON.stringify(response)).status
        localStorage.setItem('fa', CryptoJS.AES.encrypt(this.forgotPasswordForm.get('email').value, 'mydocridela123'))
        if (status===200) {
          this._flashMessagesService.show(response['message'], { cssClass: 'alert-success', timeout: 5000 });
        } 
        else {
          this._flashMessagesService.show(response['message'], { cssClass: 'alert-danger', timeout: 5000 });  
        }
        this._spinner.hide()
      },
      error => {
        console.log(error)
        this._spinner.hide()
      }
    )
  }

  //Login Section
  loginForm = this._fb.group({
    email : ['', [Validators.required, Validators.email]],
    password : ['', [Validators.required]],
    fcm_token : ['']
  });

  login() {
    this._spinner.show()
    this._loginService.login(this.loginForm.value).subscribe(
      response => {
        //this.loginForm.reset()
        this._spinner.hide()
        $('#login_forgotpasswordModal').modal('hide')
        if(response['role_id']==='Driver' || response['role_id']==='driver') {
          window.location.href = `${this.serverUrl}/signin_driver`
        }
        else if(response['role_id']==='Rider' || response['role_id']==='rider') {
          window.location.href = `${this.serverUrl}/signin_rider`
        }
        else {
          localStorage.setItem('mdrt', response['token'])
          $('#login_forgotpasswordModal').modal('hide')
          this._spinner.hide()
          this._router.navigate(['/dashboard/staff-list'])
        }
      },
      error => {
        if (error.status===0) {
          this._flashMessagesService.show('Server is not responding', { cssClass: 'alert-danger', timeout: 5000 });
        }
        else if (error.status===422) {
          this._spinner.hide()
          Object.keys(error.error).forEach(key => {
            const formControl = this.loginForm.get(key)
            if (formControl) {
              formControl.setErrors({
                serverError : error.error[key][0]
              })
            }
          })
        }
        else {
          this._flashMessagesService.show(error.error.reason, { cssClass: 'alert-danger', timeout: 5000 });
        }
        this._spinner.hide()
      }
    )
  }

  ngOnInit() { 
  }

}
