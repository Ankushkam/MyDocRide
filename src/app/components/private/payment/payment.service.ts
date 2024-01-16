import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getPaymentsInfo } from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private _http: HttpClient) { }

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Content-type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  payments(token) {
    return this._http.get(getPaymentsInfo, this.setHeaders(token))
  }

}
