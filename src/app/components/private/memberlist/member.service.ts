import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { addMember, getDoctors } from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  constructor(private _http: HttpClient) { }

  addNewMember(data, token) {
    return this._http.post(`${addMember}`, data, this.setHeaders(token))
  }

  getDoctors(token) {
    return this._http.get(`${getDoctors}`, this.setHeaders(token))
  }

}
