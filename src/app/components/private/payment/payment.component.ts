import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @Input() payments : any
  @Input() dataLoaded : any

  constructor() { }

  ngOnInit() {
  }

}
