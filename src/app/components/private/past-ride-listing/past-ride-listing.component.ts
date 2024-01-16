import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-past-ride-listing',
  templateUrl: './past-ride-listing.component.html',
  styleUrls: ['./past-ride-listing.component.css']
})
export class PastRideListingComponent implements OnInit {
  @Input() dataLoaded : any
  @Input() pastRidesListing : any
  
  public selected : string = 'daily'
  public pastRides : any

  constructor() { }

  ngOnInit() {
    this.pastRides = this.pastRidesListing.filter(ride => ride.payment_type==='daily')
  }

  showListing(event, listing) {
    this.selected = listing
    this.pastRides = this.pastRidesListing.filter(ride => ride.payment_type===listing)
  }

}
