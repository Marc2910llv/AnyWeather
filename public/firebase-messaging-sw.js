/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDIiufBFxSFulspNspDn_FbkKj1ThKiMXM",
    authDomain: "weather-8d3e5.firebaseapp.com",
    projectId: "weather-8d3e5",
    storageBucket: "weather-8d3e5.appspot.com",
    messagingSenderId: "1001358431984",
    appId: "1:1001358431984:web:d64e7aff05eb3bbaeb5435",
    measurementId: "G-3P6T3F7XCT"
});

const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//       body: 'este es el body',
//       icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Firebase_icon.svg/2048px-Firebase_icon.svg.png'
//     };
  
//     self.registration.showNotification(notificationTitle,
//       notificationOptions);
//   });

//  self.addEventListener("push", (event) => {
//    const payload = event.data.json();
 //   const { title, ...options } = payload.notification;
  //  event.waitUntil(self.registration.showNotification(title, options));
 // });