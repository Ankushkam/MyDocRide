import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { newAppointmentUrl } from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class NewRequestService {

  constructor(private _http: HttpClient) { }

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Content-type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  newAppointments(token, id) {
    return this._http.get(`${newAppointmentUrl}/${id}`, this.setHeaders(token))
  }

}
