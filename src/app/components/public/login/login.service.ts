import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {doLogin, verifyEmail, passwordResetEMail } from '../../../shared/url-helpers'

const httpOptions = {
  headers : new HttpHeaders({
    'Content-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http : HttpClient) { }

  login(data) {
    return this._http.post(doLogin, data, httpOptions)
  }

  verifyAccount(token) {
    return this._http.get(`${verifyEmail}/${token}`)
  }

  userExist(email) {
    return this._http.post(passwordResetEMail, email, httpOptions)
  }
  
}
