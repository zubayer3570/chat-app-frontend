// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBCKPF62012_YgooaFcu4RxgUGroTemFX4",
  authDomain: "chat-app-89528.firebaseapp.com",
  projectId: "chat-app-89528",
  storageBucket: "chat-app-89528.appspot.com",
  messagingSenderId: "95114678950",
  appId: "1:95114678950:web:c0507b153b7cc33b2dda67"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.message,
  };
  self.addEventListener("notificationclick", function(event){
    event.waitUntil(self.clients.openWindow(payload.data.url))
    event.notification.close();
  })
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});