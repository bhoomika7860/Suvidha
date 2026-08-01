import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCvXqTc_1jvfPK4fVZWgh5N3lCaBsQUjVQ",
  authDomain: "suvidha-e0478.firebaseapp.com",
  projectId: "suvidha-e0478",
  storageBucket: "suvidha-e0478.firebasestorage.app",
  messagingSenderId: "962590184355",
  appId: "1:962590184355:web:fd5afc4ab90a5bb7de4016",
  measurementId: "G-7GFDSZZ24C"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);