import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AgmMap } from '@agm/core';
import { RideService } from '../schedule-ride/ride.service';

@Component({
  selector: 'app-pastrides',
  templateUrl: './pastrides.component.html',
  styleUrls: ['./pastrides.component.css']
})
export class PastridesComponent implements OnInit {
  @Input() user : any
  @Input() pastRides : any
  @Input() dataLoaded : any

  @ViewChild(AgmMap, { static: true }) map: any
  currentPositionMarker
  zoom: number = 6;
  geoCoder : any
  path : any
  dir = undefined;

  constructor(
    private _rideService : RideService 
  ) { }

  onMapReady(map){
    this.map = map;
  }

  ngOnInit() {
  }

}
