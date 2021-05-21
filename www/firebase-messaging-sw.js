importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyAsotQdxTiETNT94d-EUyjueGGAyM-aRFw",
    authDomain: "aarondemo-b213d.firebaseapp.com",
    projectId: "aarondemo-b213d",
    storageBucket: "aarondemo-b213d.appspot.com",
    messagingSenderId: "1013731266865",
    appId: "1:1013731266865:web:f8bacd1cbdd272b672a010",
    measurementId: "G-DX5BTFPW0D"
};

firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log(payload);
    // const notification=JSON.parse(payload);
    // const notification=payload;
    // const notificationOption={
    //     // body:notification.body,
    //     body:"setBackgroundMessageHandler",
    //     icon:notification.icon
    // };
    // return self.registration.showNotification(payload.notification.title,notificationOption);
});