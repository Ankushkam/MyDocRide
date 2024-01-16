import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { addStaff, imageUpload} from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class StaffserviceService {

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  constructor(private _http: HttpClient) { }

  addStaff(data, id, token) {
    return this._http.post(`${addStaff}/${id}`, data, this.setHeaders(token))
  }

  imageUpload(data, token) {
    return this._http.post(`${imageUpload}`, data, this.setHeaders(token))
  }
}
