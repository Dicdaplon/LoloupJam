import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzl6ssQsLg4vRqjarElE4oPe-scsiG7aY",
  authDomain: "lolouptalk.firebaseapp.com",
  databaseURL: "https://lolouptalk-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lolouptalk",
  storageBucket: "lolouptalk.firebasestorage.app",
  messagingSenderId: "173396339741",
  appId: "1:173396339741:web:6c8142d6cb9e4c39f8eaf4",
  measurementId: "G-NMEJ2ZEZ41"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const analytics = getAnalytics(app);