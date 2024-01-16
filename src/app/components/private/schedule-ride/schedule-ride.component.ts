declare var require: any
declare var google: any;
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { RideService } from '../schedule-ride/ride.service'
import { NgxSpinnerService } from 'ngx-spinner'
import {} from 'googlemaps';
import { AgmMap } from '@agm/core';
let sourceIcon = require('../../../../assets/icons/source.png');
let originIcon = require('../../../../assets/icons/circlemarker.png');
let destinationIcon = require('../../../../assets/icons/destination.png');
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-schedule-ride',
  templateUrl: './schedule-ride.component.html',
  styleUrls: ['./schedule-ride.component.css']
})

export class ScheduleRideComponent implements OnInit {
  @Input() user : any

  @ViewChild(AgmMap, { static: true }) map: any
  currentPositionMarker
  sourceLat: any;
  sourceLng: any;
  destinationLat: any;
  destinationLng: any;
  zoom: number = 12;
  iconUrlAtStart =  {
    url: sourceIcon,
    scaledSize: {
      width: 60,
      height: 60
    }
  }
  geoCoder : any
  path : any
  dir = undefined;
  travelMode = 'DRIVING'
  drivingOptions: {
    trafficModel: 'pessimistic'
  }
  renderOptions = {
    suppressMarkers: true,
    preserveViewport: true,
  }
  markerOptions = {
    origin: {
        infoWindow: 'You',
        icon: originIcon,
        draggable: false,
        width: 50,
        height: 50
    },
    destination: {
        icon: destinationIcon,
        infoWindow: 'Destination',
        opacity: 0.8,
        width: 50,
        height: 50
    },
  }
  options = {
    componentRestrictions: { country: 'USA' }
  }

  public patient
  public vehical : string = 'sedan'
  public totalTime : any = {
    duration_string : '',
    duration_value : 0
  }
  public totalDistance : number
  public data : any
  public isSearching : boolean = false
  public isSearched : boolean = false
  public mapLoaded : Promise<boolean>
  public cost : any
  public cars : any

  constructor(
    private _router : Router,
    private _rideService : RideService,
    private _spinner : NgxSpinnerService,
    private _fb : FormBuilder
  ) {}

  onMapReady(map){
    this.map = map;
  }

  ngOnInit() { 
    if(localStorage.getItem('pt')) {
      this.patient = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('pt'), 'mydocridela123').toString(CryptoJS.enc.Utf8)) 
      this.geoCoder = new google.maps.Geocoder;
      // if (this.patient.vehical_name !== '') {
        this.vehical = this.patient.vehical_name.toLowerCase()
        this.locationForm.patchValue({
          pickup_location : (this.patient.pickup_name) ? this.patient.pickup_name : this.patient.destination_pickup_name,
          pickup_latitutde : this.patient.pickup_lat,
          pickup_longitude : this.patient.pickup_lng,
          drop_location : this.patient.destination_name,
          drop_latitutde : this.patient.destination_lat,
          drop_longitude : this.patient.destination_lng
        })
        
        this.sourceLat = parseFloat(this.patient.pickup_lat)
        this.sourceLng = parseFloat(this.patient.pickup_lng)
        this.destinationLat = parseFloat(this.patient.destination_lat)
        this.destinationLng = parseFloat(this.patient.destination_lng)
      // }
      // else {

      // }
      this.mapLoaded = Promise.resolve(true)
        
