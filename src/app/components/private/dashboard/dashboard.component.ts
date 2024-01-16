import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router'
import { DashboardService } from './dashboard.service'
import { ProfileService } from '../profile/profile.service'
import { RideService } from '../schedule-ride/ride.service'
import { PaymentService } from '../payment/payment.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { VerifyUserStatusService } from '../../../shared/verify-user-status.service'
import * as CryptoJS from 'crypto-js';
import { NewRequestService } from '../new-request/new-request.service'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public title : string
  public redirectRoute : string
  public condition : boolean = false
  public route : string
  public btnName : string
  public user : any
  public membersList : any
  public staffList : any
  public AppointmentList : any
  public patient : any
  public showPayNow : any
  public pastRides : any
  public activeRides : any
  public driver : any
  public routeName : string
  public view : string = 'commons'
  public payments : any
  public pastRidesListing : any
  public image : string = ''
  public dataLoaded: Promise<boolean>;
  public bookings : any

  constructor(
    private _dashboardService : DashboardService,
    private _profileService : ProfileService,
    private _verifyuserstatusService : VerifyUserStatusService,
    private _route : ActivatedRoute,
    private _router : Router,
    private _spinner : NgxSpinnerService,
    private _rideService : RideService,
    private _paymentService : PaymentService,
    private _newRequestService : NewRequestService,
  ) { 
    
  }

  ngOnInit() {
    if (localStorage.getItem('mdrt')) {
      this._verifyuserstatusService.verifyUserStatus(localStorage.getItem('mdrt'))
      .subscribe(
        response => {
          this._spinner.show()
          this._profileService.user(localStorage.getItem('mdrt'))
          .subscribe(
            response => {
              this.user = JSON.parse(JSON.stringify(response)).user
              this._route.paramMap.subscribe((paramMap: ParamMap) => {
                this.condition = false
                this.route = paramMap.get('route')
                if (this.image.trim() !== '') {
                  this.user.image = this.image
                }  
                switch (this.route) {
                  case 'staff-list':
                    this.view = 'commons'
                    this._dashboardService.staffList(localStorage.getItem('mdrt'))
                    .subscribe(
                      response => {
                        this.title = 'Staff List'
                        this.redirectRoute = "/dashboard/add-staff"
                        this.btnName = 'Add Staff'
                        if((this.user.user_type==='HCP' || this.user.user_type==='CG') && (this.route==='staff-list')) {
                          this.condition = true
                        }
                        this.staffList = JSON.parse(JSON.stringify(response)).staff_list.filter(user => user.id !== this.user.id && (user.role_id !== 2 && user.role_id !== 4))
                        this._spinner.hide()
                        this.dataLoaded = Promise.resolve(true);
                        this.routeName = 'staff-list'
                      },
                      error => {
                        localStorage.removeItem('mdrt')
                        this._router.navigate(['/']);
                      }
                    )
                    break;
                    case 'pending-appointment':
                    this.view = 'pending'
                    this._dashboardService.etPenidnAppointments(this.user.id,localStorage.getItem('mdrt'))
                    .subscribe(
                      response => {
                        this.title = 'Pending Appointment'
                        this.redirectRoute = "/dashboard/add-staff"
                        this.btnName = 'Add Staff'
                        if((this.user.user_type==='HCP' || this.user.user_type==='CG') && (this.route==='staff-list')) {
                          this.condition = true
                        }
                        this.AppointmentList=response['data']
                        // this.staffList = JSON.parse(JSON.stringify(response)).staff_list.filter(user => user.id !== this.user.id && (user.role_id !== 2 && user.role_id !== 4))
                        this._spinner.hide()
                        this.dataLoaded = Promise.resolve(true);
                        this.routeName = 'pending-appointment'
                      },
                      error => {
                        localStorage.removeItem('mdrt')
                        this._router.navigate(['/']);
                      }
                    )
                    break;
    
                  case 'add-staff':
                    this.view = 'commons'
                    this.title = 'Add New Staff'
                    this._spinner.hide()
                    this.dataLoaded = Promise.resolve(true);
                    this.routeName = 'add-staff'
                    break;

                  case 'schedule-ride':
                    this.view = 'commons'
                    this.title = 'Schedule a ride for patient'
                    this._spinner.hide()
                    this.dataLoaded = Promise.resolve(true);
                    this.routeName = 'schedule-ride'
                    break;

                  case 'driver-arrived':
                    this.view = 'commons'
                    if (this.route==='driver-arrived') {
                      this.condition = true
                    }
                    if(!localStorage.getItem('pt')) {
                      this._router.navigate(['/dashboard/staff-list']);
                    }
                    this.btnName = 'View all past ride'
                    this.redirectRoute = '/dashboard/past-rides-listing'
                    this.title = 'Driver has arrived on destination'
                    const rid = localStorage.getItem('pt')
                    let pt = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('pt'), 'mydocridela123').toString(CryptoJS.enc.Utf8)) 
                    this._rideService.getPatientRideInfo(pt.id, localStorage.getItem('mdrt'))
                    .subscribe(
                      response => {
                        let rideData = response['data'].patient
                        this.patient = response['data'].patient.patient_details
                        this.patient.fare_estimation = rideData.fare_estimation
                        this.driver = response['data'].patient.driver_details
                        if(!this.driver)
                          this.title = 'Driver will assign shortly'
                        if(rideData.status == 'Completed')
                          this.showPayNow = true;
                        this.patient.origin = { lat: parseFloat(rideData.pickup_latitude), lng: parseFloat(rideData.pickup_longitude) } 
                        this.patient.destination = { lat: parseFloat(rideData.drop_latitude), lng: parseFloat(rideData.drop_longitude) } 
                        // this.patient.estimated_time = JSON.parse(this.patient.estimated_time)
                        this.patient.name = pt.name
                        this.patient.image = pt.image
                        this.patient.pickup_location = rideData.pickup_location
                        this.patient.drop_location = rideData.drop_location
                        this._spinner.hide()
                        this.dataLoaded = Promise.resolve(true);
                        this.routeName = 'driver-arrived'
                      },
                      error => {
                        this._spinner.hide()
                      }
                    )
                    break;
  
                  case 'patients-list':
                    this.view = 'patientlist'
                    this.title = 'Patients List'
                    this.redirectRoute = "/dashboard/add-patient"
                    this.btnName = 'Add Patient'
                    if(this.route==='patients-list') {
                      this.condition = true
                    }
                    this._dashboardService.membersList(localStorage.getItem('mdrt'))
                    .subscribe(
                      response => {
                        if (response['data'] && response['data'][0] && response['data'][0].members) {
                          this.membersList = response['data'][0].members 
                        } 
                        else {
                          this.membersList = response['data']  
                        }
                        this.dataLoaded = Promise.resolve(true);
                        this.routeName = 'patients-list'
                        this._spinner.hide()
                      },
                      error => {

                      }
                    )
                    break;

                  case 'add-patient':
                    this.view = 'commons'
                    this.title = 'Add New Patient'
                    this._spinner.hide()
                    this.routeName = 'add-patient'
                    break;
    
                  case 'active-rides':
                    this.view = 'commons'
                    this.title = 'Active Rides'
                    this._rideService.activeRides(localStorage.getItem('mdrt'))
                    .subscribe(
                      response => {
                        this.activeRides = response['data']
                        if (this.activeRides.length > 0) {
                            this.activeRides.forEach((element2, key2) => {
                              element2.pick_up_point = {lat: element2.pickup_latitude, lng: element2.pickup_longitude, name: element2.pickup_location}
                              element2.destination_point = {lat: element2.drop_latitude, lng: element2.drop_longitude, name: element2.drop_location}
                              element2.sourceLat = parseFloat(element2.pickup_latitude)
                              element2.sourceLng = parseFloat(element2.pickup_longitude)
                              element2.destinationLat =  parseFloat(element2.drop_latitude)
                              element2.destinationLng = parseFloat(element2.drop_longitude)
                              element2.coordinates = { origin: { lat: parseFloat(element2.pickup_latitude), lng: parseFloat(element2.pickup_longitude) }, 
                                                      destination : { lat: parseFloat(element2.drop_latitude), lng: parseFloat(element2.drop_longitude) } }
                            });
                        }
                        this._spinner.hide()
                        this.dataLoaded = Promise.resolve(true);
                        this.routeName = 'active-rides'
                      },
                      error => {

                      }
                    )
                    break;
                  
                  case 'past-rides':
                    this.view = 'commons'
                    this.title = 'Past Rides'
                    this.redirectRoute = "/dashboard/past-rides-listing"
                    this.btnName = 'View all past rides'
                    this.condition = true
                    this._rideService.pastRides(localStorage.getItem('mdrt'))
                    .subscribe(
                      response => {
                        this.pastRides = response['data']
                        console.log(this.pastRides)
                        if (this.pastRides.length > 0) {
                          // this.pastRides.forEach((element1, key1) => {
                            this.pastRides.forEach((element2, key2) => {
                              element2.pick_up_point = {lat: element2.pickup_latitude, lng: element2.pickup_longitude, name: element2.pickup_location}
                              element2.destination_point = {lat: element2.drop_latitude, lng: element2.drop_longitude, name: element2.drop_location}
                              element2.sourceLat = parseFloat(element2.pickup_latitude)
                              element2.sourceLng = parseFloat(element2.pickup_longitude)
                              element2.destinationLat =  parseFloat(element2.drop_latitude)
                              element2.destinationLng = parseFloat(element2.drop_longitude)
                              element2.coordinates = { origin: { lat: parseFloat(element2.pickup_latitude), lng: parseFloat(element2.pickup_longitude) }, 
                                                      destination : { lat: parseFloat(element2.drop_latitude), lng: parseFloat(element2.drop_longitude) } }
                            });
                          // });
                        }
                        this.dataLoaded = Promise.resolve(true);
                        this._spinner.hide()
                        this.routeName = 'past-rides'
                      },
                      error => {

                      }
                    )
                    break;
                  
                  case 'past-rides-listing':
                    this.view = 'payment'
                    this._rideService.allPastRides(localStorage.getItem('mdrt'))
                    .subscribe(
                      response => {
                        this.pastRidesListing = response['data']
                        this.dataLoaded = Promise.resolve(true);
                        this._spinner.hide()
                        this.routeName = 'past-rides-listing'
                      },
                      error => {

                      }
                    )
                    break;
                  
                  case 'payments':
                    this.view = 'payment'
                    this._paymentService.payments(localStorage.getItem('mdrt'))
                    .subscribe(
                      response => {
                        this.payments = response['data']
                        this.dataLoaded = Promise.resolve(true);
                        this._spinner.hide()
                        this.routeName = 'payments'
                      },
                      error => {

                      }
                    )
                    break;

                  case 'add-payment':
                    this.view = 'payment'
                    if (this.route==='add-payment') {
                      this.condition = false
                    } 
                    else {
                      this.condition = true
                    }
                    this.title = 'Payment Method'
                    this._spinner.hide()
                    this.dataLoaded = Promise.resolve(true);
                    this.routeName = 'add-payment'
                    break;
                  
                  case 'payment-cards':
                    this.view = 'payment'
                    if (this.route==='payment-cards') {
                      this.condition = false
                    } 
                    else {
                      this.condition = true
                    }
                    this.title = 'Add New Card'
                    this._spinner.hide()
                    this.dataLoaded = Promise.resolve(true);
                    this.routeName = 'payment-cards'
                    break;
                  
                  case 'checkout':
                    this.view = 'payment'
                    if (this.route==='checkout') {
                      this.condition = false
                    } 
                    else {
                      this.condition = true
                    }
                    this.title = 'Select Payment Method'
                    this._spinner.hide()
                    this.dataLoaded = Promise.resolve(true);
                    this.routeName = 'checkout'
                    break;
                  
                  case 'notifications':
                    this.view = 'payment'
                    if (this.route==='notifications') {
                      this.condition = false
                    } 
                    else {
                      this.condition = true
                    }
                    this.title = 'New Requests'
                    // this._newRequestService.newAppointments(localStorage.getItem('mdrt'), this.user.id)
                    // .subscribe(
                    //   response => {
                    //     this.bookings = response['data']
                    //     this._spinner.hide()
                    //     this.dataLoaded = Promise.resolve(true);
                    //     this.routeName = 'notifications'
                    //   }
                    // )
                    if(this.user.user_type==='HCP'|| this.user.user_type==='CG'){
                      this._dashboardService.staffList(localStorage.getItem('mdrt'))
                      .subscribe(
                        response => {
                          this.bookings = JSON.parse(JSON.stringify(response)).staff_list.filter(user => user.id !== this.user.id && (user.role_id !== 2 && user.role_id !== 4))
                      })
                    }
                    this._spinner.hide()
                    this.dataLoaded = Promise.resolve(true);
                    this.routeName = 'notifications'
                    break;

                  case 'edit-profile':
                      this.view = 'commons'
                      if (this.route==='edit-profile') {
                        this.condition = false
                      } 
                      else {
                        this.condition = true
                      }
                      this.title = 'Edit Profile'
                      this._spinner.hide()
                      this.routeName = 'edit-profile'
                      this.dataLoaded = Promise.resolve(true);
                      break;

                  case 'settings':
                      this.view = 'commons'
                      if (this.route==='settings') {
                        this.condition = false
                      } 
                      else {
                        this.condition = true
                      }
                      this.title = 'Account Setting'
                      this._spinner.hide()
                      this.routeName = 'settings'
                      this.dataLoaded = Promise.resolve(true);
                      break;
                  
                  case 'help-center':
                    this.view = 'commons'
                    this.title = 'Help Center'
                    this._spinner.hide()
                    this.routeName = 'help-center'
                    this.dataLoaded = Promise.resolve(true);
                    break;

                  default:
                    break;
                }
              })
            },
            error => {
              localStorage.removeItem('mdrt')
              this._router.navigate(['/']);
            }
          )
        },
        error => {
          localStorage.removeItem('mdrt')
          this._router.navigate(['/']);
        }
      )
    }
    else {
      this._router.navigate(['/']);
    }    
  }

  logout() {
    this._spinner.show()
    this._dashboardService.logout(localStorage.getItem('mdrt')).subscribe(
      response => {
        localStorage.removeItem('mdrt');
        this._router.navigate(['/'])
        this._spinner.hide()
      },
      error => {
        console.log(error)
        this._spinner.hide()
      }
    )
  }


}
