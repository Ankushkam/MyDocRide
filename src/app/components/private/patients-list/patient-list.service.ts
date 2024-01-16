import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { getPatientsUrl } from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class PatientListService {

  constructor(private _http : HttpClient) { }

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  getPatients(id, token) {
    return this._http.get(`${getPatientsUrl}/${id}`, this.setHeaders(token))
  }

}
