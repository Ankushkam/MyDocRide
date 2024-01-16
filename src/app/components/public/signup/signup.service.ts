import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { doSignup, companies, passwordReset, resendVerificationEmai } from '../../../shared/url-helpers'

const httpOptions = {
  headers : new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})

export class SignupService {

  constructor(private _http: HttpClient) { }

  companies(role) {
    return this._http.get(`${companies}/${role}`, httpOptions)
  }

  signup(data) {
    return this._http.post(doSignup, data, httpOptions)
  }

  passwordReset(data) {
    return this._http.post(passwordReset, data, httpOptions)
  }

  getUserForResendEmail(token) {
    return this._http.get(`${resendVerificationEmai}/${token}`, httpOptions)
  }

}