importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCvXqTc_1jvfPK4fVZWgh5N3lCaBsQUjVQ",
  authDomain: "suvidha-e0478.firebaseapp.com",
  projectId: "suvidha-e0478",
  storageBucket: "suvidha-e0478.firebasestorage.app",
  messagingSenderId: "962590184355",
  appId: "1:962590184355:web:fd5afc4ab90a5bb7de4016",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/favicon.ico",
    });
});