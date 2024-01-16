declare var require: any
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {} from 'googlemaps';
let sourceIcon = require('../../../../assets/icons/source.png');
import { AgmMap } from '@agm/core';
let originIcon = require('../../../../assets/icons/circlemarker.png');
let destinationIcon = require('../../../../assets/icons/destination.png');

@Component({
  selector: 'app-activerides',
  templateUrl: './activerides.component.html',
  styleUrls: ['./activerides.component.css']
})
export class ActiveridesComponent implements OnInit {
  @Input() activeRides : any
  @Input() user : any
  @Input() dataLoaded : any

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

  // sourceLat: number = 28.614408;
  // sourceLng: number = 77.362068;
  // zoom = 12
  // iconUrlAtStart =  {
  //   url: sourceIcon,
  //   scaledSize: {
  //     width: 60,
  //     height: 60
  //   }
  // }

  constructor() { }

  ngOnInit() {
  }
onMapReady(map){
    this.map = map;
  }
}