      // else {
      //   this.getAddress(this.locationForm.get('pickup_latitutde').value, this.locationForm.get('pickup_longitude').value)
      //   this.setCurrentLocation(); 
      // }
    }
    else {
      this._router.navigate(['/dashboard/staff-list'])
    }
  }

  locationForm = this._fb.group({
    pickup_location : [''],
    pickup_latitutde : [''],
    pickup_longitude : [''],
    drop_location : [''],
    drop_latitutde : [''],
    drop_longitude : ['']
  })

  getDirection(x1, y1, x2, y2) {
    this.dir = {
      origin: { lat: x1, lng: y1 },
      destination: { lat: x2, lng: y2 }
    }
  }

  changeOrigin(event: MouseEvent) {
    let LatLng=JSON.parse(JSON.stringify(event));
    this.locationForm.controls['pickup_latitutde'].setValue(LatLng.lat) 
    this.locationForm.controls['pickup_longitude'].setValue(LatLng.lng)
    this.sourceLat = LatLng.lat
    this.sourceLng = LatLng.lng
    this.getAddress(this.locationForm.get('pickup_latitutde').value, this.locationForm.get('pickup_longitude').value)
  }

  getSource(address: any) {
    this.locationForm.controls['pickup_location'].setValue(address.formatted_address)
    this.locationForm.controls['pickup_latitutde'].setValue(address.geometry.location.lat()) 
    this.locationForm.controls['pickup_longitude'].setValue(address.geometry.location.lng())
    this.sourceLat = address.geometry.location.lat()
    this.sourceLng = address.geometry.location.lng()
  }

  getDestination(address: any) {
    this.locationForm.controls['drop_location'].setValue(address.formatted_address)
    this.locationForm.controls['drop_latitutde'].setValue(address.geometry.location.lat()) 
    this.locationForm.controls['drop_longitude'].setValue(address.geometry.location.lng())
    this.destinationLat = address.geometry.location.lat()
    this.destinationLng = address.geometry.location.lng()
  }
  

  // Get Current Location Coordinates
  // private setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.sourceLat = position.coords.latitude;
  //       this.sourceLng = position.coords.longitude;
  //       this.getAddress(this.sourceLat, this.sourceLng);
  //       this.zoom = 19
  //     });
  //   }
  // }

  search() {
    this.zoom = 12
    let data = { origin : { lat : this.sourceLat, lng : this.sourceLng }, destination : { lat : this.destinationLat, lng : this.destinationLng } }
    this.getDistanceAndTime(data)
    this.getDirection(
      this.sourceLat, this.sourceLng,
      this.destinationLat, this.destinationLng
    )
    this.getCars(data)
  }
  
  getDistanceAndTime(data) {
    this._rideService.distanceAndTime(data, localStorage.getItem('mdrt'))
    .subscribe(
      response => {
        this.totalDistance = response['distance']
        this.totalTime.duration_string = response['duration_string']
        this.totalTime.duration_value = response['duration_value']
        this.cost = response['cost']
        this.isSearched = true
      },
      error => {
        Swal.fire('Notification', 'No route found!', 'error')
        this._spinner.hide()
      }
    )
  }

  getCars(data){
    let dir = {
      pickup_latitude : data.origin.lat,
      pickup_longitude : data.origin.lng,
      drop_latitude : data.destination.lat,
      drop_longitude : data.destination.lng
    }
    this._rideService.getCars(dir, localStorage.getItem('mdrt'))
    .subscribe(
      response => {
        this.cars = response['nearest_car']
        this.selectVehical('', this.vehical)
      })
  }

  bookNow() {
    this._spinner.show()
    const data = { 
      hospital_name : this.user.hospital_name,
      user_id : this.user.id, //master account id
      patient_id : this.patient.id,
      doctor_id : this.patient.doctor_id,
      pickup_location: this.locationForm.get('pickup_location').value,
      pickup_latitude: this.sourceLat, 
      pickup_longitude: this.sourceLng,
      drop_location : this.locationForm.get('drop_location').value,
      drop_latitude: this.destinationLat, 
      drop_longitude: this.destinationLng,
      car_id : this.patient.vehical_id,
      schedule_date : this.patient.appointment_date,
      token : Math.floor(Math.random() * 100000000000000000000),
      amount : this.cost
    }
    this._rideService.getNearestCompanies(data, localStorage.getItem('mdrt'))
    .subscribe(
      response => {
        let counter = 1
        let interval = setInterval(() => {
          if (counter > 6) {
            clearInterval(interval)
            Swal.fire('Notification', 'Unable to find nearest companies', 'info')
            this._spinner.hide()
          }
          else {
            this._rideService.checkRequestStatus({token : data.token}, localStorage.getItem('mdrt'))
            .subscribe(
              response => {
                if(response['status'] == 1){
                  this._spinner.hide()
                  clearInterval(interval)
                  Swal.fire('Notification', response['message'], 'success')
                  this._router.navigate(['/dashboard/driver-arrived'])
                }
              },
              error => {
                if (error.status !== 404) {
                  this._spinner.hide()
                  clearInterval(interval)
                  Swal.fire('Notification', 'Something went wrong', 'error')
                }
              }
            )
            counter++
          }
        }, 5000)
      },
      error => {
        Swal.fire('Notification', error.error['message'], 'info')
        this._spinner.hide()
      }
    )
  }

  markerDragEnd(event: MouseEvent) {
    this.sourceLat = event['coords'].lat;
    this.sourceLng = event['coords'].lng;
    this.locationForm.controls['pickup_latitutde'].setValue(event['coords'].lat) 
    this.locationForm.controls['pickup_longitude'].setValue(event['coords'].lng)
    this.getAddress(this.sourceLat, this.sourceLng);
    if (this.isSearched) {
      this.getDirection(
        this.sourceLat, this.sourceLng,
        this.destinationLat, this.destinationLng
      )
      let data = { origin : { lat : this.sourceLat, lng : this.sourceLng }, destination : { lat : this.destinationLat, lng : this.destinationLng } }
      this.getDistanceAndTime(data)
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.locationForm.controls['pickup_location'].setValue(results[0].formatted_address)
        } 
        else {
          window.alert('No results found');
        }
      } 
      else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  selectVehical(event, type) {
    this.vehical = type
    this.cost = this.cars.filter(function(element) {
      return element.car_name.toLowerCase() == type.toLowerCase();
    })[0]['schedule_fare'];
  }

}
