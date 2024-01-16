declare var require: any
declare var $ : any
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RideService } from '../schedule-ride/ride.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { FlashMessagesService } from 'angular2-flash-messages';
import {} from 'googlemaps';
let originIcon = require('../../../../assets/icons/circlemarker.png');
let destinationIcon = require('../../../../assets/icons/destination.png');

@Component({
  selector: 'app-driver-arrived',
  templateUrl: './driver-arrived.component.html',
  styleUrls: ['./driver-arrived.component.css']
})
export class DriverArrivedComponent implements OnInit {
  @Output() statusChanged = new EventEmitter()
  @Input() driver : any
  @Input() patient : any
  @Input() dataLoaded : any
  route : any

  public origin = {
    lat : 0,
    lng : 0
  }

  public destination = {
    lat : 0,
    lng : 0
  }

  travelMode = 'WALKING'
  drivingOptions: {
    // departureTime: new Date(20),
    trafficModel: 'pessimistic'
  }
  renderOptions = {
    suppressMarkers: true,
  }
  markerOptions = {
    origin: {
        infoWindow: 'You',
        icon: originIcon,
        draggable: false, //false
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

  dir = undefined

  showPayNow = false
  waypoints = [
    { lat: 28.5669633, lng : 77.2209783 },
    // { lat: 28.5685779, lng : 77.22127379999999 },
    // { lat: 28.5687973, lng : 77.2158911 },
    // { lat: 28.5699516, lng : 77.1851248 },
    // { lat: 28.5755282, lng : 77.1777085 },
    // { lat: 28.5875695, lng : 77.1705525 },
    // { lat: 28.5870228, lng : 77.169511 },
    // { lat: 28.5876043, lng : 77.1691058 },
  ]

  
  constructor(
    private _rideService : RideService,
    private _router : Router,
    private _spinner : NgxSpinnerService,
    private _flashMessagesService: FlashMessagesService,
    private _route : ActivatedRoute
  ) { }

  ngOnInit() { 
    this._route.paramMap.subscribe((paramMap: ParamMap) => {
    this.route = paramMap.get('route')
      let interval = setInterval(() => {
        this._rideService.checkRideInfo(this.patient.id, localStorage.getItem('mdrt'))
        .subscribe(
          response => {
            this.patient.origin = {lat : parseFloat(response['data']['latitude']), lng: parseFloat(response['data']['longitude']) }
          }
        )
        if(this.route != 'driver-arrived')
          clearInterval(interval)
      },3000)
    });
  }

  ngOnChanges() {

  }

  cancelRide(event, id, canceled_by) {
    this._spinner.show()
    this._rideService.cancelPatientRide(id, canceled_by, localStorage.getItem('mdrt'))
    .subscribe(
      response => {
        this._spinner.hide()
        $('#confirmModal').modal('hide')
        this._router.navigate(['/dashboard/past-rides'])
      },
      error => {
        this._flashMessagesService.show(error['message'], { cssClass: 'alert-danger', timeout: 5000 });
        this._spinner.hide()
      }
    )
  }

  checkStatus(event, patient) {
    let counter = 0
    let interval = setInterval(() => {
    this.dir = undefined
    this.dir = {
      origin : {lat : this.waypoints[counter].lat, lng : this.waypoints[counter].lng},
      destination : {lat : this.patient.destination.lat, lng : this.patient.destination.lng},
    }
    counter++
    if(counter > this.waypoints.length-1) 
    {
      clearInterval(interval)
      const data = {
        patientTableId : patient
      }
      this._rideService.rideCompleted(data, localStorage.getItem('mdrt'))
      .subscribe(
        response => {
          if(response['message'] == 'Ride Completed'){
            this.showPayNow = true
            this.statusChanged.emit('Patient has arrived at hospital')
          }
          else{
            location.reload();
          }
        }
      )
    }
    }, 1000);
  }

  payNow(event, id, amount) {
    const patientData = JSON.stringify({id, amount})
    localStorage.setItem('ptd', window.btoa(patientData))
    this._router.navigate(['/dashboard/checkout'])
  }

}
