import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validator, Validators, FormGroup } from '@angular/forms'
import { nameRegex } from '../../../shared/regex-helpers'
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { StripePayService } from '../stripe/stripe-pay.service' 
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'
import { PaypalService } from '../paypal/paypal.service'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as CryptoJS from 'crypto-js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare var paypal;
declare let $ : any

@Component({
  selector: 'app-paynow',
  templateUrl: './paynow.component.html',
  styleUrls: ['./paynow.component.css']
})
export class PaynowComponent implements OnInit {
  @ViewChild('paypal', { static : true }) paypalElement : ElementRef
  @Input() dataLoaded : any
  @Input() user : any

  elements: Elements;
  card: StripeElement;
 
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
 
  payNowForm: FormGroup;

  isCardValid = true
  cardErrorMsg = ''
  public cards : any
  public selectedCard : string
  public paymentType : string = 'credit'
  public payementDate : any
  public patientData
 
  constructor(
    private _fb: FormBuilder,
    private _stripeService: StripeService,
    private _stripePayService : StripePayService,
    private _spinner : NgxSpinnerService,
    private _router : Router,
    private _paypalService : PaypalService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('ptd')) {
      let pt = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('pt'), 'mydocridela123').toString(CryptoJS.enc.Utf8))
      this.patientData = JSON.parse(window.atob(localStorage.getItem('ptd')))
      this.payNowForm = this._fb.group({
        name : ['', [Validators.required, Validators.pattern(nameRegex)]],
        userOption : [false]
      })
      this._stripePayService.getCards(pt.id, localStorage.getItem('mdrt'))
      .subscribe(
        response => {
          this.cards = response['data'].card
          this.patientData = response['data'].patient
          this._stripeService.elements(this.elementsOptions)
          .subscribe(elements => {
            this.elements = elements['card'];
            // Only mount the element the first time
            if (!this.card) {
              this.card = this.elements.create('card', {
                style: {
                  base: {
                    //border : '1px solid #ced4da',
                    iconColor: '#666EE8',
                    color: '#31325F',
                    lineHeight: '40px',
                    fontWeight: 300,
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSize: '18px',
                    '::placeholder': {
                      color: '#CFD7E0'
                    }
                  }
                }
              });
              this.card.mount('#card-element');
            }
          });
        }
      )
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
                  value : this.patientData.amount,
                }
              }
            ],
          });
        },
        style: {
          size: 'small',
          color: 'blue',
          shape: 'pill',
          label: 'checkout'
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
                    this._spinner.show()
                    const data = {
                      patientTableId : this.patientData.id,
                      amount : this.patientData.amount
                    }
                    this._stripePayService.payToDriver(data, localStorage.getItem('mdrt'))
                    .subscribe(
                      response => {
                        this._spinner.hide()
                        localStorage.removeItem('ptd')
                        localStorage.removeItem('rid')
                        localStorage.removeItem('pt')
                        this.downloadPdf(this.patientData.amount, 'paypal', response['data'], this.user)
                        this._router.navigate(['/dashboard/staff-list'])
                      },
                      error => {
                        this._spinner.hide()
                      }
                    )
                    // const refundUrl = response['purchase_units'][0].payments.captures[0].links[1].href
                    // this._paypalService.refundPayment({refundUrl, accessToken})
                    // .subscribe(
                    //   response => {
                    //     console.log(response)
                    //   }
                    // )
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
    else {
      this._router.navigate(['/dashboard/staff-list'])
    }
  }

  payNow() {
    this._spinner.show()
    this.isCardValid = true
    const name = this.payNowForm.get('name').value;
    const userOption = this.payNowForm.get('userOption').value;
    this._stripeService
    .createToken(this.card, { name })
    .subscribe(result => {
      if (result.token) {
        const data = {
          token : result.token,
          userOption,
          patientTableId : this.patientData.patient_id,
          amount : this.patientData.total_fare
        }
        this._stripePayService.stripePay(data, localStorage.getItem('mdrt'))
        .subscribe(
          response => {
            this.downloadPdf(this.patientData.total_fare, response['data'][0].source.funding, response['data'].payment_date, this.user)
            this._spinner.hide()
            localStorage.removeItem('ptd')
            localStorage.removeItem('rid')
            localStorage.removeItem('pt')
            this._router.navigate(['/dashboard/staff-list'])
          },
          error => {
            this._spinner.hide()
          }
        )
      } 
      else if (result.error) {
        // Error creating the token
        this.isCardValid = false
        this.cardErrorMsg = result.error.message
      }
    });
  }

  selectCard(event) {
    this.selectedCard = event.target.value
  }

  payWithThisCard(event, card, customer, funding) {
    this._spinner.show()
    const cardid = {
      card : card,
      customer : customer,
      patientTableId : this.patientData.id,
      amount : this.patientData.amount,
      funding : funding
    }
    this._stripePayService.payNow(cardid, localStorage.getItem('mdrt'))
    .subscribe(
      response => {
        this.downloadPdf(this.patientData.amount, response['data'].source.funding, response['data'].payment_date, this.user)
        this._spinner.hide()
        localStorage.removeItem('ptd')
        localStorage.removeItem('rid')
        localStorage.removeItem('pt')
        this._router.navigate(['/dashboard/staff-list'])
      }
    )
  }

  backToHome(){
    localStorage.removeItem('ptd')
    localStorage.removeItem('rid')
    localStorage.removeItem('pt')
    this._router.navigate(['/dashboard/staff-list'])
  }

  downloadPdf(amount, type, date, user) {
    const documentDefinition = { content: 
      [
        {
          text: user.hospital_name,
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },{
          columns: [
            [
              {
                text: `Amount Paid - $${amount}`,
                style: 'all'
              },
              {
                text: `Payment Type - ${type} card`,
                style: 'all'
              },
              {
                text: `Payment Date & Time - ${date}`,
                style: 'all'
              },
            ],
          ]
        }
      ],
      styles: {
        all: {
          fontSize: 12,
          bold: true,
          alignment : 'center'
        }
      }
    };
    pdfMake.createPdf(documentDefinition).download();
  }

}
