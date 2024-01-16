import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { PaypalService } from './paypal.service'

declare var paypal;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {
  @ViewChild('paypal', { static : true }) paypalElement : ElementRef 

  ridePrice = 50
  id = ''

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _spinner : NgxSpinnerService,
    private _paypalService : PaypalService
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('mdrt')) {
      this._router.navigate(['login']);
    }
    paypal
    .Buttons({
      createOrder : (data, actions) => {
        return actions.order.create({
          application_context: {
            shipping_preference: 'NO_SHIPPING'
          },
          purchase_units : [
            {
              amount : {
                currency_code : 'USD',
                value : this.ridePrice,
              }
            }
          ],
        });
      },
      
      onApprove: async (data, actions) => {      
        actions.order.get().then(details => {
          const orderId = details['id']
          this._paypalService.getPayPalToken(localStorage.getItem('mdrt'))
          .subscribe(
            response => {
              const accessToken = response['access_token']
              this._paypalService.paypalCapture({orderId , accessToken})
              .subscribe(
                response => {
                  const refundUrl = response['purchase_units'][0].payments.captures[0].links[1].href
                  this._paypalService.refundPayment({refundUrl, accessToken})
                  .subscribe(
                    response => {
                      console.log(response)
                    }
                  )
                }
              )
            }
          )
        })
      },

      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },

    }).render(this.paypalElement.nativeElement);
  }

}
