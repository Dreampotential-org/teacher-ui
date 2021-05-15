// importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');
// importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-analytics.js');
// importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-auth.js');
// importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-firestore.js');


// {/* <script src="https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.3.1/firebase-analytics.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js"></script> */}


  // <script src="https://www.gstatic.com/firebasejs/8.3.1/firebase-auth.js"></script>
  // <script src="https://www.gstatic.com/firebasejs/8.3.1/firebase-firestore.js"></script>


// var jQueryScript = document.createElement('script');  
// jQueryScript.setAttribute('src','https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
// document.head.appendChild(jQueryScript);
// var jQueryScript = document.createElement('script');  
// jQueryScript.setAttribute('src','https://www.gstatic.com/firebasejs/8.3.1/firebase-analytics.js');
// document.head.appendChild(jQueryScript);
// var jQueryScript = document.createElement('script');  
// jQueryScript.setAttribute('src','https://www.gstatic.com/firebasejs/8.3.1/firebase-auth.js');
// document.head.appendChild(jQueryScript);
// var jQueryScript = document.createElement('script');  
// jQueryScript.setAttribute('src','https://www.gstatic.com/firebasejs/8.3.1/firebase-firestore.js');
// document.head.appendChild(jQueryScript);
// var jQueryScript = document.createElement('script');  
// jQueryScript.setAttribute('src','https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');
// document.head.appendChild(jQueryScript);
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAsotQdxTiETNT94d-EUyjueGGAyM-aRFw",
  authDomain: "aarondemo-b213d.firebaseapp.com",
  projectId: "aarondemo-b213d",
  storageBucket: "aarondemo-b213d.appspot.com",
  messagingSenderId: "1013731266865",
  appId: "1:1013731266865:web:f8bacd1cbdd272b672a010",
  measurementId: "G-DX5BTFPW0D"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.getToken({vapidKey: 'BBfjYQURLUpseX1-EBJ_Ck9qLgGonOpw7_k-aqL1PUAgZE5f6DL-IoiPdf3qDid2pJpAbJCtzHlcNMw6A30XxMk'});

// // Get registration token. Initially this makes a network call, once retrieved
// // subsequent calls to getToken will return from cache.
// messaging.getToken({ vapidKey: 'BBfjYQURLUpseX1-EBJ_Ck9qLgGonOpw7_k-aqL1PUAgZE5f6DL-IoiPdf3qDid2pJpAbJCtzHlcNMw6A30XxMk' }).then((currentToken) => {
//   if (currentToken) {
//       console.log("currentToken",currentToken);
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // ...
});
messaging.onBackgroundMessage((payload) => {
  console.log('onBackgroundMessage Message received. ', payload);
  // ...
});