import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { saveRide, getRideInfo, getDistanceAndTime,
        cancelRide, getPastRides, getNearestCompaniesUrl,
        getActiveRides, rideCompletedUrl, checkRequestStatusUrl, getAllPastRides, getCars, checkRideInfo } from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class RideService {

  constructor(private _http: HttpClient) { }

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      })
    }
  }


  savePatientRide(data, token) {
    return this._http.post(saveRide, data, this.setHeaders(token))
  }

  getPatientRideInfo(id, token) {
    return this._http.get(`${getRideInfo}/${id}`, this.setHeaders(token))
  }

  cancelPatientRide(id, canceled_by, token) {
    return this._http.get(`${cancelRide}/${id}/${canceled_by}`, this.setHeaders(token))
  }

  pastRides(token) {
    return this._http.get(`${getPastRides}`, this.setHeaders(token))
  }

  activeRides(token) {
    return this._http.get(`${getActiveRides}`, this.setHeaders(token))
  }

  distanceAndTime(data, token) {
    return this._http.post(`${getDistanceAndTime}`, data ,this.setHeaders(token))
  }

  rideCompleted(data, token) {
    return this._http.post(`${rideCompletedUrl}`, data, this.setHeaders(token))
  }

  getNearestCompanies(data, token) {
    return this._http.post(getNearestCompaniesUrl, data, this.setHeaders(token))
  }

  checkRequestStatus(data, token) {
    return this._http.post(checkRequestStatusUrl, data, this.setHeaders(token))
  }

  allPastRides(token) {
    return this._http.get(`${getAllPastRides}`, this.setHeaders(token))
  }

  getCars(data, token){
    return this._http.post(`${getCars}`,data, this.setHeaders(token))
  }

  checkRideInfo(id, token) {
    return this._http.get(`${checkRideInfo}/${id}`, this.setHeaders(token))
  }

}
