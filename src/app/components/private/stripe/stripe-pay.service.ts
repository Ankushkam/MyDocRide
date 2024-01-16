import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { stripePayUrl, payNowUrl, saveCardUrl, getCardsUrl, payToDriverUrl } from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class StripePayService {

  constructor(private _http: HttpClient) { }

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  stripePay(data, token) {
    return this._http.post(stripePayUrl, data, this.setHeaders(token))
  }

  payNow(data, token) {
    return this._http.post(`${payNowUrl}`, data, this.setHeaders(token))
  }

  saveCard(data, token) {
    return this._http.post(saveCardUrl, data, this.setHeaders(token))
  }

  getCards(id, token) {
    return this._http.get(`${getCardsUrl}/${id}`, this.setHeaders(token))
  }
  
  payToDriver(data, token) {
    return this._http.post(`${payToDriverUrl}`, data, this.setHeaders(token))
  }

}
