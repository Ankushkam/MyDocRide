import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { verifyUserStatus } from './url-helpers'

@Injectable({
  providedIn: 'root'
})
export class VerifyUserStatusService {

  constructor(private _httpClient : HttpClient) { }

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  verifyUserStatus(token) {
    return this._httpClient.get(verifyUserStatus, this.setHeaders(token))
  }

}
