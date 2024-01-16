import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { getPaypalToken, paymentCapture } from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  constructor(private _http: HttpClient) { }

  getPayPalToken(token) { //this is laravel's access token
    return this._http.get(getPaypalToken, this.setHeaders(token))
  }

  paypalCapture(data) {  // this is paypal's access token
    return this._http.post(paymentCapture+'/'+data.orderId+'/capture', '', this.setHeaders(data.accessToken))
  }

  refundPayment(data) {  //refund paypal amount
    return this._http.post(data.refundUrl, '', this.setHeaders(data.accessToken))
  }


}
