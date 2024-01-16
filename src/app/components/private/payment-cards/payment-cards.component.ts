import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validator, Validators, FormGroup } from '@angular/forms'
import { nameRegex } from '../../../shared/regex-helpers'
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { StripePayService } from '../stripe/stripe-pay.service'
import { FlashMessagesService } from 'angular2-flash-messages'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'

@Component({
  selector: 'app-payment-cards',
  templateUrl: './payment-cards.component.html',
  styleUrls: ['./payment-cards.component.css']
})
export class PaymentCardsComponent implements OnInit {

  elements: Elements;
  card: StripeElement;
 
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
 
  saveCardForm: FormGroup;

  isCardValid = true
  cardErrorMsg = ''
 
  constructor(
    private _fb: FormBuilder,
    private _stripeService: StripeService,
    private _stripePayService : StripePayService,
    private _flashMessagesService : FlashMessagesService,
    private _spinner : NgxSpinnerService,
    private _router : Router
  ) {}

  ngOnInit() {
    this.saveCardForm = this._fb.group({
      name : ['', [Validators.required, Validators.pattern(nameRegex)]]
    })
    this._stripeService.elements(this.elementsOptions)
    .subscribe(elements => {
      this.elements = elements;
      // Only mount the element the first time
      if (!this.card) {
        this.card = this.elements.create('card', {
          style: {
            base: {
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

  saveCard() {
    this._spinner.show()
    this.isCardValid = true
    const name = this.saveCardForm.get('name').value;
    this._stripeService
    .createToken(this.card, { name })
    .subscribe(result => {
      if (result.token) {
        const data = {
          token : result.token
        }
        this._stripePayService.saveCard(data, localStorage.getItem('mdrt'))
        .subscribe(
          response => {
            if (response['status']) {
              this._spinner.hide()
              this._flashMessagesService.show(response['message'], { cssClass: 'alert-success', timeout: 3000 });
              setTimeout(() => {
                this._router.navigate(['/dashboard/add-payment'])
              },3200)
            }
          },
          error => {
            this._spinner.hide()
            this._flashMessagesService.show(error['message'], { cssClass: 'alert-danger', timeout: 3000 });
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

}
