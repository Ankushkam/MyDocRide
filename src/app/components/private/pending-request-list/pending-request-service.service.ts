import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getPendingAppointmentUrl,setAppointmentStatusUrl } from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class PendingRequestServiceService {

  constructor(private _http : HttpClient) { }
  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  
  getPenidnAppointments(id, token) {
    return this._http.get(`${getPendingAppointmentUrl}/${id}`, this.setHeaders(token))
  }

  setPendingAppointmentStatus(data,token){
    return this._http.post(`${setAppointmentStatusUrl}`, data, this.setHeaders(token))
  }

}
