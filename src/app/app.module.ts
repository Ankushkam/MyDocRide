import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { WebsocketsService } from './websockets.service'

import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlashMessagesModule } from 'angular2-flash-messages';
import {AvatarModule } from 'ngx-avatar';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { NgxStripeModule } from 'ngx-stripe';

import { AngularFireMessagingModule} from '@angular/fire/messaging';
import { AngularFireDatabaseModule} from '@angular/fire/database';
import { AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFireModule} from '@angular/fire';

import { MessagingService } from './shared/messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '.../../node_modules/@angular/common';

import {SliderModule} from 'primeng/slider';
import { HelpCenterComponent } from './components/private/help-center/help-center.component';
import { TermsComponent } from './components/public/terms/terms.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrivacyPolicyComponent } from './components/public/privacy-policy/privacy-policy.component';
import { PendingRequestListComponent } from './components/private/pending-request-list/pending-request-list.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HelpCenterComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    PendingRequestListComponent,
  ],
  imports: [
    NgbModule, 
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    FlashMessagesModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    GooglePlaceModule,
    SliderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAJnDvfb4o372s6og8i70DPNAcD9FpnAT8',
      libraries : ['places', 'geometry']
    }),
    AgmDirectionModule,
    NgxSpinnerModule,
    AvatarModule,
    NgxStripeModule.forRoot('pk_test_g5Q5scGygiM0705URmkf9ryk00zoXr49AR'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [WebsocketsService, GoogleMapsAPIWrapper, MessagingService,AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
