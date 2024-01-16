import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/public/signup/signup.component';
import { LoginComponent } from './components/public/login/login.component';
import { DashboardComponent } from './components/private/dashboard/dashboard.component';
import { PaypalComponent } from './components/private/paypal/paypal.component';
import { HomeComponent } from './components/public/home/home.component';
import { NavbarComponent } from './components/private/navbar/navbar.component';
import { SidebarComponent } from './components/private/sidebar/sidebar.component';
import { MemberlistComponent } from './components/private/memberlist/memberlist.component';
import { StafflistComponent } from './components/private/stafflist/stafflist.component';
import { ActiveridesComponent } from './components/private/activerides/activerides.component';
import { PastridesComponent } from './components/private/pastrides/pastrides.component';
import { ScheduleRideComponent } from './components/private/schedule-ride/schedule-ride.component';
import { ProfileComponent } from './components/private/profile/profile.component';
import { AddStaffComponent } from './components/private/add-staff/add-staff.component';
import { PatientsListComponent } from './components/private/patients-list/patients-list.component';
import { AddMemberComponent } from './components/private/add-member/add-member.component';
import { DriverArrivedComponent } from './components/private/driver-arrived/driver-arrived.component';
import { PaymentComponent } from './components/private/payment/payment.component';
import { AddPaymentComponent } from './components/private/add-payment/add-payment.component';
import { DriverComponent } from './components/public/driver/driver.component';
import { PatientComponent } from './components/public/patient/patient.component';
import { PastRideListingComponent } from './components/private/past-ride-listing/past-ride-listing.component';
import { PaymentCardsComponent } from './components/private/payment-cards/payment-cards.component';
import { PaynowComponent } from './components/private/paynow/paynow.component';
import { NewRequestComponent } from './components/private/new-request/new-request.component';
import { EditProfileComponent } from './components/private/edit-profile/edit-profile.component';
import { SettingsComponent } from './components/private/settings/settings.component'
import { HelpCenterComponent } from './components/private/help-center/help-center.component';
import { TermsComponent } from './components/public/terms/terms.component';
import { PrivacyPolicyComponent } from './components/public/privacy-policy/privacy-policy.component';
import { PendingRequestListComponent } from './components/private/pending-request-list/pending-request-list.component';

const routes: Routes = [
  { path : '' , component : HomeComponent},
  { path : 'welcome', redirectTo: '', pathMatch: 'full'},
  { path : 'welcome/:type' , component : HomeComponent},
  { path : 'signup/:type' , component : SignupComponent},
  { path : 'forgot-password/:token' , component : SignupComponent},
  { path : 'verify/email/:token' , component : HomeComponent},
  { path : 'dashboard/:route', component : DashboardComponent},
  { path : 'paypal', component : PaypalComponent },
  { path : 'transportationproviders', component: DriverComponent},
  { path : 'caregiver', component: PatientComponent},
  { path : 'terms-of-service' , component : TermsComponent},
  { path : 'privacy-policy' , component : PrivacyPolicyComponent},
  { path : '**' , component : SignupComponent},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
                                  HomeComponent, 
                                  SignupComponent, 
                                  LoginComponent,
                                  DashboardComponent,
                                  NavbarComponent,
                                  SidebarComponent,
                                  PaypalComponent,
                                  StafflistComponent,
                                  MemberlistComponent,
                                  ActiveridesComponent,
                                  PastridesComponent,
                                  ScheduleRideComponent,
                                  ProfileComponent,
                                  AddStaffComponent,
                                  PatientsListComponent,
                                  AddMemberComponent,
                                  DriverArrivedComponent,
                                  PaymentComponent,
                                  AddPaymentComponent,
                                  DriverComponent,
                                  PatientComponent,
                                  PastRideListingComponent,
                                  PaymentCardsComponent,
                                  PaynowComponent,
                                  NewRequestComponent,
                                  EditProfileComponent,
                                  SettingsComponent,
                                  TermsComponent,
                                  PrivacyPolicyComponent,
                                  PendingRequestListComponent
                                ]
