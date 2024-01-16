// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyAfBeqQZUey-TegOHHUvmFHOBKkPhP6p60",
    authDomain: "mydocride.firebaseapp.com",
    databaseURL: "https://mydocride.firebaseio.com",
    projectId: "mydocride",
    storageBucket: "mydocride.appspot.com",
    messagingSenderId: "174833023599",
    appId: "1:174833023599:web:d9150deb89abcd9f5feb9a",
    measurementId: "G-VMZQVGFEDK"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();