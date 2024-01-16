import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { PaypalService } from '../paypal/paypal.service'

declare var paypal;
@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent implements OnInit {
  // @ViewChild('paypal', { static : true }) paypalElement : ElementRef

  constructor(
    private _spinner : NgxSpinnerService,
    private _paypalService : PaypalService
  ) { }

  ridePrice = 50
  id = ''

  ngOnInit() {
    // paypal
    // .Buttons({
    //   createOrder : (data, actions) => {
    //     return actions.order.create({
    //       application_context: {
    //         shipping_preference: 'NO_SHIPPING'
    //       },
    //       purchase_units : [
    //         {
    //           amount : {
    //             currency_code : 'USD',
    //             value : this.ridePrice,
    //           }
    //         }
    //       ],
    //     });
    //   },
      
    //   onApprove: async (data, actions) => {      
    //     actions.order.get().then(details => {
    //       const orderId = details['id']
    //       this._paypalService.getPayPalToken(localStorage.getItem('mdrt'))
    //       .subscribe(
    //         response => {
    //           const accessToken = response['access_token']
    //           this._paypalService.paypalCapture({orderId , accessToken})
    //           .subscribe(
    //             response => {
    //               const refundUrl = response['purchase_units'][0].payments.captures[0].links[1].href
    //               this._paypalService.refundPayment({refundUrl, accessToken})
    //               .subscribe(
    //                 response => {
    //                   console.log(response)
    //                 }
    //               )
    //             }
    //           )
    //         }
    //       )
    //     })
    //   },

    //   onError: err => {
    //     console.log('OnError', err);
    //   },
    //   onClick: (data, actions) => {
    //     console.log('onClick', data, actions);
    //   },

    // }).render(this.paypalElement.nativeElement);
  }

}
