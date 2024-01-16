import { environment } from '../../environments/environment';

let domain = 'https://www.mydocride.com'
let server = 'https://server2.chicmic.in/MyDocRide-Backend/public'

if (environment.production) {
    domain = 'https://www.mydocride.com'
    server = 'https://server2.chicmic.in/MyDocRide-Backend' //'https://www.mydocridewebapp.com'
}

//signup
export const doSignup = `${server}/api/v1/doSignup`
export const companies = `${server}/api/v1/companies`
export const passwordReset = `${server}/api/v1/password-reset`
export const resendVerificationEmai = `${server}/api/v1/resend-verification-email`

//login
export const saveTokenUrl = `${server}/api/v1/save-fcm-token`
export const verifyEmail = `${server}/api/v1/verify/email`
export const doLogin = `${server}/api/v1/doLogin`
export const passwordResetEMail = `${server}/api/v1/password-reset-email`

//user
export const getUser = `${server}/api/v1/user`
export const editUserUrl = `${server}/api/v1/edit`
export const updateUserUrl = `${server}/api/v1/user/update`
export const updatePasswordUrl = `${server}/api/v1/update-password`
export const updateHospitalUrl = `${server}/api/v1/update-hospital`

//dashboard
export const staffList = `${server}/api/v1/dashboard/staff-list`
export const memberList = `${server}/api/v1/dashboard/members-list`
export const logout = `${server}/api/v1/logout`

//verify user status
export const verifyUserStatus = `${server}/api/v1/verify-user-status`

//stafflist
export const addStaff = `${server}/api/v1/add-staff`
export const imageUpload = `${server}/api/v1/image-upload`
export const getDoctors = `${server}/api/v1/get-doctors`

//Patient and member List
export const getPatientsUrl = `${server}/api/v1/get-patients`
export const addMember = `${server}/api/v1/add-member`

//paypal
export const getPaypalToken = `${server}/api/v1/get-paypal-tokens`
export const paymentCapture = 'https://api.sandbox.paypal.com/v2/checkout/orders'

//Patient Ride 
export const getDistanceAndTime = `${server}/api/v1/distance-time`
export const getNearestCompaniesUrl = `${server}/api/nearest-company`
export const checkRequestStatusUrl = `${server}/api/check-request-status`
export const getAllPastRides = `${server}/api/v1/all-past-rides`
export const getCars = `${server}/api/search_cars`
export const saveRide = `${server}/api/v1/save-ride`
export const getRideInfo = `${server}/api/v1/ride-info`
export const cancelRide = `${server}/api/v1/cancel-ride`
export const getPastRides = `${server}/api/v1/past-rides`
export const getActiveRides = `${server}/api/v1/active-rides`
export const getWayPoints = 'https://maps.googleapis.com/maps/api/directions/json'
export const rideCompletedUrl = `${server}/api/v1/ride-completed`
export const payToDriverUrl = `${server}/api/v1/pay-to-driver`

//Payment 
export const getPaymentsInfo = `${server}/api/v1/payments`
export const stripePayUrl = `${server}/api/v1/stripe-pay`
export const payNowUrl = `${server}/api/v1/pay-with-selected-card`
export const saveCardUrl = `${server}/api/v1/save-card`
export const getCardsUrl = `${server}/api/v1/get-user-cards`

export const imageUrl = `${server}/profile_pictures`
export const getInTouchUrl = `${server}/api/v1/get-in-touch`

export const newAppointmentUrl = `${server}/api/v1/new-appointments`
export const checkRideInfo = `${server}/api/v1/checkRide`

//Pop Up Emails
export const pagePopupEmailUrl = `${server}/api/v1/page-popup-email`
//Pending Request
export const getPendingAppointmentUrl = `${server}/api/v1/pending-appointments`
export const setAppointmentStatusUrl = `${server}//api/v1/appointment-status`
