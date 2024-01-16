import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { getUser } from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _http: HttpClient) { }

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  user(token) {
    return this._http.get(`${getUser}`, this.setHeaders(token))
  }
}
