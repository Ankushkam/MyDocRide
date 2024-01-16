import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { getInTouchUrl,pagePopupEmailUrl } from '../../../shared/url-helpers'

const httpOptions = {
  headers : new HttpHeaders({
    'Content-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _http: HttpClient) { }

  getInTouch(data) {
    return this._http.post(getInTouchUrl, data, httpOptions)
  }

  pagePopupEmail(data) {
    return this._http.post(pagePopupEmailUrl, data, httpOptions)
  }

}
