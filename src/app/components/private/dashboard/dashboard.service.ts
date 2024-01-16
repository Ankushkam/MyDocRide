import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { staffList, memberList, logout, saveTokenUrl,
        editUserUrl, updateUserUrl, updatePasswordUrl, 
        updateHospitalUrl ,getPendingAppointmentUrl} from '../../../shared/url-helpers'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  setHeaders(token) {
    return {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      })
    }
  }

  constructor(
    private _httpClient : HttpClient
  ) { }

  staffList(token) {
    return this._httpClient.get(staffList, this.setHeaders(token))
  }

  membersList(token) {
    return this._httpClient.get(memberList, this.setHeaders(token))
  }

  logout(token) {
    return this._httpClient.get(logout, this.setHeaders(token))
  }

  editUser(token, id) {
    return this._httpClient.get(`${editUserUrl}/${id}`, this.setHeaders(token))
  }

  updateUser(data, id, token) {
    return this._httpClient.post(`${updateUserUrl}/${id}`, data, this.setHeaders(token))
  }

  updatePassword(token, data) {
    return this._httpClient.post(updatePasswordUrl, data, this.setHeaders(token))
  }

  updateHospital(token, data, id) {
    return this._httpClient.post(`${updateHospitalUrl}/${id}`, data, this.setHeaders(token))
  }

  saveToken(data, token) {
    return this._httpClient.post(saveTokenUrl, data, this.setHeaders(token))
  }
  etPenidnAppointments(id, token) {
    return this._httpClient.get(`${getPendingAppointmentUrl}/${id}`, this.setHeaders(token))
  }
}
